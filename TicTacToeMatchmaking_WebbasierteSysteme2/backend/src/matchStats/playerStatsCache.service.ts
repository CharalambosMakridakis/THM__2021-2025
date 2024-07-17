import { Injectable } from '@nestjs/common';
import { PlayerStats } from './playerStats';
import {InjectRepository} from "@nestjs/typeorm";
import {Match} from "./matchStats.entity";
import {Repository} from "typeorm";

@Injectable()
export class PlayerStatsCache {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>) {}

    private static playerStatsMap: Map<number, PlayerStats> = new Map();


    async getStats(playerId: number){
        if (PlayerStatsCache.playerStatsMap.has(playerId)) {
            return PlayerStatsCache.playerStatsMap.get(playerId);
        }else {
            const playerStats =  await this.loadStats(playerId);
            PlayerStatsCache.playerStatsMap.set(playerId, playerStats);
            return playerStats;
        }

    }

    async updateStats(playerId: number, result: number) {
        if (PlayerStatsCache.playerStatsMap.has(playerId)) {
            const updatedStats: PlayerStats = PlayerStatsCache.playerStatsMap.get(playerId);
            if (result === 0)
                updatedStats.draws++;
            else if (result === playerId)
                updatedStats.wins++;
            else updatedStats.losses++;
            PlayerStatsCache.playerStatsMap.set(playerId, updatedStats);
        }

    }

    async loadStats(playerId: number) {
        const matches = await this.matchRepository
            .createQueryBuilder('match')
            .where('match.p1 = :playerId OR match.p2 = :playerId', { playerId })
            .orderBy('match.gamestart', 'DESC')
            .getMany();

        let draws: number = 0;
        let wins: number = 0;
        let losses: number = 0;
        matches.forEach(Match => {
            if(Match.winner === 0)
                draws++;
            else if (Match.winner === playerId)
                wins++;
            else losses++;
        })
        return {playerId, wins: wins, losses: losses, draws: draws} as PlayerStats;
    }
}
