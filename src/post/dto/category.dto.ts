import { IsNotEmpty } from 'class-validator';

export class CategoryDto {
    @IsNotEmpty()
    categories: string[];
}
