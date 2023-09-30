import { Module } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { LayoutController } from './layout.controller';
import { Layout } from './entities/layout.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@module/product/entities/product.entity';
import { ProductModule } from '@module/product/product.module';
import { FileUploadModule } from '@module/file-upload/file-upload.module';
import { AdminLayoutController } from './layout.admin.controller';
import { Category } from '@module/category/entities/category.entity';
import { Author } from '@module/author/entities/author.entity';
import { Publisher } from '@module/publisher/entities/publisher.entity';
import { Distributor } from '@module/distributors/entities/distributor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Layout, Product, Category, Author, Publisher, Distributor]),
    ProductModule,
    FileUploadModule,
  ],
  controllers: [LayoutController, AdminLayoutController],
  providers: [LayoutService],
})
export class LayoutModule {}
