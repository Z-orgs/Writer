import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
	@IsNotEmpty()
	title: string;
	@IsNotEmpty()
	description: string;
	@IsNotEmpty()
	content: string;
	@IsNotEmpty()
	categories: string;
}
