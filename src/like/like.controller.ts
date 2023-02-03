import { Controller, Post, Param } from '@nestjs/common';
import { LikeService } from './like.service';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
@Controller('like')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}
	@UseGuards(JwtAuthGuard)
	@Post('like/:id')
	likePost(@Req() req: Request, @Param('id') id: string) {
		return this.likeService.likePost(req.user, id);
	}
	@UseGuards(JwtAuthGuard)
	@Post('unlike/:id')
	unlikePost(@Req() req: Request, @Param('id') id: string) {
		return this.likeService.unlikePost(req.user, id);
	}
}
