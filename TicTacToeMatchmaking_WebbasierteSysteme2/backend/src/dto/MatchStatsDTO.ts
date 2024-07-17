import {PlayerStats} from "../matchStats/playerStats";
import {ApiProperty} from "@nestjs/swagger";

export class getPlayerStatsResponse {
    @ApiProperty({ description: 'Stats contains the userId and the results of all the played games for this user', example: { playerId: 1 ,wins: 5 ,losses: 3 ,draws: 2 }})
    stats: PlayerStats;

    constructor(stats: PlayerStats) {
        this.stats = stats;
    }

}

export class PlayerHistoryItemResponse {
    @ApiProperty({ description: 'indicates if the user won, 0=draw, 1=win, 2=loss', example: '1'  })
    won: number;

    @ApiProperty({ description: 'The username of the opponent', example: 'kittycat123' })
    op: string;

    @ApiProperty({ description: 'The date of the gamestart', example: '2024-03-04T14:30:00'  })
    date: string;

    @ApiProperty({ description: 'The elo gained or lost in the match', example: '10'  })
    elo_change: number;

    constructor(won: number, op: string, date: string, elo_change: number) {
        this.won = won;
        this.op = op;
        this.date = date;
        this.elo_change = elo_change;
    }
}