import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AdminCategoryController } from './category.admin.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [AdminCategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
