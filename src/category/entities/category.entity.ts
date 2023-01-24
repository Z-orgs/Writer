import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends Base {
    @Column()
    category: string;
}
