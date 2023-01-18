import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { BaseDto } from 'src/base/base.dto';

export class UserDto extends BaseDto {
  @IsNotEmpty()
  @Length(10, 50)
  password: string;
  firstName: string;
  lastName: string;
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  @Expose()
  fullName: string;
  @Expose()
  isActive: boolean;
  @Expose()
  role: string;
}
