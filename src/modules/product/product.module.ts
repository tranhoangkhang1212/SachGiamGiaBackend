import { Sidebar } from '@module/sidebar/entities/sidebar.entity';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AdminProductController } from './product.admin.controller';
import { FileUploadModule } from '@module/file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sidebar]), FileUploadModule],
  controllers: [ProductController, AdminProductController],
  providers: [ProductService, Logger],
  exports: [ProductService],
})
export class ProductModule {}
