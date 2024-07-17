import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import {LoginDTO, RegisterDTO} from "../dto/UserDTO";


@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {
  }

  private generateToken(user: User): string {
    const payload = {userId: user.id, isAdmin: user.isAdmin};
    const expiresIn = 3600 * 24 * 30; // 1 hour * 24 hours * 30 days 

    return jwt.sign(payload, 'Xhjsidfuhihxhqwu8ei12o312', {expiresIn});
  }


  async register(userDTO: RegisterDTO): Promise<User> {
    try {

      const existingUser: User = await this.userRepository.findOne({ where: { username: userDTO.username } });

      if (existingUser) {
        throw new ConflictException('Username already taken');
      }
      const user: User = this.userRepository.create({
        username: userDTO.username,
        password: userDTO.password,
      });
      user.password = bcrypt.hashSync(user.password, 10);
      return this.userRepository.save(user);
    }
    catch (error) {
      if (error instanceof ConflictException) {

        console.error('Registration failed: Username already taken');
        throw error;
      } else {
        console.error('Registration failed:', error);
        throw error;
      }
    }

  }

  async login(loginDTO: LoginDTO): Promise<{ token: string } | null> {
    const existingUser: User = await this.userRepository.findOne({
      where: {username: loginDTO.username},
    });

    if (!existingUser) {
      throw new NotFoundException('Username not found!');
    }

    const password_matches: boolean = await bcrypt.compare(loginDTO.password, existingUser.password);

    if (password_matches) {
      const token: string = this.generateToken(existingUser);
      return {token};
    } else {
      throw new ConflictException('Username and password do not match!');
    }
  }


  async updateUsername(userId: number, newUsername: string): Promise<void> {
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });
    const new_user: User = await this.userRepository.findOne( {
      where: { username: newUsername}
    })
    if (new_user) {
      throw new ConflictException('Username already taken');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.username = newUsername;
    await this.userRepository.save(user)

  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const user: User = await this.userRepository.findOne({
      where: {id: userId},
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await this.userRepository.save(user);
  }

  async updateProfilePicture(userId: number, imagePath: string) {
    try {
      await this.userRepository.update(userId, {image_name: imagePath});

    } catch (error) {
      throw error
    }
    }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(userId: number) {
    const user: User = await this.userRepository.findOne({
      where: {id: userId},
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user


  }

  async getProfilePicture(userId: number) {
    const user: User = await this.userRepository.findOne({
      where: {id: userId},
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.image_name
  }

}