import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

(async () => {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
	await app.listen(3000);
})();
