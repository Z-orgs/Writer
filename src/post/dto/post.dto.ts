import { IsNotEmpty } from 'class-validator';

export class PostDto {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    content: string;
}
