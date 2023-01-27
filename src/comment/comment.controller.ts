import { Controller, Post, Param, Req, UseGuards, Put, Get } from '@nestjs/common';
import { Body, Delete } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto, CreateSubCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto, UpdateSubCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}
	// comment
	@UseGuards(JwtAuthGuard)
	@Post()
	createComment(@Req() req, @Body() comment: CreateCommentDto) {
		return this.commentService.createComment(req.user.userId, comment);
	}
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	updateComment(
		@Req() req,
		@Param('id') id: string,
		@Body()
		updateComment: UpdateCommentDto,
	) {
		return this.commentService.updateComment(req.user.userId, id, updateComment);
	}
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteComment(@Req() req, @Param('id') id: string) {
		return this.commentService.deleteComment(req.user.userId, id);
	}
	//sub comment
	@UseGuards(JwtAuthGuard)
	@Post('sub')
	createSubComment(@Req() req, @Body() subComment: CreateSubCommentDto) {
		return this.commentService.createSubComment(req.user.userId, subComment);
	}
	@UseGuards(JwtAuthGuard)
	@Put('sub/:id')
	updateSubComment(
		@Req() req,
		@Param('id') id: string,
		@Body() updateSubComment: UpdateSubCommentDto,
	) {
		return this.commentService.updateSubComment(req.user.userId, id, updateSubComment);
	}
	@UseGuards(JwtAuthGuard)
	@Delete('sub/:id')
	deleteSubComment(@Req() req, @Param('id') id: string) {
		return this.commentService.deleteSubComment(req.user.userId, id);
	}
	@Get(':id')
	getFullCommentsByPostId(@Param('id') id: string) {
		return this.commentService.getFullCommentsByPostId(id);
	}
}
