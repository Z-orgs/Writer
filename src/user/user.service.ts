import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async register(user: UserDto) {
    user.password = await bcrypt.hash(user.password, 10);
    const validEmail = await this.userRepository.findOneBy({
      email: user.email,
    });
    const validUsername = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (validEmail) {
      throw new HttpException('Email already exist.', HttpStatus.BAD_REQUEST);
    }
    if (validUsername) {
      throw new HttpException(
        'Username already exist.',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.insert(user);
    return new HttpException('Register successfully', HttpStatus.ACCEPTED);
  }
}
