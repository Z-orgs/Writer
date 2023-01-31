import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	testConnection() {
		return new HttpException('Connected', HttpStatus.ACCEPTED);
	}
}
