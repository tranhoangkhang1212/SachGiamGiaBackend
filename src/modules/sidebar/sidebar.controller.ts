import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { CreateSidebarDto } from './dto/create-sidebar.dto';
import { UpdateSidebarDto } from './dto/update-sidebar.dto';

@Controller('sidebar')
export class SidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @Post()
  create(@Body() createSidebarDto: CreateSidebarDto) {
    return this.sidebarService.create(createSidebarDto);
  }

  @Get()
  findAll() {
    return this.sidebarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sidebarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSidebarDto: UpdateSidebarDto) {
    return this.sidebarService.update(+id, updateSidebarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sidebarService.remove(+id);
  }
}
