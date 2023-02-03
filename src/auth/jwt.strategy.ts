import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstant } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	/**
	 * The function is called when the user tries to log in. It takes the user's credentials and checks
	 * them against the database. If the credentials are valid, it creates a token and sends it back to the
	 * user.
	 */
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstant.secret,
		});
	}

	/**
	 * The validate function is called by the JWT strategy when a user tries to authenticate. The payload
	 * is the decoded JWT token. The validate function returns the user object that will be attached to the
	 * request object
	 * @param {any} payload - The decoded JWT payload.
	 * @returns The userId, username, and role of the user.
	 */
	async validate(payload: any) {
		return { id: payload.sub, username: payload.username, role: payload.role };
	}
}
