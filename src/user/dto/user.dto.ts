import {
    IsNotEmpty,
    IsEmail,
    IsEnum,
    IsPhoneNumber,
    MinLength,
    IsDateString,
} from 'class-validator';
import { Gender } from 'src/type/entity.type';

export class UserDto {
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @MinLength(10)
    password: string;
    @IsEnum(Gender)
    gender: string;
    @IsNotEmpty()
    nationalId: string;
    @IsPhoneNumber()
    phone: string;
    @IsDateString()
    dob: Date;
}
