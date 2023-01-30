import { Controller, Post, Param, Delete, UseGuards, Req, Put, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategory } from './dto/create.category.dto';
import { UpdateCategory } from './dto/update.category.dto';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}
	@UseGuards(JwtAuthGuard)
	@Post()
	createCategory(@Req() req, @Body() category: CreateCategory) {
		return this.categoryService.createCategory(req.user, category);
	}
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	updateCategory(@Req() req, @Param('id') id: string, @Body() updateCategory: UpdateCategory) {
		return this.categoryService.updateCategory(req.user, id, updateCategory);
	}
	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	deleteCategory(@Req() req, @Param('id') id: string) {
		return this.categoryService.deleteCategory(req.user, id);
	}
	@UseGuards(JwtAuthGuard)
	@Get()
	getAllCategories() {
		return this.categoryService.getAllCategories();
	}
}
