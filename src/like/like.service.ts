import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';

@Injectable()
export class LikeService {
	/**
	 * The constructor function is a function that is called when a new instance of the class is created.
	 * @param likeRepository - Repository<LikeEntity>
	 * @param {PostService} postService - PostService - This is the service that we want to inject.
	 */
	constructor(
		@InjectRepository(LikeEntity)
		private readonly likeRepository: Repository<LikeEntity>,
		@Inject(forwardRef(() => PostService))
		private readonly postService: PostService,
	) {}
	/**
	 * It creates a new like object, checks if the user has already liked the post, increments the total
	 * likes, and then updates the post.
	 * @param {any} user - any - This is the user object that is passed in from the auth guard.
	 * @param {string} id - This is the id of the post that the user is liking.
	 * @returns The like object is being returned.
	 */
	async likePost(user: any, id: string) {
		/* Creating a new like object and assigning the post and user to it. */
		const likeObj = new LikeEntity();
		likeObj.post = id;
		likeObj.user = user.userId;
		/* Checking if the user has already liked the post. If they have, it will throw an error. */
		if (await this.checkLike(user.userId, id)) {
			return new HttpException('User already liked this post.', HttpStatus.BAD_REQUEST);
		}
		/* This is getting the post by the id, incrementing the total likes, and then updating the post. */
		const post = await this.postService.getPostById(id);
		post.totalLikes++;
		await this.postService.updatePost(user, id, post);
		return await this.likeRepository.insert(likeObj);
	}
	/**
	 * It checks if the user has liked the post, if they have, it will decrement the total likes on the
	 * post, and then delete the like from the database
	 * @param {any} user - any - This is the user object that is passed in from the controller.
	 * @param {string} id - The id of the post that the user is liking.
	 * @returns The likeRepository.delete() is being returned.
	 */
	async unlikePost(user: any, id: string) {
		/* Checking if the user has liked the post. If they have not, it will throw an error. */
		const likeObj = await this.checkLike(user.userId, id);
		if (!likeObj) {
			return new HttpException('User does not like this post.', HttpStatus.BAD_REQUEST);
		}
		/* This is getting the post by the id, decrementing the total likes, and then updating the post. */
		const post = await this.postService.getPostById(id);
		post.totalLikes--;
		await this.postService.updatePost(user, id, post);
		return this.likeRepository.delete(likeObj.id);
	}
	/**
	 * It checks if the user has liked the post.
	 * @param {string} userId - The user's id.
	 * @param {string} postId - The id of the post that the user is liking.
	 * @returns The likeRepository.findOneBy() method returns a promise.
	 */
	async checkLike(userId: string, postId: string) {
		/* Checking if the user has liked the post. */
		return await this.likeRepository.findOne({
			where: {
				user: userId,
				post: postId,
			},
		});
	}
}
