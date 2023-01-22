import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Post extends Base {
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
    type: 'text',
  })
  like: string;
  @Column({
    type: 'text',
  })
  comment: string;
}
