import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Comment extends Base {
	@Column()
	post: string;
	@Column()
	user: string;
	@Column({
		type: 'text',
	})
	content: string;
}
