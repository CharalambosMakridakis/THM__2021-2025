import { Module } from "@nestjs/common";
import { MatchStatsService } from "./matchStats.service";
import { MatchStatsController } from "./matchStats.controller";
import { PlayerStatsCache } from "./playerStatsCache.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/user.entity";
import {Match} from "./matchStats.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Match]),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [MatchStatsController],
    providers: [MatchStatsService, PlayerStatsCache]
},)

export class MatchStatsModule {

}