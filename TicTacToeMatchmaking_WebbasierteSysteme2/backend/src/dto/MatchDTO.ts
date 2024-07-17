import { ApiProperty } from '@nestjs/swagger';

export class OnOpponentInfoResponse {
    @ApiProperty({ description: 'Elo of the opponent', example: 1000 })
    opponent_elo: number;

    @ApiProperty({ description: 'Username of the opponent', example: 'opponent123' })
    opponent_username: string;

    constructor(opponent_elo: number, opponent_username: string) {
        this.opponent_elo = opponent_elo;
        this.opponent_username = opponent_username;
    }
}

export class ingameResponse {
    @ApiProperty({ description: 'returns a boolean indicating if the user is currently ingame', example: true })
    ingame: boolean;

    constructor(ingame: boolean) {
        this.ingame = ingame;
    }
}