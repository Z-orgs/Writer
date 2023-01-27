import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class CategoryPost extends Base {
	@Column()
	category: string;
	@Column()
	post: string;
}
