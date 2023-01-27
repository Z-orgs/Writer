import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'post' })
export class PostEntity extends Base {
	@Column({
		default: 'text',
	})
	title: string;
	@Column({
		type: 'text',
	})
	description: string;
	@Column({
		type: 'text',
	})
	content: string;
	@Column({
		default: 0,
	})
	totalLikes: number;
	@Column({
		default: 0,
	})
	totalComments: number;
	@Column()
	owner: string;
	@Column({
		default: 'pending',
	})
	status: string;
}
