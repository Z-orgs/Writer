declare module 'imgur';
import { Request } from 'express';
import { User } from './user/entities/user.entity';
declare module 'express' {
	export interface Request {
		user: User;
	}
}
