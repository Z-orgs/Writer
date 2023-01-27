import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikeService } from './like.service';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('like')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}
	@UseGuards(JwtAuthGuard)
	@Post(':id')
	likePost(@Req() req, @Param('id') id: string) {
		return this.likeService.likePost(req, id);
	}
	@UseGuards(JwtAuthGuard)
	@Post('unlike/:id')
	unlikePost(@Req() req, @Param('id') id: string) {
		return this.likeService.unlikePost(req, id);
	}
}
