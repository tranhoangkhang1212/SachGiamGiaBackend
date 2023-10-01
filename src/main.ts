import { DefaultAuthGuard } from '@module/auth/auth.global.guard';
import { UsersService } from '@module/users/users.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  config({ path: `${process.env.NODE_ENV}.env` });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useGlobalGuards(new DefaultAuthGuard(app.get(UsersService)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: process.env.CORS_ALLOWED_ORIGINS.split(','),
  });

  const port = process.env.PORT;
  await app.listen(port);

  console.log(`App running on PORT: ${port}`);
}
bootstrap();
