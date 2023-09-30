import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMultipleProductsRequestDto, CreateProductDto } from './dto/create-product.dto';
import { FindAllProductRequestDto } from './dto/find-all-product-request.dto';
import { ProductService } from './product.service';
import { PaginationDto } from '@common/dto/pagination';
import { DeleteProductRequestDto } from './dto/delete-product-request.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('admin/product')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query() requestDto: FindAllProductRequestDto) {
    return this.productService.findAllProducts(requestDto);
  }

  @Post('create')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put()
  @UseInterceptors(FileInterceptor('data'))
  async update(@UploadedFile() file: Express.Multer.File) {
    const data = JSON.parse(file.buffer.toString('utf-8')) as UpdateProductDto;
    return this.productService.update(data);
  }

  @Delete()
  delete(@Query() requestDto: DeleteProductRequestDto) {
    return this.productService.delete(requestDto);
  }

  @Post('create-multiple')
  createMultiple(@Body() requestDto: CreateMultipleProductsRequestDto) {
    console.log(requestDto);
    return this.productService.createMultiple(requestDto);
  }

  @Post('create-multiple-file')
  @UseInterceptors(FileInterceptor('file'))
  createMultipleWithFile(@UploadedFile() file: Express.Multer.File) {
    return this.productService.createMultipleWithFile(file);
  }

  @Get('options')
  getProductOptions(@Query() requestDto: PaginationDto) {
    return this.productService.getProductOptions(requestDto);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.productService.getProductDetail(id);
  }
}
