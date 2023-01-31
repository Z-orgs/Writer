import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}
	async validateUser(username: string, pass: string): Promise<any> {
		/* Checking if the user exists in the database. */
		const user = await this.userService.findOneBy({ username: username });
		if (!user) {
			return null;
		}
		/* Checking if the password is equal to the user password. */
		const isEqual = compareSync(pass, user.password);
		if (!isEqual) {
			return null;
		}
		if (user.banned) {
			return null;
		}
		const { password, ...result } = user;
		return result;
	}
	async login(user: User) {
		const payload = { username: user.username, sub: user.id, role: user.role };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
