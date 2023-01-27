import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends Base {
	@Column()
	firstName: string;
	@Column()
	lastName: string;
	@Column()
	email: string;
	@Column()
	username: string;
	@Column()
	password: string;
	@Column()
	gender: string;
	@Column()
	nationalId: string;
	@Column()
	phone: string;
	@Column({
		default: null,
	})
	education: string;
	@Column({
		default: null,
	})
	currentJob: string;
	@Column({
		default: null,
	})
	hometown: string;
	@Column({
		default: null,
	})
	livingIn: string;
	@Column({
		default: false,
	})
	premium: boolean;
	@Column({
		default: false,
	})
	isActivate: boolean;
	@Column({
		default: null,
	})
	avatar: string;
	@Column({
		default: null,
	})
	bio: string;
	@Column()
	dob: Date;
	@Column({
		default: 0,
	})
	totalPosts: number;
	@Column({
		default: 0,
	})
	totalFollowing: number;
	@Column({
		default: 0,
	})
	totalFollower: number;
	@Column({
		type: 'text',
	})
	links: string;
	@Column({
		default: null,
	})
	linkedIn: string;
	@Column({
		default: null,
	})
	facebook: string;
	@Column({
		default: null,
	})
	instagram: string;
	@Column({
		default: null,
	})
	twitter: string;
	@Column({
		default: null,
	})
	snapChat: string;
	@Column({
		type: 'text',
	})
	following: string;
	@Column({
		type: 'text',
	})
	follower: string;
	@Column({
		default: false,
	})
	banned: boolean;
	@Column({
		default: 'user',
		update: false,
	})
	role: string;
}
