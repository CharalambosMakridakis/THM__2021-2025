import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import {AuthMiddleware} from "./auth.middleware";
import { MatchModule } from './match/match.module';
import { MatchStatsModule } from './matchStats/matchStats.module';
import {UserModule} from "./user/user.module";
import {AdminModule} from "./admin/admin.module";
import { Match } from './matchStats/matchStats.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Match],
      synchronize: true,
    }),
    UserModule,
    MatchModule,
    MatchStatsModule,
    AdminModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../client"),
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('api/*');
    consumer.apply(AuthMiddleware).forRoutes('admin/*');
    consumer.apply(AuthMiddleware).forRoutes('match/*');
    consumer.apply(AuthMiddleware).forRoutes('matchStats/*');
  }
}

