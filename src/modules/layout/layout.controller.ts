import { Controller, Get } from '@nestjs/common';
import { LayoutService } from './layout.service';

@Controller('layout')
export class LayoutController {
  constructor(private readonly layoutService: LayoutService) {}

  @Get('home-product')
  async getHomeProducts() {
    return this.layoutService.getHomeProducts();
  }

  @Get('banners/show')
  async getBannersShow() {
    return this.layoutService.getBannersShow();
  }

  @Get('base-layout')
  async getBaseLayout() {
    return this.layoutService.getBaseLayout();
  }
}
