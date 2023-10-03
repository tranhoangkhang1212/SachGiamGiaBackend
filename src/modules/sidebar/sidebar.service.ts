import { PaginationResponseDto } from '@common/dto/pagination-response.dto';
import { BaseService } from '@common/services/base.service';
import { AuthorRepository } from '@module/author/author.repository';
import { Author } from '@module/author/entities/author.entity';
import { CategoryRepository } from '@module/category/category.repository';
import { Category } from '@module/category/entities/category.entity';
import { DistributorRepository } from '@module/distributors/distributor.repository';
import { Distributor } from '@module/distributors/entities/distributor.entity';
import { priceFilters } from '@module/product/dto/filter-data-constant';
import { AuthorResponse, ShortProductResponseDto } from '@module/product/dto/products-response';
import { ProductFilterData, ProductFilterValue } from '@module/product/dto/sidebar-detail-response.dto';
import { Product } from '@module/product/entities/product.entity';
import { ProductRepository } from '@module/product/product.repository';
import { Publisher } from '@module/publisher/entities/publisher.entity';
import { PublisherRepository } from '@module/publisher/publisher.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFilter } from 'src/constant/enum/product-filter';
import { EOption, ESidebarType } from 'src/constant/enum/sidebar-enum';
import { TErrorKey } from 'src/constant/exception-code';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { getPageResponse, getSkipAndTake } from 'src/utils/pagination-util';
import { In } from 'typeorm';
import { CreateSidebarDto } from './dto/create-sidebar.dto';
import { GetSidebarRequestDto } from './dto/get-sidebar-request.dto';
import { SidebarPageResponseDto } from './dto/sidebar-page-response.dto';
import { SidebarResponseDto } from './dto/sidebar-response.dto';
import { Sidebar } from './entities/sidebar.entity';
import { SidebarRepository } from './sidebar.repository';
import { EStatus } from 'src/constant/enum/status-eum';

@Injectable()
export class SidebarService extends BaseService {
  constructor(
    @InjectRepository(Sidebar)
    private sidebarRepository: SidebarRepository,

    @InjectRepository(Category)
    private categoryRepository: CategoryRepository,

    @InjectRepository(Author)
    private authorRepository: AuthorRepository,

    @InjectRepository(Publisher)
    private publisherRepository: PublisherRepository,

    @InjectRepository(Distributor)
    private distributorRepository: DistributorRepository,

    @InjectRepository(Product)
    private productRepository: ProductRepository,
  ) {
    super();
    this._entity = Sidebar;
    this._model = this.sidebarRepository;
  }

  async create(createSidebarDto: CreateSidebarDto) {
    const { name, subMenu } = createSidebarDto;
    const sidebar = await this.sidebarRepository.findOne({ where: { name } });
    if (sidebar) {
      throw new RequestInvalidException('SIDE_BAR_NAME_ALREADY_EXISTS');
    }
    const { hasError, errorMsgKey } = await this.validateSubMenu(subMenu);
    if (hasError) {
      throw new RequestInvalidException(errorMsgKey as TErrorKey);
    }
    return this.createAndSave({ ...createSidebarDto, status: EStatus.Enable });
  }

  async getAll(): Promise<SidebarResponseDto[]> {
    const sideBars = await this.sidebarRepository.find({ where: { type: ESidebarType.Primary } });

    const response: SidebarResponseDto[] = await Promise.all(
      sideBars.map(async (sidebar) => {
        const subMenu = await Promise.all(
          sidebar.subMenu.map(async (id) => {
            const menuData = await this.findById(id);
            return this.getSideBarResponse(menuData);
          }),
        );

        return {
          ...this.getSideBarResponse(sidebar),
          subMenu,
        };
      }),
    );
    return response;
  }

  async getAllAndPagination(requestDto: GetSidebarRequestDto): Promise<PaginationResponseDto<SidebarPageResponseDto>> {
    const { take, skip } = getSkipAndTake(requestDto.page, requestDto.pageSize);
    const [sidebars, count] = await this.sidebarRepository.findAndCount({ take, skip });

    const responseDtos: SidebarPageResponseDto[] = [];
    for (const sidebar of sidebars) {
      const { name, slug, type } = sidebar;
      const dto = new SidebarPageResponseDto();
      let submenuResponse = [];
      if (sidebar.subMenu.length > 0) {
        const submenus = await this.sidebarRepository.find({ where: { id: In(sidebar.subMenu) } });
        submenuResponse = submenus.map((submenu) => submenu.name);
      }

      const { authorResponse, categoryResponse, distributorsResponse, productsResponse, publishersResponse } =
        await this.getSidebarProducts(sidebar);

      dto.name = name;
      dto.slug = slug;
      dto.type = type;
      dto.products = productsResponse;
      dto.author = authorResponse;
      dto.category = categoryResponse;
      dto.publisher = publishersResponse;
      dto.distributor = distributorsResponse;
      dto.subMenu = submenuResponse;
      responseDtos.push(dto);
    }

    return getPageResponse(requestDto, count, responseDtos);
  }

