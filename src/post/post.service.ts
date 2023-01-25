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
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        private readonly userService: UserService,
        private readonly categoryService: CategoryService,
        @Inject(forwardRef(() => LikeService))
        private readonly likeService: LikeService,
    ) {}
    async create(req, post: PostDto, categories: CategoryDto) {
        /* Creating a new post object with the owner, like and comment properties. */
        const newPost = {
            ...post,
            ...{
                owner: req.user.userId,
            },
        } as PostEntity;

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
        categories.categories.forEach(async (category) => {
            await this.categoryService.insertCategoryPost({
                post: insertedPost.id,
                category: category,
            });
        });
        return new HttpException(
            'Create post successfully',
            HttpStatus.ACCEPTED,
        );
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
        const isLike = (await this.likeService.checkLike(req.user.userId, id))
            ? true
            : false;
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
    async updatePost(id: string, post: PostDto) {
        try {
            await this.postRepository.update(id, post);
            return new HttpException('Post was update', HttpStatus.ACCEPTED);
        } catch (err) {
            return new HttpException(
                'Something was wrong',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    async deletePost(id: string) {
        try {
            await this.postRepository.softDelete(id);
            return new HttpException('Post was delete', HttpStatus.ACCEPTED);
        } catch (err) {
            return new HttpException(
                'Something was wrong',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    async getPostByUsername(username: string) {
        return await this.postRepository.find({
            where: {
                owner: username,
                status: 'approved',
            },
        });
    }
}
