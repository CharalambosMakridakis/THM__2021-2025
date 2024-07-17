import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from 'socket.io';
import { QueueService } from "./queue.service";
import { GameService } from "./game.service";
import { User } from "src/user/user.entity";
import { SocketUserMap, UserSocketMap } from "./usersockets";
import * as jwt from 'jsonwebtoken';
import { UserService } from "src/user/user.service";
import { TicTacToe } from "./TicTacToe";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MatchStatsService } from "src/matchStats/matchStats.service";
import { MoveRequestDto } from "src/dto/MoveRequestDto";

@WebSocketGateway({path: '/ws', cors: true}) // cors brauchen wir später nicht mehr, wenn statisch frontend ausgeliefert wird
export class MatchGateway implements OnGatewayConnection { 

    constructor(
        private queueService: QueueService,
        private gameService: GameService,
        private userService: UserService,
        private matchStatsService: MatchStatsService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        ) {}

    @WebSocketServer()
    server: Server;
    
    
    handleConnection(client: Socket) {
        // @ts-ignore
        const token  = client.handshake.headers.tictactoe_token as string;
        try {
            const decodedToken = jwt.verify(token, 'Xhjsidfuhihxhqwu8ei12o312') as { userId: number };
            const userId = decodedToken.userId; 
            UserSocketMap.set(userId, client);
            SocketUserMap.set(client, userId);
            console.log("Socket connected");
        } catch (error) {
            client.disconnect();
        }
    }

    
   
    @SubscribeMessage('queue')
    async onQueue(@ConnectedSocket() socket: Socket): Promise<void> {
        const user: User = await this.userService.getUserById(SocketUserMap.get(socket));
        if(!user) return;
        const foundMatchUsers: User[] = await this.queueService.add(user); 
        
        if(foundMatchUsers) {
            const gameID = this.gameService.createGame(foundMatchUsers[0], foundMatchUsers[1]);  
            UserSocketMap.get(foundMatchUsers[0].id).emit("GAME", { msg: "GAME FOUND", gid: gameID });
            UserSocketMap.get(foundMatchUsers[1].id).emit("GAME", { msg: "GAME FOUND", gid: gameID });
        }
    }

    @SubscribeMessage('move')
    async onMove(@MessageBody() body: MoveRequestDto, @ConnectedSocket() socket: Socket): Promise<void> {
        const user: User = await this.userService.getUserById(SocketUserMap.get(socket));
        if(!user) return;
        const moveValue: number[] = this.gameService.makeMove(user, body.index);
        if(moveValue[0] === -100) return; // game not found

        const users: User[] = this.gameService.getUsersFromGame(user);
        const game: TicTacToe = this.gameService.getGame(user);
        let end: boolean = false;
        let winner: number = 0;
        if (moveValue.length > 1) { // move succeed
            UserSocketMap.get(users[0].id).emit("game_update", { board: moveValue });
            UserSocketMap.get(users[1].id).emit("game_update", { board: moveValue });
            return;
        }
        if (moveValue[0] === -3) { // draw
            UserSocketMap.get(users[0].id).emit("game_update", { state: "DRAW", board: game.getBoard() });
            UserSocketMap.get(users[1].id).emit("game_update", { state: "DRAW", board: game.getBoard() });
            await this.endGame(game, winner); 
            return;
        }
        if (moveValue[0] > 0) { // someone won
            if(users[0].id === moveValue[0]) {
                UserSocketMap.get(users[0].id).emit("game_update", { state: "YOU WON", board: game.getBoard() });
                UserSocketMap.get(users[1].id).emit("game_update", { state: "YOU LOST", board: game.getBoard() });
                end = true;
                winner = users[0].id;
            } else {
                UserSocketMap.get(users[1].id).emit("game_update", { state: "YOU WON", board: game.getBoard() });
                UserSocketMap.get(users[0].id).emit("game_update", { state: "YOU LOST", board: game.getBoard() });
                end = true;
                winner = users[1].id;
            }
            if(end) await this.endGame(game, winner); 
        }
        if (moveValue[0] === -1) return; // not your turn
        if (moveValue[0] === -2) return; // not a valid move
    }

    @SubscribeMessage('board')
    async onBoard(@ConnectedSocket() socket: Socket): Promise<void> {
        const user: User = await this.userService.getUserById(SocketUserMap.get(socket));
        const game: TicTacToe = this.gameService.getGame(user);
        if(!game) return;
        const board: number[] = game.getBoard();

        socket.emit("board_update", { board: board, turn: game.currentUser.id === user.id });
    }

    @SubscribeMessage('dequeue')
    async onDequeue(@ConnectedSocket() socket: Socket): Promise<void> { 
        const user: User = await this.userService.getUserById(SocketUserMap.get(socket));
        await this.queueService.remove(user.id);
    }

    async endGame(game: TicTacToe, winnerId: number){
        const old_user1Elo: number = game.user1.elo;
        const old_user2Elo: number = game.user2.elo;
        const eloDiffU1: number = await this.changeElo(game.user1.id, game.user2.elo, winnerId);
        const eloDiffU2: number = await this.changeElo(game.user2.id, game.user1.elo, winnerId);
        
        if(game.firstTurn.id === game.user1.id){
            await this.matchStatsService.saveMatch(game.gameStart, winnerId, game.user1.id, game.user2.id, old_user1Elo, old_user2Elo, eloDiffU1, eloDiffU2);
        }else{
            await this.matchStatsService.saveMatch(game.gameStart, winnerId, game.user2.id, game.user1.id, old_user2Elo, old_user1Elo, eloDiffU2, eloDiffU1);
        }

        this.gameService.removeGame(game.user1);
    }



    // won: >0UserID 0Draw
    async changeElo(userId: number, opponent_elo: number, winnerId: number) {
        const user: User = await this.userService.getUserById(userId);
        const oldElo: number = user.elo;
        const k: number = 20;
        let S: number;
        if(winnerId === userId) S = 1;
        if(winnerId !== userId) S = 0;
        if(winnerId === 0) S = 0.5;
        const E: number = (1) / (1 + Math.pow(10, (opponent_elo - user.elo) / 400))
        const newElo: number = user.elo + k * (S - E);
        user.elo = newElo;
        await this.userRepository.save(user);
        return newElo - oldElo;
    }
}

