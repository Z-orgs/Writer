import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateCommentDto, CreateSubCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @IsNotEmpty()
    content: string;
}
export class UpdateSubCommentDto extends PartialType(CreateSubCommentDto) {
    @IsNotEmpty()
    content: string;
}
