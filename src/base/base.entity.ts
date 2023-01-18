import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: EntityId;
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: string;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: string;
  @DeleteDateColumn({
    name: 'deteled_at',
  })
  deletedAt: Date;
}
