import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ default: 1000 })
    elo: number;

    @Column( { default: "default.png" })
    image_name: string;
}
