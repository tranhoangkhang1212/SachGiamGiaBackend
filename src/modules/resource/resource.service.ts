import { PaginationDto } from '@common/dto/pagination';
import { BaseService } from '@common/services/base.service';
import { FindAllResponseDto } from '@module/auth/dto/find-all-response.dto';
import { FileUploadService } from '@module/file-upload/file-upload.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EResourceType } from 'src/constant/enum/resource-enum';
import { ImageTypesAccept } from 'src/constant/image-constant';
import { getSkipAndTake } from 'src/utils/pagination-util';
import { Resource } from './entities/resource.entity';
import { ResourceRepository } from './resource.repository';
import { DeleteResourceDto } from './dto/delete-resource.dto';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';

@Injectable()
export class ResourceService extends BaseService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: ResourceRepository,
    private fileUploadService: FileUploadService,
  ) {
    super();
    this._entity = Resource;
    this._model = this.resourceRepository;
  }

  async uploadImage(file: Express.Multer.File) {
    return this.uploadResource(file, EResourceType.Image);
  }

  async uploadResource(file: Express.Multer.File, type: EResourceType) {
    try {
      const { url, fileName } = await this.fileUploadService.uploadFile(file, ImageTypesAccept);
      const resource = new Resource();
      resource.name = fileName;
      resource.type = type;
      resource.url = url;
      return await this.createAndSave(resource);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllImages(requestDto: PaginationDto): Promise<FindAllResponseDto<Resource>> {
    const { take, skip } = getSkipAndTake(requestDto.page, requestDto.pageSize);
    const [images, count] = await this.resourceRepository.findAndCount({
      take,
      skip,
      where: { type: EResourceType.Image },
      order: { createdAt: 'DESC' },
    });

    const totalPage = Math.ceil(count / requestDto.pageSize);
    return { count, totalPage, page: requestDto.page, rows: images };
  }

  async deleteResource(requestDto: DeleteResourceDto) {
    const resource = await this.resourceRepository.findOne(requestDto.id);
    if (!resource) {
      throw new RequestInvalidException('RESOURCE_NOT_FOUND');
    }
    await this.fileUploadService.deleteObject(resource.name);
  }
}
