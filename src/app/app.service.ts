import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	testConnection() {
		return { msg: 'Connection OK.', status: 200 };
	}
}
