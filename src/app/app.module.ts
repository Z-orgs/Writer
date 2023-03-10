import { Module } from '@nestjs/common';
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
import { Category } from 'src/category/entities/category.entity';
import { CategoryPost } from 'src/category/entities/category.post.entity';
import { SubComment } from 'src/comment/entities/sub.comment.entity';
import { Constants } from './env.constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: Constants.HOST,
			port: 3306,
			username: Constants.USER,
			password: Constants.PASSWORD,
			database: Constants.DB,
			entities: [User, PostEntity, LikeEntity, Comment, Category, CategoryPost, SubComment],
			synchronize: true,
		}),
		UserModule,
		PostModule,
		CommentModule,
		LikeModule,
		CategoryModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
