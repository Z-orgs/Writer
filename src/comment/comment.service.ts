import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly postService: PostService,
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
}
