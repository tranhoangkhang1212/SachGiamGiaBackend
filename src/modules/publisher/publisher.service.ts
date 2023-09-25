import { BaseService } from '@common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { slugGenerate } from 'src/utils/common-util';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { PublisherRepository } from './publisher.repository';
import { FindAllRequestDto } from '@module/author/dto/find-all-request.dto';
import { FindAllResponseDto } from '@module/auth/dto/find-all-response.dto';
import { getSkipAndTake } from 'src/utils/pagination-util';

@Injectable()
export class PublisherService extends BaseService {
  constructor(
    @InjectRepository(Publisher)
    private publisherRepository: PublisherRepository,
  ) {
    super();
    this._entity = Publisher;
    this._model = this.publisherRepository;
  }

  async create(createPublisherDto: CreatePublisherDto) {
    const publisher = await this.publisherRepository.findOne({ where: { name: createPublisherDto.name } });
    if (publisher) {
      throw new RequestInvalidException('USER_ALREADY_EXISTS');
    }
    return this.createAndSave({ ...createPublisherDto, slug: slugGenerate(createPublisherDto.name) });
  }

  async findAllPublisher(requestDto: FindAllRequestDto): Promise<FindAllResponseDto<Publisher>> {
    const pagination = getSkipAndTake(requestDto.page, requestDto.pageSize);
    const [publishers, count] = await this.publisherRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: { createdAt: 'DESC', ...requestDto.order },
    });

    const totalPage = Math.ceil(count / requestDto.pageSize);
    return {
      count,
      rows: publishers,
      page: Number(requestDto.page),
      totalPage,
    };
  }
}
