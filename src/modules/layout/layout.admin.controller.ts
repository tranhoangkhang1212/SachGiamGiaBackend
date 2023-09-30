import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateHomeProductDto } from './dto/create-home-product.dto';
import { UpdateBannerRequestDto } from './dto/update-banner-request.dto';
import { LayoutService } from './layout.service';
import { UpdateHomeProductShowRequestDto } from './dto/update-home-product-request.dto';

@Controller('admin/layout')
export class AdminLayoutController {
  constructor(private readonly layoutService: LayoutService) {}

  @Post('default')
  async createDefaultLayout() {
    return this.layoutService.createDefaultLayout();
  }

  @Post('home-products')
  async createHomeProduct(@Body(new ValidationPipe({ whitelist: true })) createHomeProductDto: CreateHomeProductDto) {
    return this.layoutService.createHomeProduct(createHomeProductDto);
  }

  @Get('home-products')
  async getAllHomeProducts() {
    return this.layoutService.getAllHomeProductsByAdmin();
  }

  // @Put('home-product-show-products')
  // async updateHomeProductShow(@Body() requestDto: UpdateHomeProductShowRequestDto) {
  //   return this.layoutService.updateHomeProductShow(requestDto);
  // }

  @Get('banners')
  async getAllBanners() {
    return this.layoutService.getAllBanners();
  }

  @Put('banners')
  @UseInterceptors(FileInterceptor('file'))
  async addBanner(@UploadedFile() image: Express.Multer.File) {
    return this.layoutService.addBanner(image);
  }

  @Delete('banners')
  async deleteBanners(@Body() requestDto: UpdateBannerRequestDto) {
    return this.layoutService.deleteBanners(requestDto);
  }

  @Put('banners/status')
  async updateBannersStatus(@Body() requestDto: UpdateBannerRequestDto) {
    return this.layoutService.updateBannersStatus(requestDto);
  }
}
