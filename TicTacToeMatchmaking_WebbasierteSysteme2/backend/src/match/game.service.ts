import { Injectable } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { TicTacToe } from "./TicTacToe";

@Injectable()
export class GameService {

    public static games: TicTacToe[] = [];

    constructor() {}

    createGame(user1: User, user2: User): string {
        const game: TicTacToe = new TicTacToe(user1, user2);
        GameService.games.push(game);
        return game.gameId;
    }

    makeMove(user: User, index: number): number[] {
        
        const game: TicTacToe = GameService.games.find(game => game.user1.id === user.id || game.user2.id === user.id);
        if(!game) {
            return [-100];
        }

        //-1WrongUser -2NotValidMove -3Draw 0Success >0WinnerID
        const returnValue: number = game.makeMove(user, index);

        if(returnValue === 0) {
            return game.getBoard();
        }

        return [returnValue];
    }
  
    getGame(user: User): TicTacToe {
        return GameService.games.filter(game => game.user1.id === user.id || game.user2.id === user.id).pop();
    }

    getUsersFromGame(user: User): User[] {
        const game: TicTacToe = this.getGame(user);
        return [game.user1, game.user2];
    }
  
    removeGame(user: User): void {
        GameService.games = GameService.games.filter(game => game.user1.id !== user.id && game.user2.id !== user.id);
    }

    async getCurrentGames() {
        return GameService.games;
    }
}