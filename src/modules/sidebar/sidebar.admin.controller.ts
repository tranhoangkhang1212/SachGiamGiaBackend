import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateSidebarDto } from './dto/create-sidebar.dto';
import { SidebarService } from './sidebar.service';
import { GetSidebarRequestDto } from './dto/get-sidebar-request.dto';

@Controller('admin/sidebar')
export class AdminSidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @Post()
  async create(@Body(new ValidationPipe({ whitelist: true })) createSidebarDto: CreateSidebarDto) {
    return this.sidebarService.create(createSidebarDto);
  }

  @Get()
  async getAll(@Query() requestDto: GetSidebarRequestDto) {
    return this.sidebarService.getAllAndPagination(requestDto);
  }

  @Get('options')
  async getCreateOptions() {
    return this.sidebarService.getCreateOptions();
  }
}
