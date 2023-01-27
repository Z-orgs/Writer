import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
    @IsNotEmpty()
    post: string;
    @IsNotEmpty()
    content: string;
}
export class CreateSubCommentDto {
    @IsNotEmpty()
    comment: string;
    @IsNotEmpty()
    content: string;
}
