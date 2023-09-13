import { UsersModule } from '@module/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresqlDatabaseProviderModule } from './database/db-provider.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { APP_GUARD } from '@nestjs/core';
import { DefaultAuthGuard } from '@module/auth/auth.global.guard';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { SidebarModule } from './modules/sidebar/sidebar.module';
import { AuthorModule } from './modules/author/author.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      isGlobal: true,
    }),
    PostgresqlDatabaseProviderModule,
    UsersModule,
    AuthModule,
    ChatModule,
    ProductModule,
    CategoryModule,
    SidebarModule,
    AuthorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: DefaultAuthGuard,
    },
  ],
  exports: [AppService],
})
export class AppModule {}
