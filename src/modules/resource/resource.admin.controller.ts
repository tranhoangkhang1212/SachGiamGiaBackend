import { PaginationDto } from '@common/dto/pagination';
import { Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourceService } from './resource.service';
import { DeleteResourceDto } from './dto/delete-resource.dto';

@Controller('admin/resource')
export class AdminResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async getAll(@Query() requestDto: PaginationDto) {
    return await this.resourceService.getAllImages(requestDto);
  }

  @Delete()
  async deleteResource(@Query() requestDto: DeleteResourceDto) {
    await this.deleteResource(requestDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    return await this.resourceService.uploadImage(image);
  }
}
