import { BaseService } from '@common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { slugGenerate } from 'src/utils/common-util';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { FindAllRequestDto } from '@module/author/dto/find-all-request.dto';
import { FindAllResponseDto } from '@module/auth/dto/find-all-response.dto';
import { getSkipAndTake } from 'src/utils/pagination-util';

@Injectable()
export class CategoryService extends BaseService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: CategoryRepository,
  ) {
    super();
    this._entity = Category;
    this._model = this.categoryRepository;
  }
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (category) {
      throw new RequestInvalidException('CATEGORY_NAME_ALREADY_EXISTS');
    }
    return this.createAndSave({ ...createCategoryDto, slug: slugGenerate(createCategoryDto.name) });
  }

  async findAllCategories(requestDto: FindAllRequestDto): Promise<FindAllResponseDto<Category>> {
    const pagination = getSkipAndTake(requestDto.page, requestDto.pageSize);
    const [categories, count] = await this.categoryRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: { createdAt: 'DESC', ...requestDto.order },
    });

    const totalPage = Math.ceil(count / requestDto.pageSize);
    return {
      count,
      rows: categories,
      page: Number(requestDto.page),
      totalPage,
    };
  }
}
