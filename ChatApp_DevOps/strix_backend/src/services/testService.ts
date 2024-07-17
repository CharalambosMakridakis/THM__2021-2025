import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  getTestString(): string {
    return 'Hello World! (this comes frrom Server)';
  }
}
