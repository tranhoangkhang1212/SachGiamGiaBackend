import { BaseService } from '@common/services/base.service';
import { FindAllResponseDto } from '@module/auth/dto/find-all-response.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { sleep, slugGenerate } from 'src/utils/common-util';
import { getSkipAndTake } from 'src/utils/pagination-util';
import { AuthorRepository } from './author.repository';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FindAllRequestDto } from './dto/find-all-request.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService extends BaseService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: AuthorRepository,
  ) {
    super();
    this._entity = Author;
    this._model = this.authorRepository;
  }
  async create(createAuthorDto: CreateAuthorDto) {
    const author = await this.authorRepository.findOne({ where: { name: createAuthorDto.name } });
    if (author) {
      throw new RequestInvalidException('USER_ALREADY_EXISTS');
    }
    return this.createAndSave({ ...createAuthorDto, slug: slugGenerate(createAuthorDto.name) });
  }

  async findAllAuthors(requestDto: FindAllRequestDto): Promise<FindAllResponseDto<Author>> {
    const pagination = getSkipAndTake(requestDto.page, requestDto.pageSize);
    const [authors, count] = await this.authorRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: { createdAt: 'DESC', ...requestDto.order },
    });

    const totalPage = Math.ceil(count / requestDto.pageSize);
    return {
      count,
      rows: authors,
      page: Number(requestDto.page),
      totalPage,
    };
  }
}
