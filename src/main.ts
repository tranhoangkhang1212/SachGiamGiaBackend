import { DefaultAuthGuard } from '@module/auth/auth.global.guard';
import { UsersService } from '@module/users/users.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { NODE_ENV, PORT } = process.env;
  config({ path: `${NODE_ENV}.env` });

  console.log('*******************ENV****************');

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useGlobalGuards(new DefaultAuthGuard(app.get(UsersService)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: [/^https:\/\/(?:[a-z0-9-]+\.)?sachgiamgia\.vn$/, 'http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  });

  await app.listen(PORT);

  console.log(`App running on PORT: ${PORT}`);
}
bootstrap();
