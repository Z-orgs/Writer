import { Controller, Post, Param, Delete, UseGuards, Req, Put, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategory } from './dto/create.category.dto';
import { UpdateCategory } from './dto/update.category.dto';
import { Request } from 'express';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}
	/**
	 * This function creates a category and returns the created category.
	 * @param req - This is the request object. It contains the user object that we set in the
	 * auth.guard.ts file.
	 * @param {CreateCategory} category - CreateCategory - This is the DTO that we created earlier.
	 * @returns The return value is a Promise&lt;Category&gt;.
	 */
	@UseGuards(JwtAuthGuard)
	@Post()
	createCategory(@Req() req: Request, @Body() category: CreateCategory) {
		return this.categoryService.createCategory(req.user, category);
	}
	/**
	 * This function takes in a request, a category id, and an updateCategory object, and returns the
	 * result of the updateCategory function in the categoryService.
	 * @param req - The request object.
	 * @param {string} id - The id of the category to update
	 * @param {UpdateCategory} updateCategory - UpdateCategory
	 * @returns The return value is a Promise&lt;Category&gt;.
	 */
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	updateCategory(
		@Req() req: Request,
		@Param('id') id: string,
		@Body() updateCategory: UpdateCategory,
	) {
		return this.categoryService.updateCategory(req.user, id, updateCategory);
	}
	/**
	 * It takes a request object and a category id, and returns a promise that resolves to a category
	 * object
	 * @param req - This is the request object. It contains the user object that we set in the
	 * auth.guard.ts file.
	 * @param {string} id - The id of the category to delete
	 * @returns The return value of the deleteCategory method.
	 */
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteCategory(@Req() req: Request, @Param('id') id: string) {
		return this.categoryService.deleteCategory(req.user, id);
	}
	/**
	 * It returns the result of the getAllCategories() function from the categoryService.
	 * @returns A list of categories.
	 */
	@UseGuards(JwtAuthGuard)
	@Get()
	getAllCategories() {
		return this.categoryService.getAllCategories();
	}
}
