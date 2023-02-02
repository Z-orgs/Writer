import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	/**
	 * The constructor function is a function that is called when a new instance of the class is created.
	 * @param {UserService} userService - This is the service that we created earlier.
	 * @param {JwtService} jwtService - JwtService - This is the JWT service that we imported from
	 * @nestjs/jwt.
	 */
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}
	/**
	 * It checks if the user exists in the database, if the password is equal to the user password, and if
	 * the user is banned. If all of these conditions are met, it returns the user data
	 * @param {string} username - The username of the user.
	 * @param {string} pass - The password that the user entered.
	 * @returns The user object without the password.
	 */
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
	/**
	 * It takes a user object, creates a payload object, and then signs the payload object with the JWT
	 * service
	 * @param {User} user - User - this is the user object that is passed in from the controller.
	 * @returns The access_token is being returned.
	 */
	async login(user: User) {
		const payload = { username: user.username, sub: user.id, role: user.role };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
