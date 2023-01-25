import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './entities/like.entity';
import { PostModule } from 'src/post/post.module';
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef } from '@nestjs/common';

@Module({
    imports: [
        TypeOrmModule.forFeature([LikeEntity]),
        forwardRef(() => PostModule),
        AuthModule,
    ],
    controllers: [LikeController],
    providers: [LikeService],
    exports: [LikeService],
})
export class LikeModule {}
