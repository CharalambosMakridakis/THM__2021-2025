import {Controller, ForbiddenException, Get, HttpStatus, Param, Post, Req, Session, StreamableFile} from "@nestjs/common";
import {Request} from "express";
import {UserService} from "../user/user.service";
import {GameService} from "src/match/game.service";
import {QueueService} from "src/match/queue.service";
import {MatchStatsService} from "../matchStats/matchStats.service";
import * as AdminDTO from "../dto/AdminDTO";
import * as MatchStatsDTO from "../dto/MatchStatsDTO";
import { SessionData } from "src/auth.middleware";
import {ApiBearerAuth, ApiHeader, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";


@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
@ApiHeader({
    name: 'X-Authentication',
    description: 'Format: Bearer your_token. The Authentication token that is being returned when logging in. Requires the User to have Admin access.',
    required: true,
    example: "Bearer your_token"
})
export class AdminController {
    constructor(
        private readonly userService: UserService,
        private readonly gameService: GameService,
        private readonly queueService: QueueService,
        private readonly matchStatsService: MatchStatsService
    ) {}

     checkAdminAccess(session: SessionData) {
        if(!session.isAdmin)
            throw new ForbiddenException('Access not allowed')
    }

    @Get('getQueue')
    @ApiResponse({
        status: 200,
        description: 'Returns the current queue.',
        type: AdminDTO.getQueueResponse,
    })
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: 'Access not allowed: User is not admin'})
    async getQueue(@Session() session: SessionData, @Req() req: Request): Promise<AdminDTO.getQueueResponse> {
        this.checkAdminAccess(session);
        try {
            return new AdminDTO.getQueueResponse(await this.queueService.getCurrentQueue())
        } catch (error) {
            throw error;
        }

    }

    @Get('getGames')
    @ApiResponse({
        status: 200,
        description: 'Returns an array of current games.',
        type: AdminDTO.getGameResponse,
        isArray: true,
    })
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: 'Access not allowed: User is not admin'})
    async getGames(@Session() session: SessionData, @Req() req: Request): Promise<AdminDTO.getGameResponse[]> {
        this.checkAdminAccess(session)
        try {
            return (await this.gameService.getCurrentGames()).map(game => new AdminDTO.getGameResponse(game));
        } catch (error) {
            throw error;
        }
    }

    @Get('getAllPlayers')
    @ApiResponse({
        status: 200,
        description: 'Returns an array of all players with relevant information.',
        type: AdminDTO.getAllPlayersResponse,
    })
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: 'Access not allowed: User is not admin'})
    async getAllPlayers(@Session() session: SessionData, @Req() req: Request): Promise<AdminDTO.getAllPlayersResponse>{
        this.checkAdminAccess(session)
        try {
            return new AdminDTO.getAllPlayersResponse(await this.userService.getAllUsers());
        } catch (error) {
            throw error;
        }
    }
    
    @Post(':id/data')
    @ApiParam({ name: 'id', description: 'The ID of the player.' })
    @ApiResponse({status: 404, description: 'User not found'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({
        status: 200,
        description: 'Returns data for a specific player.',
        type: AdminDTO.getPlayerDataResponse,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: 'Access not allowed: User is not admin'})
    async getPlayerData(@Param('id') id: number, @Session() session: SessionData, @Req() req: Request): Promise<AdminDTO.getPlayerDataResponse> {
        this.checkAdminAccess(session)
        try {
            return new AdminDTO.getPlayerDataResponse(await this.userService.getUserById(id));
        } catch (error) {
            throw error;
        }
    }

    @Post(':id/stats')
    @ApiParam({ name: 'id', description: 'The ID of the player.' })
    @ApiResponse({status: 404, description: 'User not found'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({
        status: 200,
        description: 'Returns stats for a specific player.',
        type: AdminDTO.getPlayerStatsResponse,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: 'Access not allowed: User is not admin'})
    async getPlayerStats(@Param('id') id: number, @Session() session: SessionData, @Req() req: Request): Promise<AdminDTO.getPlayerStatsResponse> {
        this.checkAdminAccess(session);
        try {
            return new AdminDTO.getPlayerStatsResponse(await this.matchStatsService.getPlayerStats(id));
        } catch (error) {
            throw error;
        }
    }

    @Post(':id/history')
    @ApiParam({ name: 'id', description: 'The ID of the player.' })
    @ApiResponse({status: 404, description: 'User not found'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({
        status: 200,
        description: 'Returns history for a specific player.',
        type: MatchStatsDTO.PlayerHistoryItemResponse,
        isArray: true,
    })
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: 'Access not allowed: User is not admin'})
    async getPlayerHistory(@Param('id') id: number, @Session() session: SessionData, @Req() req: Request): Promise<MatchStatsDTO.PlayerHistoryItemResponse[]> {
        this.checkAdminAccess(session);
        return await this.matchStatsService.getPlayerHistory(id)

    }

}