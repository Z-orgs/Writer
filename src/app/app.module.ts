import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeModule } from 'src/like/like.module';
import 'dotenv/config';

@Module({
  imports: [UserModule, PostModule, AuthModule, CommentModule, LikeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
