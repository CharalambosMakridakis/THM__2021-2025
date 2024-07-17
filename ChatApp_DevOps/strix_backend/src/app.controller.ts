import { Controller, Get } from '@nestjs/common';
import { TestService } from './services/testService';

@Controller()
export class AppController {
  constructor(
    private readonly testService: TestService
  ) {}
  
  @Get('/api/test')
  getHello(): string {

    return this.testService.getTestString();

  }
}
