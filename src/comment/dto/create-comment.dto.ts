import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
    @IsNotEmpty()
    post: string;
    @IsNotEmpty()
    content: string;
}
