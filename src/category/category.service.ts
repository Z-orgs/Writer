import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryPostDto } from './dto/category.post.dto';
import { Category } from './entities/category.entity';
import { CategoryPost } from './entities/category.post.entity';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(CategoryPost)
		private readonly categoryPostRepository: Repository<CategoryPost>,
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
	) {}
	async insertCategoryPost(input: CategoryPostDto) {
		const checkItem = await this.categoryPostRepository.findOneBy({
			post: input.post,
			category: input.category,
		});

		if (checkItem) {
			return new HttpException('Already exist', HttpStatus.BAD_REQUEST);
		}
		await this.categoryPostRepository.insert(input);

		return new HttpException('Inserted', HttpStatus.ACCEPTED);
	}
	getCategoryById(id: string) {
		return this.categoryRepository.findOneBy({ id });
	}
	getPostByCategoryId(id: string) {
		return this.categoryPostRepository.findBy({ category: id });
	}
}
