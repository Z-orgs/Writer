import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'likePost' })
export class LikeEntity extends Base {
	@Column()
	user: string;
	@Column()
	post: string;
}
