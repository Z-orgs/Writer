import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryPostDto } from './dto/category.post.dto';
import { CreateCategory } from './dto/create.category.dto';
import { UpdateCategory } from './dto/update.category.dto';
import { Category } from './entities/category.entity';
import { CategoryPost } from './entities/category.post.entity';

@Injectable()
export class CategoryService {
	/**
	 * A constructor function that is used to inject the CategoryPost and Category repositories into the
	 * CategoryPostService class.
	 * @param categoryPostRepository - Repository<CategoryPost>
	 * @param categoryRepository - Repository<Category>
	 */
	constructor(
		@InjectRepository(CategoryPost)
		private readonly categoryPostRepository: Repository<CategoryPost>,
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
	) {}
	/**
	 * It checks if the post and category already exist in the database, if they do, it returns an error,
	 * if they don't, it inserts them into the database
	 * @param {CategoryPostDto} input - CategoryPostDto
	 * @returns The return type is a Promise.
	 */
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
	/**
	 * It returns a category by its id
	 * @param {string} id - The id of the category you want to get.
	 * @returns The categoryRepository.findOneBy() method returns a Promise.
	 */
	getCategoryById(id: string) {
		return this.categoryRepository.findOneBy({ id });
	}
	/**
	 * It returns a list of posts that are associated with a category
	 * @param {string} id - string - the id of the category
	 * @returns An array of CategoryPost objects.
	 */
	getPostByCategoryId(id: string) {
		return this.categoryPostRepository.findBy({ category: id });
	}
	/**
	 * It creates a category
	 * @param {any} user - any - This is the user object that is passed in from the auth guard.
	 * @param {CreateCategory} category - CreateCategory - This is the type of the category that we're
	 * creating.
	 * @returns The category that was just created.
	 */
	async createCategory(user: any, category: CreateCategory) {
		/* Checking if the user is an admin. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Inserting the category into the database. */
		await this.categoryRepository.insert(category);
		return this.categoryRepository.findOneBy({ category: category.category });
	}
	/**
	 * It updates a category with the given id and updateCategory
	 * @param {any} user - any - The user that is logged in.
	 * @param {string} id - The id of the category you want to update.
	 * @param {UpdateCategory} updateCategory - This is the object that contains the new values for the
	 * category.
	 * @returns The updated category.
	 */
	async updateCategory(user: any, id: string, updateCategory: UpdateCategory) {
		/* Checking if the user is an admin. */
		if (user.role != 'admin') {
			return new HttpException('No permission', HttpStatus.BAD_REQUEST);
		}
		/* Updating the category with the id and the updateCategory. */
		await this.categoryRepository.update(id, updateCategory);
		return this.categoryRepository.findOneBy({ id });
	}
	/**
	 * It deletes a category from the database
	 * @param {any} user - any - The user object that is passed in the request.
	 * @param {string} id - The id of the category that you want to delete.
	 * @returns The category is being returned.
	 */
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
	/**
	 * Returning the category id and category name.
	 * @returns An array of objects.
	 */
	async getAllCategories() {
		/* Returning the category id and category name. */
		return (await Promise.all(await this.categoryRepository.find())).map((category) => {
			return {
				id: category.id,
				category: category.category,
			};
		});
	}
}
