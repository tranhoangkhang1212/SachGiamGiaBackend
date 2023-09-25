import { DefaultAuthGuard } from '@module/auth/auth.global.guard';
import { UsersService } from '@module/users/users.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useGlobalGuards(new DefaultAuthGuard(app.get(UsersService)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
  });

  const port = process.env.PORT;
  await app.listen(port);
  console.log(`App running on PORT: ${port}`);
}
bootstrap();
