import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
import { QueueService } from "./queue.service";
import { MatchGateway } from "./match.gateway";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "src/matchStats/matchStats.entity";
import { MatchStatsService } from "src/matchStats/matchStats.service";
import { PlayerStatsCache } from "src/matchStats/playerStatsCache.service";
import { MatchController } from "./match.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Match]),
    ],
    controllers: [MatchController],
    providers: [MatchGateway, GameService, QueueService, UserService, PlayerStatsCache, MatchStatsService]
})
export class MatchModule {

}