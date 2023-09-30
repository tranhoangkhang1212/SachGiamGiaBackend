import { Controller, Get } from '@nestjs/common';
import { SidebarService } from './sidebar.service';

@Controller('sidebar')
export class SidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @Get()
  async getAll() {
    return this.sidebarService.getAll();
  }

  @Get('filter')
  async getSidebarFilter() {
    return this.sidebarService.getSidebarFilter();
  }
}
