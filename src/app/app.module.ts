import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeModule } from 'src/like/like.module';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/post/entities/post.entity';
import { LikeEntity } from 'src/like/entities/like.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { SubComment } from 'src/sub.comment/entities/sub.comment.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryPost } from 'src/category/entities/category.post.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'writer',
            entities: [
                User,
                PostEntity,
                LikeEntity,
                Comment,
                SubComment,
                Category,
                CategoryPost,
            ],
            synchronize: true,
        }),
        UserModule,
        PostModule,
        CommentModule,
        LikeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
