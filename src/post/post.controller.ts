import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryDto } from './dto/category.dto';
import { CreatePostDto } from './dto/create.post.dto';
import { PostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	//login
	@UseGuards(JwtAuthGuard)
	@Post('login')
	createPost(@Req() req, @Body() post: CreatePostDto) {
		const newPost: PostDto = {
			title: post.title,
			content: post.content,
			description: post.description,
			owner: req.user.userId,
		};
		const categories: CategoryDto = { categories: post.categories };
		return this.postService.create(req, newPost, categories);
	}
	@UseGuards(JwtAuthGuard)
	@Get('login/following')
	getPostsByFollowing(@Req() req) {
		return this.postService.getPostsByFollowing(req);
	}
	@UseGuards(JwtAuthGuard)
	@Put('login/:id')
	updatePost(@Param('id') id: string, @Body() post: PostDto) {
		return this.postService.updatePost(id, post);
	}
	@UseGuards(JwtAuthGuard)
	@Delete('login/:id')
	deletePost(@Param('id') id: string) {
		return this.postService.deletePost(id);
	}
	@UseGuards(JwtAuthGuard)
	@Get('login/:id')
	async getPostByIdLogin(@Req() req, @Param('id') id: string) {
		return this.postService.getPostByIdLogin(req, id);
	}

	// not login
	@Get(':id')
	getPostById(@Param('id') id: string) {
		return this.postService.getPostById(id);
	}
	@Get('user/:username')
	getPostsByUsername(@Param('username') username: string) {
		return this.postService.getPostByUsername(username);
	}
	@Get()
	getPosts() {
		return this.postService.getPosts();
	}
	@Get('category/:categoryId')
	getPostsByCategory(@Param('categoryId') categoryId: string) {
		return this.postService.getPostsByCategory(categoryId);
	}
}
