import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { LikeService } from 'src/like/like.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dto';
import { PostDto } from './dto/post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
	/**
	 * The function is a constructor for the PostService class. It takes in a PostRepository, a
	 * UserService, a CategoryService, and a LikeService
	 * @param postRepository - Repository<PostEntity>
	 * @param {UserService} userService - UserService
	 * @param {CategoryService} categoryService - CategoryService
	 * @param {LikeService} likeService - LikeService
	 */
	constructor(
		@InjectRepository(PostEntity)
		private readonly postRepository: Repository<PostEntity>,
		@Inject(forwardRef(() => UserService)) private readonly userService: UserService,
		private readonly categoryService: CategoryService,
		@Inject(forwardRef(() => LikeService))
		private readonly likeService: LikeService,
	) {}
	/**
	 * I'm trying to create a post and insert the categories of the post into the category_post table
	 * @param req - The request object.
	 * @param {PostDto} post - PostDto: This is the post object that we are going to create.
	 * @param {CategoryDto} categories - CategoryDto
	 * @returns a new HttpException with the message 'Create post successfully' and the status code
	 * ACCEPTED.
	 */
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

		await Promise.all(
			listCategory.forEach(async (category) => {
				await this.categoryService.insertCategoryPost({
					post: insertedPost.id,
					category: category,
				});
			}),
		);
		return new HttpException('Create post successfully', HttpStatus.ACCEPTED);
	}
	/**
	 * It gets the posts of the users that the current user is following and all the posts that have been
	 * approved
	 * @param {any} req - any -&gt; The request object.
	 * @returns An object with two properties: followingPosts and posts.
	 */
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
	/**
	 * > Get a post by its id
	 * @param {string} id - string - The id of the post we want to retrieve
	 * @returns The post object
	 */
	async getPostById(id: string) {
		return await this.postRepository.findOneBy({ id });
	}
	/**
	 * It gets a post by id and checks if the user has liked the post
	 * @param {any} req - any - this is the request object that is passed to the controller method.
	 * @param {string} id - string - the id of the post
	 * @returns The post object with the isLike property added to it.
	 */
	async getPostByIdLogin(req: any, id: string) {
		const post = await this.postRepository.findOneBy({ id });
		const isLike = (await this.likeService.checkLike(req.user.userId, id)) ? true : false;
		return { ...post, isLike };
	}
	/**
	 * It returns all posts that have a status of approved, ordered by the date they were created.
	 *
	 * The first line of the function is a TypeScript type annotation. It tells TypeScript that the
	 * function will return a promise that resolves to an array of Post objects.
	 *
	 * The second line is the function declaration. It's an async function, which means it returns a
	 * promise.
	 *
	 * The third line is the function body. It uses the await keyword to wait for the promise returned by
	 * the find() function to resolve.
	 *
	 * The find() function is a method of the PostRepository object. It returns a promise that resolves to
	 * an array of Post objects.
	 *
	 * The find() function takes an object as an argument. The object has two properties: where and order.
	 *
	 * The where property is an object that specifies the conditions that must be met for a Post object to
	 * be included in the
	 * @returns An array of posts.
	 */
	async getPosts() {
		const posts = await this.postRepository.find({
			where: { status: 'approved' },
			order: {
				createdAt: 'DESC',
			},
		});
		return posts;
	}
	/**
	 * It updates the post by the id, if the user is the owner of the post
	 * @param {any} user - any - The user object that is passed from the controller.
	 * @param {string} id - The id of the post.
	 * @param {PostEntity | PostDto} post - PostEntity | PostDto
	 * @param {boolean} [passing=true] - boolean = true
	 * @returns an HttpException.
	 */
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
	/**
	 * It deletes a post from the database
	 * @param {any} user - any - The user object that is passed from the controller.
	 * @param {string} id - The id of the post that we want to delete.
	 * @returns an error if the user is not the owner of the post. If the user is the owner, it will
	 * delete the post from the database.
	 */
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
	/**
	 * It gets a user by username, then gets all posts by that user
	 * @param {string} username - string
	 * @returns An array of posts.
	 */
	async getPostByUsername(username: string) {
		const user = await this.userService.findOneBy({ username: username });
		return await this.postRepository.find({
			where: {
				owner: user.id,
				status: 'approved',
			},
		});
	}
	/**
	 * It gets all the posts that have the categoryId and returns them.
	 * @param {string} categoryId - The id of the category.
	 * @returns An array of posts.
	 */
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
	/**
	 * If the user is an admin, return all the posts in the database
	 * @param {any} user - any - This is the user that is logged in.
	 * @returns All the posts in the database.
	 */
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
	/**
	 * It checks if the user is an admin or not. If not, it will return an error. If the user is an admin,
	 * it will update the post status to approved
	 * @param {any} user - any - This is the user object that is passed from the controller.
	 * @param {string} id - The id of the post that needs to be approved.
	 * @returns The updated post.
	 */
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
	/**
	 * It checks if the user is an admin or not. If not, it will return an error. If the user is an admin,
	 * it will delete the post from the database
	 * @param {any} user - any - This is the user that is logged in.
	 * @param {string} id - The id of the post that we want to delete.
	 * @returns an error if the user is not an admin. If the user is an admin, it will delete the post from
	 * the database.
	 */
	async deletePostByAdmin(user: any, id: string) {
		/* Checking if the user is an admin or not. If not, it will return an error. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Deleting the post from the database. */
		await this.postRepository.softDelete(id);
		return new HttpException('Post was delete', HttpStatus.ACCEPTED);
	}
}
