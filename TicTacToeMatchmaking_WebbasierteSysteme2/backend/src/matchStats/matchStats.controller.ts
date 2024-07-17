import {Controller, Get, HttpStatus, Req, Request, Session} from '@nestjs/common';
import {MatchStatsService} from './matchStats.service';
import * as MatchStatsDTO from '../dto/MatchStatsDTO'
import { SessionData } from 'src/auth.middleware';
import {ApiBearerAuth, ApiHeader, ApiResponse, ApiTags} from "@nestjs/swagger";
@ApiTags('MatchStats')
@Controller('matchStats')
@ApiBearerAuth()
@ApiHeader({
    name: 'X-Authentication',
    description: 'Format: Bearer your_token. The Authentication token that is being returned when logging in. Only requires a valid User.',
    required: true,
    example: "Bearer your_token"
})
export class MatchStatsController {
    constructor(
        private readonly matchStatsService: MatchStatsService,
    ) {}

    @Get('/stats')
    @ApiResponse({
        status: 200,
        description: 'Returns the UserId and the corresponding wins/losses/draws.',
        type: MatchStatsDTO.getPlayerStatsResponse,
    })
    @ApiResponse({status: 404, description: 'The User could not be found'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    async getPlayerStats(@Session() session: SessionData, @Req() req: Request): Promise<MatchStatsDTO.getPlayerStatsResponse>{
        const playerId = session.userId;
        
        try {
            return new MatchStatsDTO.getPlayerStatsResponse(await this.matchStatsService.getPlayerStats(playerId));
        } catch(error) {
            throw error;
        }

    }

    @Get('/history')    @ApiResponse({
        status: 200,
        description: 'Returns the History of a player containing as an Array.',
        type: MatchStatsDTO.PlayerHistoryItemResponse,
        isArray: true
    })
    @ApiResponse({status: 404, description: 'The User could not be found'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    async getPlayerHistory(@Session() session: SessionData, @Req() req: Request): Promise<MatchStatsDTO.PlayerHistoryItemResponse[]> {
        const playerId = session.userId;
        try {
            return await this.matchStatsService.getPlayerHistory(playerId)
        } catch(error) {
            throw error
        }

    }
}
