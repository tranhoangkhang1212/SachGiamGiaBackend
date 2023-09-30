import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { FilterProductRequestDto, SearchProductRequestDto } from './dto/filter-product-request.dto';
import { FindAllProductRequestDto } from './dto/find-all-product-request.dto';
import { SidebarSearchRequestDto } from './dto/sidebar-search-request.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query() requestDto: FindAllProductRequestDto) {
    return this.productService.findAllProducts(requestDto);
  }

  @Get('detail/:slug')
  getDetail(@Param('slug') slug: string) {
    return this.productService.getProductDetail(slug);
  }

  @Get('same-author/:slug')
  getSameAuthor(@Param('slug') slug: string) {
    return this.productService.getSameAuthor(slug);
  }

  @Post('side-bar')
  @HttpCode(HttpStatus.OK)
  getForSidebar(@Body() requestBody: SidebarSearchRequestDto) {
    return this.productService.findAllForSidebar(requestBody);
  }

  @Get('author')
  getByAuthorSlug(@Query() request: FilterProductRequestDto) {
    return this.productService.getByAuthor(request);
  }

  @Get('category')
  getByCategory(@Query() request: FilterProductRequestDto) {
    return this.productService.getByCategory(request);
  }

  @Get('search')
  searchProducts(@Query() request: SearchProductRequestDto) {
    return this.productService.searchProducts(request);
  }
}
