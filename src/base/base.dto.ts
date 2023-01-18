import { Expose } from 'class-transformer';
import { EntityId } from 'typeorm/repository/EntityId';

export abstract class BaseDto {
  @Expose()
  id: EntityId;
}
