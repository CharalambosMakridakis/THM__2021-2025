import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['company_email'])

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  company_email: string;

  @Column()
  company_number: string;

  @Column()
  department: string;

  @Column()
  password: string;
}