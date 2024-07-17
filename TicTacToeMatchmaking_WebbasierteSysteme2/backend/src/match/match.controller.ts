import {Controller, Get, HttpException, HttpStatus, Req, Session, StreamableFile} from '@nestjs/common';
import {UserSocketMap} from './usersockets';
import {GameService} from './game.service';
import {UserService} from 'src/user/user.service';
import {User} from 'src/user/user.entity';
import {TicTacToe} from './TicTacToe';
import {createReadStream} from 'fs';
import {Request} from "express";
import {join} from 'path';
import {ApiBearerAuth, ApiHeader, ApiResponse, ApiTags} from "@nestjs/swagger";
import * as MatchDTO from '../dto/MatchDTO'
import { SessionData } from 'src/auth.middleware';

@ApiTags('Match')
@Controller('match')
@ApiBearerAuth()
@ApiHeader({
    name: 'X-Authentication',
    description: 'Format: Bearer your_token. The Authentication token that is being returned when logging in. Only requires a valid User.  ',
    required: true,
    example: "Bearer your_token"
})
export class MatchController {
    constructor(private readonly gameService: GameService, private readonly userService: UserService){}


    @ApiResponse({
        status: 200,
        description: 'Returns information about the opponent.',
        type: MatchDTO.OnOpponentInfoResponse,
    })
    @ApiResponse({status: 404, description: 'The opponent could not be found'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @Get('opponent_info')
    async onOpponentInfo(@Session() session: SessionData, @Req() req: Request): Promise<MatchDTO.OnOpponentInfoResponse> {
        const userId: number = session.userId;
        if(!userId)
            throw new HttpException('', HttpStatus.UNAUTHORIZED);
        if(!UserSocketMap.get(userId))
            throw new HttpException('', HttpStatus.NOT_FOUND);

        const user: User = await this.userService.getUserById(userId);
        if(!user)
            throw new HttpException('USER', HttpStatus.NOT_FOUND);

        const game: TicTacToe = this.gameService.getGame(user);
        if(!game)
            throw new HttpException('GAME', HttpStatus.NOT_FOUND);

        const opponent: User = game.user1.id === user.id ? game.user2 : game.user1;
        return new MatchDTO.OnOpponentInfoResponse(opponent.elo, opponent.username);
    }

    @Get('opponent_img')
    @ApiResponse({
        status: 200,
        description: 'Returns the profile picture of the opponent.',
    })
    @ApiResponse({status: 404, description: 'The opponent could not be found'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    async getFile(@Session() session: SessionData, @Req() req: Request): Promise<any> {
        const userId: number = session.userId;
        if(!userId)
            throw new HttpException('', HttpStatus.UNAUTHORIZED);
        if(!UserSocketMap.get(userId))
            throw new HttpException('', HttpStatus.NOT_FOUND);

        const user: User = await this.userService.getUserById(userId);
        if(!user)
            throw new HttpException('USER', HttpStatus.NOT_FOUND);

        const game: TicTacToe = this.gameService.getGame(user);
        if(!game)
            throw new HttpException('GAME', HttpStatus.NOT_FOUND);

        const opponent: User = game.user1.id === user.id ? game.user2 : game.user1;
        const opponent_img: string = opponent.image_name;

        const file = createReadStream(join('./uploads/', opponent_img));
        return new StreamableFile(file);
    }

    @Get('ingame')
    @ApiResponse({
        status: 200,
        description: 'Checks if the user is currently ingame.',
        type: MatchDTO.ingameResponse,
    })
    @ApiResponse({status: 404, description: 'The User could not be found'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    async onInGame(@Session() session: SessionData, @Req() req: Request): Promise<MatchDTO.ingameResponse> {
        const userId: number = session.userId;
        if(!userId)
            throw new HttpException('', HttpStatus.UNAUTHORIZED);

        const user: User = await this.userService.getUserById(userId);
        if(!user)
            throw new HttpException('USER', HttpStatus.NOT_FOUND);

        const game: TicTacToe = this.gameService.getGame(user);
        return new MatchDTO.ingameResponse(!!game);
    }
}