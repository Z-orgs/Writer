import { Injectable } from '@nestjs/common';
import { App } from './app.dto';

@Injectable()
export class AppService {
  getStatusServer(): App {
    return {
      status: 200,
      msg: 'Connection OK!',
    };
  }
}
