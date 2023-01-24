import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCommentDto } from './create-sub.comment.dto';

export class UpdateSubCommentDto extends PartialType(CreateSubCommentDto) {}
