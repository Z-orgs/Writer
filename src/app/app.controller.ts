import { Controller, Get, Post } from '@nestjs/common';
import { App } from './dto/app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getStatusServer(): App {
        return this.appService.getStatusServer();
    }
}
