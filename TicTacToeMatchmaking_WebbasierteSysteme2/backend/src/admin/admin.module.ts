import {Module} from "@nestjs/common";
import {AdminController} from "./admin.controller";
import {UserService} from "../user/user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/user.entity";
import { QueueService } from "src/match/queue.service";
import { GameService } from "src/match/game.service";
import { Match } from "src/matchStats/matchStats.entity";
import { MatchStatsService } from "src/matchStats/matchStats.service";
import { PlayerStatsCache } from "src/matchStats/playerStatsCache.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Match])
    ],
    controllers: [AdminController],
    providers: [GameService, UserService, QueueService, MatchStatsService, PlayerStatsCache]
},)

export class AdminModule {
}