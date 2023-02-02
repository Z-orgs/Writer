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
	 *
	 * The constructor function is used to initialize the instance members of the class.
	 *
	 * The constructor function is called automatically when the class is instantiated.
	 *
	 * The constructor function is called before the new object is returned to the caller.
	 *
	 * The constructor function is called with the new keyword.
	 *
	 * The constructor function is called with the this keyword.
	 *
	 * The constructor function is called with the arguments passed to the class.
	 *
	 * The constructor function is called with the super keyword.
	 *
	 * The constructor function is called with the super() function.
	 *
	 * The constructor function is called with the super.function() function.
	 *
	 * The constructor function is called with the super.constructor() function.
	 * @param {AuthService} authService - AuthService
	 */
	constructor(private authService: AuthService) {
		super();
	}

	/**
	 * The validate function is called by the NestJS framework when a user attempts to login.
	 *
	 * The validate function is passed the username and password that the user entered.
	 *
	 * The validate function calls the validateUser function in the AuthService.
	 *
	 * The validateUser function returns a user object if the username and password are valid.
	 *
	 * If the username and password are not valid, the validateUser function returns null.
	 *
	 * If the validateUser function returns null, the validate function throws an UnauthorizedException.
	 *
	 * If the validateUser function returns a user object, the validate function returns the user object.
	 *
	 * The validate function is called by the NestJS framework when a user attempts to login.
	 *
	 * The validate function is passed the username and password that the user entered.
	 *
	 * The validate function calls the validateUser function in the AuthService.
	 *
	 * The validateUser function returns a user object if the username and
	 * @param {string} username - The username of the user that is trying to log in.
	 * @param {string} password - The password that was sent in the request.
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
