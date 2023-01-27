import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import {
    CreateCommentDto,
    CreateSubCommentDto,
} from './dto/create-comment.dto';
import {
    UpdateCommentDto,
    UpdateSubCommentDto,
} from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { SubComment } from './entities/sub.comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly postService: PostService,
        @InjectRepository(SubComment)
        private readonly subCommentRepository: Repository<SubComment>,
    ) {}
    async createComment(userId: any, comment: CreateCommentDto) {
        /* Creating a new comment and inserting it into the database. */
        const newComment = {
            user: userId,
            ...comment,
        };
        const result = await this.commentRepository.insert(newComment);
        /* This is updating the totalComments of the post. */
        const post = await this.postService.getPostById(newComment.post);
        post.totalComments++;
        await this.postService.updatePost(newComment.post, post);
        return result;
    }
    async updateComment(
        userId: any,
        id: string,
        updateComment: UpdateCommentDto,
    ) {
        const comment = await this.commentRepository.findOneBy({ id });
        /* This is checking if the user is the owner of the comment. If not, it will throw an error. */
        if (comment.user != userId) {
            return new HttpException(
                'Cannot update this comment.',
                HttpStatus.BAD_REQUEST,
            );
        }
        /* Updating the comment. */
        comment.content = updateComment.content;
        await this.commentRepository.update(id, comment);
        return this.commentRepository.findOneBy({ id });
    }
    async deleteComment(userId: any, id: string) {
        try {
            const comment = await this.commentRepository.findOneBy({ id });
            /* This is checking if the user is the owner of the comment. If not, it will throw an
            error. */
            if (comment.user != userId) {
                return new HttpException(
                    'Cannot delete this comment.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            /* Deleting the comment from the database. */
            await this.commentRepository.softDelete({ id });
            /* This is updating the totalComments of the post. */
            const post = await this.postService.getPostById(comment.post);
            post.totalComments--;
            await this.postService.updatePost(comment.post, post);
            return new HttpException('Deleted', HttpStatus.ACCEPTED);
        } catch (error) {
            return new HttpException(
                'Somethings was wrong.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    async createSubComment(userId: any, subComment: CreateSubCommentDto) {
        /* Creating a new sub comment and inserting it into the database. */
        const newSubComment = {
            ...subComment,
            user: userId,
        };
        const result = await this.subCommentRepository.insert(newSubComment);
        /* Getting the comment that the sub comment is related to. */
        const comment = await this.commentRepository.findOneBy({
            id: newSubComment.comment,
        });
        /* Getting the post that the comment is related to, and then it is updating the totalComments
        of the post. */
        const post = await this.postService.getPostById(comment.post);
        post.totalComments++;
        await this.postService.updatePost(comment.post, post);
        return result;
    }
    async updateSubComment(
        userId: any,
        id: string,
        updateSubComment: UpdateSubCommentDto,
    ) {
        /* Getting the sub comment that the user wants to update. */
        const subComment = await this.subCommentRepository.findOneBy({ id });
        /* This is checking if the user is the owner of the comment. If not, it will throw an error. */
        if (subComment.user != userId) {
            return new HttpException(
                'Cannot update this sub comment.',
                HttpStatus.BAD_REQUEST,
            );
        }
        /* Updating the sub comment. */
        subComment.content = updateSubComment.content;
        await this.subCommentRepository.update(id, subComment);
        return await this.subCommentRepository.findOneBy({ id });
    }
    async deleteSubComment(userId: any, id: string) {
        try {
            /* Getting the sub comment that the user wants to delete. */
            const subComment = await this.subCommentRepository.findOneBy({
                id,
            });
            /* This is checking if the user is the owner of the comment. If not, it will throw an error. */
            if (subComment.user != userId) {
                return new HttpException(
                    'Cannot delete this comment.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            /* Deleting the sub comment from the database. */
            await this.subCommentRepository.softDelete({ id });
            /* Getting the comment that the sub comment is related to. */
            const comment = await this.commentRepository.findOneBy({
                id: subComment.comment,
            });
            /* This is updating the totalComments of the post. */
            const post = await this.postService.getPostById(comment.post);
            post.totalComments--;
            await this.postService.updatePost(comment.post, post);
            return new HttpException('Deleted', HttpStatus.ACCEPTED);
        } catch (error) {
            return new HttpException(
                'Somethings was wrong.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    async getFullCommentsByPostId(id: string) {
        /* Getting all the comments that are related to the post, and then it is getting all the sub comments
        that are related to the comment. */
        return await Promise.all(
            (
                await this.commentRepository.findBy({ post: id })
            ).map(async (comment) => {
                return {
                    ...comment,
                    sub: await this.subCommentRepository.findBy({
                        comment: comment.id,
                    }),
                };
            }),
        );
    }
}
