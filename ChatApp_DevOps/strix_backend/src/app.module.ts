import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestService } from './services/testService';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [TestService],
})
export class AppModule {}
