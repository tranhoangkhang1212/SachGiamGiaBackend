import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Sidebar } from '@module/sidebar/entities/sidebar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sidebar])],
  controllers: [ProductController],
  providers: [ProductService, Logger],
})
export class ProductModule {}
