import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	/**
	 * The constructor function is a special function that is called when an instance of the class is
	 * created.
	 * @param {AuthService} authService - AuthService - This is the service that will be used to
	 * authenticate the user.
	 */
	constructor(private authService: AuthService) {
		super();
	}
	/**
	 * If the user is not found, throw an UnauthorizedException.
	 * @param {string} username - string - The username of the user.
	 * @param {string} password - The password that the user entered.
	 * @returns The user object is being returned.
	 */
	async validate(username: string, password: string): Promise<User> {
		const user = await this.authService.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
