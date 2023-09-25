import { BaseService } from '@common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { slugGenerate } from 'src/utils/common-util';
import { DistributorRepository } from './distributor.repository';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { Distributor } from './entities/distributor.entity';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { FindAllRequestDto } from '@module/author/dto/find-all-request.dto';
import { FindAllResponseDto } from '@module/auth/dto/find-all-response.dto';
import { getSkipAndTake } from 'src/utils/pagination-util';

@Injectable()
export class DistributorsService extends BaseService {
  constructor(
    @InjectRepository(Distributor)
    private distributorRepository: DistributorRepository,
  ) {
    super();
    this._entity = Distributor;
    this._model = this.distributorRepository;
  }
  async create(createDistributorDto: CreateDistributorDto) {
    const distributor = await this.distributorRepository.findOne({ where: { name: createDistributorDto.name } });
    if (distributor) {
      throw new RequestInvalidException('USER_ALREADY_EXISTS');
    }
    return this.createAndSave({ ...createDistributorDto, slug: slugGenerate(createDistributorDto.name) });
  }

  async findAllDistributor(requestDto: FindAllRequestDto): Promise<FindAllResponseDto<Distributor>> {
    const pagination = getSkipAndTake(requestDto.page, requestDto.pageSize);
    const [distributors, count] = await this.distributorRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: { createdAt: 'DESC', ...requestDto.order },
    });

    const totalPage = Math.ceil(count / requestDto.pageSize);
    return {
      count,
      rows: distributors,
      page: Number(requestDto.page),
      totalPage,
    };
  }
}
