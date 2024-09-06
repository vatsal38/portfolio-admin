import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findByUsername(username);
      if (user) {
        throw new ConflictException('Username is already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.createUser(
        username,
        firstName,
        lastName,
        hashedPassword,
        email,
      );
    } catch (error) {
      console.log('error::: ', error);
      if (
        error instanceof ConflictException || 
        error.response?.statusCode === 409
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user: any = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async login(user: any) {
    const userData: any = await this.userRepository.findByUsername(
      user.username,
    );

    if (!userData) {
      throw new NotFoundException('User not found');
    }
    const payload = {
      username: userData.username,
      sub: userData._id,
    };
    return {
      message: 'Login successfully',
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          id: userData._id,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        },
      },
    };
  }
}
