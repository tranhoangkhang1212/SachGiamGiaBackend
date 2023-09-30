import { Module } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { SidebarController } from './sidebar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sidebar } from './entities/sidebar.entity';
import { Publisher } from '@module/publisher/entities/publisher.entity';
import { Author } from '@module/author/entities/author.entity';
import { Category } from '@module/category/entities/category.entity';
import { AdminSidebarController } from './sidebar.admin.controller';
import { Product } from '@module/product/entities/product.entity';
import { Distributor } from '@module/distributors/entities/distributor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sidebar, Product, Category, Author, Publisher, Distributor])],
  controllers: [SidebarController, AdminSidebarController],
  providers: [SidebarService],
})
export class SidebarModule {}
