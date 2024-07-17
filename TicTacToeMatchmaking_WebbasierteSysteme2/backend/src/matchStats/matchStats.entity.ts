import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    winner: number;

    @Column()
    p1: number;

    @Column()
    p2: number;

    @Column()
    p1_elo: number;

    @Column()
    p2_elo: number;

    @Column()
    p1_change: number;

    @Column()
    p2_change: number;

    @Column()
    gamestart: Date;


}


