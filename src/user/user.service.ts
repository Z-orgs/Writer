import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { EntityId } from 'typeorm/repository/EntityId';
import { UpdateUserDto } from './dto/update.user.dto';
import { ExecOptions } from 'child_process';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  findOneBy(arg0: { username: string }) {
    return this.userRepository.findOneBy(arg0);
  }
  async update(id: EntityId, user: User) {
    return this.userRepository.update(id, user);
  }
  async register(user: UserDto) {
    user.password = await bcrypt.hash(user.password, 10);
    /* Checking if the email and username already exist in the database. */
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
    /* Creating a new user object and then insert it into the database. */
    const tmpData = new User();
    const tmpUser = { ...tmpData, ...user };
    tmpUser.drafts = JSON.stringify([]);
    tmpUser.posts = JSON.stringify([]);
    tmpUser.savedPosts = JSON.stringify([]);
    tmpUser.links = JSON.stringify([]);
    tmpUser.following = JSON.stringify([]);
    tmpUser.follower = JSON.stringify([]);
    await this.userRepository.insert(tmpUser as User);
    return new HttpException('Register successfully', HttpStatus.ACCEPTED);
  }
  async getUser(username: string) {
    /* Getting the user from the database. */
    let user: any = await this.userRepository.findOneBy({ username });
    /* Converting the string to array. */
    const convertUser = {
      posts: JSON.parse(user.posts),
      drafts: JSON.parse(user.drafts),
      savedPosts: JSON.parse(user.savedPosts),
      links: JSON.parse(user.links),
      following: JSON.parse(user.following),
      follower: JSON.parse(user.follower),
    };
    /* Merging the user object with the convertUser object. */
    user = { ...user, ...convertUser };
    return user;
  }
  async doFollow(username: string, targetUsername: string) {
    try {
      /* Getting the user and target user from the database. */
      let targetUser = await this.userRepository.findOneBy({
        username: targetUsername,
      });
      let user = await this.userRepository.findOneBy({ username });
      /* Converting the string to array. */
      let tmpFollower: EntityId[] = JSON.parse(targetUser.follower);
      let tmpFollowing: EntityId[] = JSON.parse(user.following);
      /* Checking if the user already followed the target user. */
      if (
        tmpFollower.indexOf(user.id) != -1 ||
        tmpFollowing.indexOf(targetUser.id) != -1
      ) {
        return new HttpException(
          'The user already followed the target user.',
          HttpStatus.BAD_REQUEST,
        );
      }
      /* Adding the user id to the follower array and the target user id to the following array. */
      tmpFollower = [...tmpFollower, user.id];
      targetUser = {
        ...targetUser,
        ...{ follower: JSON.stringify(tmpFollower) },
      } as User;

      tmpFollowing = [...tmpFollowing, targetUser.id];
      user = {
        ...user,
        ...{ following: JSON.stringify(tmpFollowing) },
      } as User;

      /* Updating the user and target user in the database. */
      this.userRepository.update(user.id, user);
      this.userRepository.update(targetUser.id, targetUser);

      return new HttpException('Follow successfully', HttpStatus.ACCEPTED);
    } catch (error) {
      return new HttpException('Something was wrong.', HttpStatus.BAD_REQUEST);
    }
  }
  async doUnFollow(username: string, targetUsername: string) {
    try {
      /* Getting the user and target user from the database. */
      let targetUser = await this.userRepository.findOneBy({
        username: targetUsername,
      });
      let user = await this.userRepository.findOneBy({ username });
      /* Converting the string to array. */
      const tmpFollower: EntityId[] = JSON.parse(targetUser.follower);
      const tmpFollowing: EntityId[] = JSON.parse(user.following);
      /* Checking if the user is following the target user. */
      if (
        tmpFollower.indexOf(user.id) == -1 ||
        tmpFollowing.indexOf(targetUser.id) == -1
      ) {
        return new HttpException(
          'The user is not following the target user.',
          HttpStatus.BAD_REQUEST,
        );
      }
      /* Removing the user id from the following array and the target user id from the follower array. */
      tmpFollowing.splice(tmpFollowing.indexOf(user.id), 1);
      user = {
        ...user,
        ...{ following: JSON.stringify(tmpFollowing) },
      } as User;
      tmpFollower.splice(tmpFollower.indexOf(targetUser.id), 1);
      targetUser = {
        ...targetUser,
        ...{ follower: JSON.stringify(tmpFollower) },
      } as User;
      /* Updating the user and target user in the database. */
      this.userRepository.update(user.id, user);
      this.userRepository.update(targetUser.id, targetUser);

      return new HttpException('Unfollow successfully', HttpStatus.ACCEPTED);
    } catch (error) {
      return new HttpException('Something was wrong.', HttpStatus.BAD_REQUEST);
    }
  }
}
