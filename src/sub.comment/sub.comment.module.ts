import { Module } from '@nestjs/common';
import { SubCommentService } from './sub.comment.service';
import { SubCommentController } from './sub.comment.controller';

@Module({
  controllers: [SubCommentController],
  providers: [SubCommentService]
})
export class SubCommentModule {}
