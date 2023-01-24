import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryPostDto } from './dto/category.post.dto';
import { CategoryPost } from './entities/category.post.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryPost)
        private readonly categoryPostRepository: Repository<CategoryPost>,
    ) {}
    async insertCategoryPost(input: CategoryPostDto) {
        const checkItem = await this.categoryPostRepository.findBy({
            post: input.post,
            category: input.category,
        });
        if (checkItem) {
            return new HttpException('Already exist', HttpStatus.BAD_REQUEST);
        }
        await this.categoryPostRepository.insert(input);
        return new HttpException('Inserted', HttpStatus.ACCEPTED);
    }
}
