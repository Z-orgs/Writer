import {
    Controller,
    Post,
    Param,
    Req,
    UseGuards,
    Put,
    Get,
} from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}
    @UseGuards(JwtAuthGuard)
    @Post()
    createComment(@Req() req, comment: CreateCommentDto) {
        return this.commentService.createComment(req.user.userId, comment);
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateComment(
        @Req() req,
        @Param('id') id: string,
        updateComment: UpdateCommentDto,
    ) {
        return this.commentService.updateComment(
            req.user.userId,
            id,
            updateComment,
        );
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteComment(@Req() req, @Param('id') id: string) {
        return this.commentService.deleteComment(req.user.userId, id);
    }
}
