import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { AdminResourceController } from './resource.admin.controller';
import { Resource } from './entities/resource.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from '@module/file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), FileUploadModule],
  controllers: [AdminResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
