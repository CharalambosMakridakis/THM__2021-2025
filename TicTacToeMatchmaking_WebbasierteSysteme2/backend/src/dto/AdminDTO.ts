import { ApiProperty } from '@nestjs/swagger';
import {User} from "../user/user.entity";
import {GetProfileResponse} from "./UserDTO";
import {TicTacToe} from "../match/TicTacToe";
import {PlayerStats} from "../matchStats/playerStats";

export class getQueueResponse {
    @ApiProperty({ description: 'Returns a ProfileResponse of all Users currently in Queue which only sends the relevant user data as an array', example: [{id: 1, username: 'user', isAdmin:false, elo: 1000}] })
    queue: GetProfileResponse[];

    constructor(queue: User[]) {
        this.queue = queue.map((user) => new GetProfileResponse(user));
    }

}

export class getGameResponse {
    @ApiProperty({ description: 'The unique game id', example: '12Hci3nliq' })
    id: string;
    @ApiProperty({ description: 'The username of player 1', example: 'user1' })
    username_1: string;
    @ApiProperty({ description: 'The username of player 2', example: 'user2' })
    username_2: string;
    @ApiProperty({ description: 'The Time when the game started', example: '2024-03-12T15:07:36.306Z' })
    gameStart: Date;

    constructor(game: TicTacToe ) {
        this.id = game.gameId;
        this.username_1 = game.user1.username;
        this.username_2 = game.user2.username;
        this.gameStart = game.gameStart;
    }

}

export class getAllPlayersResponse {
    @ApiProperty({ description: 'Returns a ProfileResponse Array of all existing users which only sends the relevant user data as an array', example: [{id: 1, username: 'user', isAdmin:false, elo: 1000}] })
    players: Array<{ id: number; username: string; isAdmin: boolean; elo: number }>;

    constructor(players: User[]) {
    this.players = players.map(user => ({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        elo: user.elo,
    }));
    }
}

export class getPlayerDataResponse {
    @ApiProperty({ description: 'Returns all relevant info of a User', example: {id: 1, username: 'user', isAdmin:false, elo: 1000} })
    player: GetProfileResponse;

constructor(player: User) {
    this.player = new GetProfileResponse(player);
}
}

export class getPlayerStatsResponse {
    @ApiProperty({ description: 'Returns the Id and the amount of wins/losses/draws for that user', example: {playerId: 1, wins: 5, losses:3, draws: 2} })
    stats: PlayerStats;

    constructor(stats: PlayerStats) {
        this.stats = stats;
    }
}

