import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductRequestDto } from './dto/filter-product-request.dto';
import { SidebarSearchRequestDto } from './dto/sidebar-search-request.dto';
import { ProductService } from './product.service';
import { FindAllProductRequestDto } from './dto/find-all-product-request.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query() requestDto: FindAllProductRequestDto) {
    return this.productService.findAllProducts(requestDto);
  }

  @Post('/create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Post('/create-multiple')
  @UseInterceptors(FileInterceptor('file'))
  createMultiple(@UploadedFile() file: Express.Multer.File) {
    return this.productService.createMultiple(file);
  }

  @Get('detail/:slug')
  getDetail(@Param('slug') slug: string) {
    return this.productService.getProductDetail(slug);
  }

  @Get('side-bar')
  getForSidebar(@Query() request: SidebarSearchRequestDto) {
    return this.productService.findAllForSidebar(request);
  }

  @Get('author')
  getByAuthorSlug(@Query() request: FilterProductRequestDto) {
    return this.productService.getByAuthor(request);
  }

  @Get('category')
  getByCategory(@Query() request: FilterProductRequestDto) {
    return this.productService.getByCategory(request);
  }
}
