import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { LikeModule } from 'src/like/like.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([PostEntity]),
		AuthModule,
		forwardRef(() => UserModule),
		CategoryModule,
		forwardRef(() => LikeModule),
	],
	controllers: [PostController],
	providers: [PostService],
	exports: [PostService],
})
export class PostModule {}
