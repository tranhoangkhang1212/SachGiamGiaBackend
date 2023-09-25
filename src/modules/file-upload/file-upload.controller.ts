import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

interface IRequest {
  name: string;
}

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() image: Express.Multer.File, @Body() request: IRequest) {
    console.log(request.name);

    const imageUrl = await this.fileUploadService.uploadFile(image);
    return { imageUrl };
  }
}
