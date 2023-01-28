import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { LikeService } from 'src/like/like.service';
import { UserService } from 'src/user/user.service';
import { FindManyOptions, FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dto';
import { PostDto } from './dto/post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(PostEntity)
		private readonly postRepository: Repository<PostEntity>,
		@Inject(forwardRef(() => UserService)) private readonly userService: UserService,
		private readonly categoryService: CategoryService,
		@Inject(forwardRef(() => LikeService))
		private readonly likeService: LikeService,
	) {}
	async create(req, post: PostDto, categories: CategoryDto) {
		/* Creating a new post object with the owner, like and comment properties. */
		const newPost = {
			...post,
		} as PostEntity;
		if (await this.postRepository.findOneBy({ ...newPost })) {
			return new HttpException('Post already exist.', HttpStatus.BAD_REQUEST);
		}
		this.postRepository.insert(newPost);
		const insertedPost = await this.postRepository.findOneBy({
			...newPost,
		});
		/* Updating the user's totalPosts property. */
		const user = await this.userService.findOneBy({
			username: req.user.username,
		});
		user.totalPosts++;
		await this.userService.update(user.id, user);

		const listCategory = JSON.parse(categories.categories);

		listCategory.forEach(async (category) => {
			await this.categoryService.insertCategoryPost({
				post: insertedPost.id,
				category: category,
			});
		});
		return new HttpException('Create post successfully', HttpStatus.ACCEPTED);
	}
	async getPostsByFollowing(req: any) {
		/* Getting the user's following list. */
		const user = await this.userService.findOneBy({
			username: req.user.username,
		});
		const listFollowing: string[] = JSON.parse(user.following);
		/* Getting the posts of the users that the current user is following. */
		const followingPosts = [];
		listFollowing.forEach(async (target) => {
			followingPosts.push(
				await this.postRepository.find({
					where: { owner: target, status: 'approved' },
					order: {
						createdAt: 'DESC',
					},
				}),
			);
		});
		/* Getting all the posts that have been approved. */
		const posts = await this.postRepository.find({
			where: { status: 'approved' },
			order: {
				createdAt: 'DESC',
			},
		});
		return { followingPosts, posts };
	}
	async getPostById(id: string) {
		return await this.postRepository.findOneBy({ id });
	}
	async getPostByIdLogin(req: any, id: string) {
		const post = await this.postRepository.findOneBy({ id });
		const isLike = (await this.likeService.checkLike(req.user.userId, id)) ? true : false;
		return { ...post, isLike };
	}
	async getPosts() {
		const posts = await this.postRepository.find({
			where: { status: 'approved' },
			order: {
				createdAt: 'DESC',
			},
		});
		return posts;
	}
	async updatePost(user: any, id: string, post: PostEntity | PostDto, passing: boolean = true) {
		let tmpPost = null;
		if (!passing) {
			/* Getting the post by the id. */
			tmpPost = await this.postRepository.findOneBy({ id });
			/* Checking if the user is the owner of the post or not. If not, it will return an error. */
			if (tmpPost.owner != user.userId) {
				return new HttpException('No permission', HttpStatus.BAD_REQUEST);
			}
			/* Updating the post content, title and description. */
			tmpPost.content = post.content;
			tmpPost.title = post.title;
			tmpPost.description = post.description;
		}
		try {
			await this.postRepository.update(id, tmpPost ? tmpPost : post);
			return new HttpException('Post was update', HttpStatus.ACCEPTED);
		} catch (err) {
			return new HttpException('Something was wrong', HttpStatus.BAD_REQUEST);
		}
	}
	async deletePost(user: any, id: string) {
		/* Getting the post by the id. */
		const tmpPost = await this.postRepository.findOneBy({ id });
		/* Checking if the user is the owner of the post or not. If not, it will return an error. */
		if (tmpPost.owner != user.userId) {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		try {
			/* Deleting the post from the database. */
			await this.postRepository.softDelete(id);
			return new HttpException('Post was delete', HttpStatus.ACCEPTED);
		} catch (err) {
			return new HttpException('Something was wrong', HttpStatus.BAD_REQUEST);
		}
	}
	async getPostByUsername(username: string) {
		const user = await this.userService.findOneBy({ username: username });
		return await this.postRepository.find({
			where: {
				owner: user.id,
				status: 'approved',
			},
		});
	}
	async getPostsByCategory(categoryId: string) {
		/* Checking if the category exists or not. */
		const category = await this.categoryService.getCategoryById(categoryId);
		if (!category) {
			return new HttpException('Category not found.', HttpStatus.NOT_FOUND);
		}
		/* Getting all the posts that have the categoryId. */
		return await Promise.all(
			(
				await this.categoryService.getPostByCategoryId(categoryId)
			).map(
				async (post) =>
					await this.postRepository.findOneBy({
						id: post.post,
						status: 'approved',
					}),
			),
		);
	}
	async getAllPostsByAdmin(user: any) {
		/* Checking if the user is an admin or not. If not, it will return an error. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Returning all the posts in the database. */
		return await this.postRepository.find({
			order: {
				createdAt: 'DESC',
			},
		});
	}
	async approvePost(user: any, id: string) {
		/* Checking if the user is an admin or not. If not, it will return an error. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Updating the post status to approved. */
		const post = await this.postRepository.findOneBy({ id });
		post.status = 'approved';
		await this.postRepository.update(id, post);
		return await this.postRepository.findOneBy({ id });
	}
	async deletePostByAdmin(user: any, id: string) {
		/* Checking if the user is an admin or not. If not, it will return an error. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Deleting the post from the database. */
		await this.postRepository.softDelete(id);
		return new HttpException('Post was delete', HttpStatus.ACCEPTED);
	}
	async softDelete(
		criteria:
			| string
			| number
			| Date
			| ObjectID
			| string[]
			| number[]
			| Date[]
			| ObjectID[]
			| FindOptionsWhere<PostEntity>,
	) {
		return this.postRepository.softDelete(criteria);
	}
	async find(options?: FindManyOptions<PostEntity>) {
		return await this.postRepository.find(options);
	}
}
