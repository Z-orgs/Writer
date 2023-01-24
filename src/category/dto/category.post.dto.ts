import { IsNotEmpty } from 'class-validator';

export class CategoryPostDto {
    @IsNotEmpty()
    post: string;
    @IsNotEmpty()
    category: string;
}
