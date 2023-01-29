import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PostModule } from 'src/post/post.module';
import { CategoryModule } from 'src/category/category.module';
import { PostEntity } from 'src/post/entities/post.entity';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryPost } from 'src/category/entities/category.post.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, PostEntity, CategoryPost]),
		forwardRef(() => AuthModule),
		forwardRef(() => PostModule),
		CategoryModule,
		MulterModule.register({
			dest: './src/upload',
		}),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
