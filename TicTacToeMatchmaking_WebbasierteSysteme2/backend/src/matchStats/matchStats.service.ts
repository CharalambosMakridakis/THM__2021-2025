import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './matchStats.entity';
import { User } from 'src/user/user.entity';
import { PlayerStatsCache } from './playerStatsCache.service';

@Injectable()
export class MatchStatsService {
    constructor(
        @InjectRepository(Match) 
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly playerStatsCache: PlayerStatsCache,
    ) {}

    async saveMatch(gamestart: Date, winner: number, p1: number, p2: number, p1_elo: number, p2_elo: number, p1_change: number, p2_change: number): Promise<Match> {
        
        await this.playerStatsCache.updateStats(p1,winner)
        await this.playerStatsCache.updateStats(p2,winner)

        const match = new Match();
        match.gamestart = gamestart;
        match.winner = winner;
        match.p1 = p1;
        match.p2 = p2;
        match.p1_elo = p1_elo;
        match.p2_elo = p2_elo;
        match.p1_change = p1_change;
        match.p2_change = p2_change;
        return await this.matchRepository.save(match);
    }


    async getPlayerStats(playerId: number) {
        try {
            return await this.playerStatsCache.getStats(playerId)
        } catch(error) {
            throw new NotFoundException("User not found")
        }
    }

    async getPlayerHistory(playerId: number) : Promise<{won: number, op: string, date: string, elo_change: number}[]> {
        const matches = await this.matchRepository
            .createQueryBuilder('match')
            .where('match.p1 = :playerId OR match.p2 = :playerId', { playerId })
            .orderBy('match.gamestart', 'DESC')
            .take(20)
            .getMany();
        
        const responseData = [];
        for (const match of matches) {
            const op = await this.userRepository.findOne({
                where: { id: playerId === match.p1 ? match.p2 : match.p1 },
            });

            let wValue: number = 0
            if (match.winner === playerId) {
                wValue = 1;
            } else if (match.winner === 0) {
                wValue = 0;
            } else {
                wValue = 2;
            }
            responseData.push({
                won: wValue,
                op: op.username,
                date: match.gamestart,
                elo_change: playerId === match.p1 ? match.p1_change : match.p2_change
            });
        }

        return responseData;
    }

}