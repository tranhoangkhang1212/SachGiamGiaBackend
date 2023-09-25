import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateSidebarDto } from './dto/create-sidebar.dto';
import { SidebarService } from './sidebar.service';

@Controller('sidebar')
export class SidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @Post()
  create(@Body(new ValidationPipe({ whitelist: true })) createSidebarDto: CreateSidebarDto) {
    return this.sidebarService.create(createSidebarDto);
  }

  @Get()
  getAll() {
    return this.sidebarService.getAll();
  }
}
