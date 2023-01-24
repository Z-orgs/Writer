import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(LikeEntity)
        private readonly likeRepository: Repository<LikeEntity>,
        private readonly postService: PostService,
    ) {}
    async likePost(req: any, id: string) {
        /* Creating a new like object and assigning the post and user to it. */
        const likeObj = new LikeEntity();
        likeObj.post = id;
        likeObj.user = req.user.userId;
        /* Checking if the user has already liked the post. If they have, it will throw an error. */
        if (this.checkLike(req.user.userId, id)) {
            return new HttpException(
                'User already liked this post.',
                HttpStatus.BAD_REQUEST,
            );
        }
        /* This is getting the post by the id, incrementing the total likes, and then updating the post. */
        const post = await this.postService.getPostById(id);
        post.totalLikes++;
        await this.postService.updatePost(id, post);
        return await this.likeRepository.insert(likeObj);
    }
    async unlikePost(req: any, id: string) {
        /* Checking if the user has liked the post. If they have not, it will throw an error. */
        const likeObj = await this.checkLike(req.user.userId, id);
        if (!likeObj) {
            return new HttpException(
                'User does not like this post.',
                HttpStatus.BAD_REQUEST,
            );
        }
        /* This is getting the post by the id, decrementing the total likes, and then updating the post. */
        const post = await this.postService.getPostById(id);
        post.totalLikes--;
        await this.postService.updatePost(id, post);
        return this.likeRepository.delete(likeObj.id);
    }
    async checkLike(userId: string, postId: string) {
        /* This is checking if the user has liked the post. If they have, it will return the like object. If
        they have not, it will return null. */
        const likeObj = await this.likeRepository.findOneBy({
            user: userId,
            post: postId,
        });
        return likeObj ? likeObj : null;
    }
}
