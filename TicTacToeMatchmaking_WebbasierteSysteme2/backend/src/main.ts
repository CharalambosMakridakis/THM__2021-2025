import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";
import {User} from "./user/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {createDemoUsers} from "./createDemoUsers";
import * as bcrypt from "bcrypt";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.use(
   session({
     secret: 'Xhjsidfuhihxhqwu8ei12o312',
     resave: false,
     saveUninitialized: false,
   }),
  );

  app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    })
  );
    

  const config = new DocumentBuilder()
    .setTitle('Competitive TicTacToe')
    .setDescription('Welcome, fearless contenders, to the exhilarating realm of Competitive Tic-Tac-Toe – where the age-old childhood game transforms into a strategic battleground for the sharpest minds and nimblest wits! In this electrifying contest, the humble 3x3 grid becomes a stage for epic clashes of tactics, foresight, and strategic brilliance.\n' +
        '\n' +
        'In this battle of intellects, players aren\'t merely marking Xs and Os; they\'re navigating a labyrinth of possibilities, predicting their opponent\'s every move, and laying intricate traps to seize victory. What was once a casual pastime now unfolds as a gripping duel, demanding players to elevate their skills to new heights.\n' +
        '\n' +
        'Immerse yourself in a symphony of calculated moves, where the placement of a single symbol can unleash a cascade of consequences. The stakes are higher, the plays are more calculated, and the battlefield resonates with the echoes of minds engaged in a cerebral dance.\n' +
        '\n' +
        'Competitive Tic-Tac-Toe is not just a game; it\'s a journey into the heart of strategic warfare. Witness the clash of grandmasters, each orchestrating a symphony of Xs and Os to outmaneuver their opponents. As the board unfolds, every match becomes a narrative of skill, daring gambits, and tactical genius.\n' +
        '\n' +
        'Are you prepared to embark on this riveting odyssey, where victory is not a matter of chance but a testament to your strategic prowess? Ready your wits, for in the realm of Competitive Tic-Tac-Toe, only the shrewdest emerge victorious. May your moves be cunning, your strategy unassailable, and may you claim your place among the legends of this intense mind game! Let the competition begin!')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  const AMOUNT = 50;
  const userRepository = app.get(getRepositoryToken(User));
  if (await userRepository.count() === 0) {
  const users: User[] = createDemoUsers(AMOUNT);
  users.forEach(user => {user.password = bcrypt.hashSync(user.password, 10)});
  await userRepository.save(users);
  }
  await app.listen(3000);
  console.log("Server started on Port 3000");

}
bootstrap();
