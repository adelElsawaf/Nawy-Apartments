import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, reviewer! Hope you enjoy going through this — it was a pleasure building it.';
  }
}
