import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { CategoryPostDto } from './dto/category.post.dto';
import { CreateCategory } from './dto/create.category.dto';
import { UpdateCategory } from './dto/update.category.dto';
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
		/* Checking if the post and category already exist in the database. */
		const checkItem = await this.categoryPostRepository.findOneBy({
			post: input.post,
			category: input.category,
		});
		/* Checking if the post and category already exist in the database. */
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
	async createCategory(user: any, category: CreateCategory) {
		/* Checking if the user is an admin. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Inserting the category into the database. */
		await this.categoryRepository.insert(category);
		return this.categoryRepository.findOneBy({ category: category.category });
	}
	async updateCategory(user: any, id: string, updateCategory: UpdateCategory) {
		/* Checking if the user is an admin. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Updating the category with the id and the updateCategory. */
		await this.categoryRepository.update(id, updateCategory);
		return this.categoryRepository.findOneBy({ id });
	}
	async deleteCategory(user: any, id: string) {
		/* Checking if the user is an admin. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Deleting the category from the database. */
		await this.categoryRepository.softDelete(id);
		/* Deleting all the posts that are associated with the category. */
		await this.categoryPostRepository.softDelete({ category: id });
		return new HttpException('Deleted', HttpStatus.ACCEPTED);
	}
	async categoryPostSoftDelete(
		criteria:
			| string
			| number
			| Date
			| ObjectID
			| string[]
			| number[]
			| Date[]
			| ObjectID[]
			| FindOptionsWhere<CategoryPost>,
	) {
		return await this.categoryPostRepository.softDelete(criteria);
	}
}
