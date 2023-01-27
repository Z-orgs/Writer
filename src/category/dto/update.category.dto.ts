import { IsNotEmpty } from 'class-validator';

export class UpdateCategory {
	@IsNotEmpty()
	category: string;
}