  async getSidebarFilter() {
    const category = await this.categoryRepository.find();
    const author = await this.authorRepository.find();
    const publisher = await this.publisherRepository.find();
    const categoryFilter = this.dataFilterResponse('Thể loại', ProductFilter.Category, category);
    const authorFilter = this.dataFilterResponse('Tác giả', ProductFilter.Author, author);
    const publisherFilter = this.dataFilterResponse('Nhà phát hành', ProductFilter.Publisher, publisher);
    return [categoryFilter, authorFilter, publisherFilter, priceFilters];
  }

  async getCreateOptions(): Promise<Record<EOption, AuthorResponse[]>> {
    const authors = await this.authorRepository.find({ select: ['id', 'name'] });
    const categories = await this.categoryRepository.find({ select: ['id', 'name'] });
    const distributors = await this.distributorRepository.find({ select: ['id', 'name'] });
    const publishers = await this.publisherRepository.find({ select: ['id', 'name'] });
    const submenu = await this.sidebarRepository.find({
      select: ['id', 'name'],
      where: { type: ESidebarType.SubMenu },
    });
    return {
      [EOption.Author]: authors,
      [EOption.Category]: categories,
      [EOption.Distributor]: distributors,
      [EOption.Publisher]: publishers,
      [EOption.SubMenu]: submenu,
    };
  }

  async getSidebarProducts(sidebar: Sidebar) {
    let productsResponse = [];
    if (sidebar.products.length > 0) {
      const products = await this.productRepository.find({ where: { id: In(sidebar.products) } });
      productsResponse = products.map((product) => new ShortProductResponseDto(product.id, product.name));
    }

    let categoryResponse = [];
    if (sidebar.category.length > 0) {
      const categories = await this.categoryRepository.find({ where: { id: In(sidebar.category) } });
      categoryResponse = categories.map((category) => new AuthorResponse(category.id, category.name));
    }

    let authorResponse = [];
    if (sidebar.authors.length > 0) {
      const authors = await this.authorRepository.find({ where: { id: In(sidebar.authors) } });
      authorResponse = authors.map((author) => new AuthorResponse(author.id, author.name));
    }

    let publishersResponse = [];
    if (sidebar.publishers.length > 0) {
      const publishers = await this.publisherRepository.find({ where: { id: In(sidebar.publishers) } });
      publishersResponse = publishers.map((publisher) => new AuthorResponse(publisher.id, publisher.name));
    }

    let distributorsResponse = [];
    if (sidebar.distributors.length > 0) {
      const publishers = await this.distributorRepository.find({ where: { id: In(sidebar.distributors) } });
      distributorsResponse = publishers.map((distributor) => new AuthorResponse(distributor.id, distributor.name));
    }

    return { productsResponse, authorResponse, categoryResponse, publishersResponse, distributorsResponse };
  }

  getSideBarResponse(entity: Sidebar) {
    return { name: entity.name, type: entity.type, slug: entity.slug };
  }

  async validateSubMenu(ids: string[]) {
    let hasError = false;
    let errorMsgKey = '';
    for await (const id of ids) {
      const subMenu = await this.sidebarRepository.findOne(id);
      if (!subMenu) {
        hasError = true;
        errorMsgKey = 'SIDE_BAR_SUB_MENU_NOT_FOUND';
        break;
      }
      if (subMenu.type !== ESidebarType.SubMenu) {
        hasError = true;
        errorMsgKey = 'SIDE_BAR_ARE_NOT_SUB_MENU';
        break;
      }
    }
    return {
      hasError,
      errorMsgKey,
    };
  }

  dataFilterResponse<T>(title: string, type: ProductFilter, data: T[]): ProductFilterData {
    const response = new ProductFilterData();
    response.title = title;
    response.type = type;
    response.values = data.map((e) => {
      const value = e as ProductFilterValue;
      return { id: value.id, name: value.name };
    });
    return response;
  }
}
