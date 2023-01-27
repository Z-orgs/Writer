import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class SubComment extends Base {
    @Column()
    comment: string;
    @Column()
    user: string;
    @Column({
        type: 'text',
    })
    content: string;
}
