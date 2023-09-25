import { BaseService } from '@common/services/base.service';
import { FindAllResponseDto } from '@module/auth/dto/find-all-response.dto';
import { Sidebar } from '@module/sidebar/entities/sidebar.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { ProductFilter } from 'src/constant/enum/product-filter';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { uniqueBy } from 'src/utils/common-util';
import { getSkipAndTake } from 'src/utils/pagination-util';
import { SidebarRepository } from './../sidebar/sidebar.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { filterDataConstants, priceFilters } from './dto/filter-data-constant';
import { FilterProductRequestDto } from './dto/filter-product-request.dto';
import { FindAllProductRequestDto, GetProductOptionRequestDto } from './dto/find-all-product-request.dto';
import { ProductDetailResponseDto } from './dto/products-response';
import { ProductFilterData, ProductFilterValue, SidebarDetailResponseDto } from './dto/sidebar-detail-response.dto';
import { SidebarSearchRequestDto } from './dto/sidebar-search-request.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { EFilterData } from 'src/constant/enum/filter-data';

@Injectable()
export class ProductService extends BaseService {
  constructor(
    @InjectRepository(Product)
    private productRepository: ProductRepository,

    @InjectRepository(Sidebar)
    private sidebarRepository: SidebarRepository,
  ) {
    super();
    this._entity = Product;
    this._model = this.productRepository;
  }

  async create(requestDto: CreateProductDto) {
    const slug = slugify(requestDto.name, { trim: true, lower: true });
    const product = await this.productRepository.findOne({ where: { slug: slug } });
    if (product) {
      throw new HttpException(
        { code: 1003, message: `Product name already exists ${requestDto.name}` },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (requestDto.finalPrice) {
      requestDto.finalPrice = Math.ceil(requestDto.price - requestDto.price * requestDto.saleOff);
    }
    const createProductDto = { ...requestDto, slug };
    const result = await this.createAndSave(createProductDto);
    return result;
  }

  async createMultiple(file: Express.Multer.File) {
    const rawData = JSON.parse(file.buffer.toString('utf-8')) as CreateProductDto[];
    const productsCreated = [];
    for (const product of rawData) {
      const productCreated = await this.create(product);
      productsCreated.push(productCreated);
    }
    return productsCreated;
  }

  async findAllForSidebar(request: SidebarSearchRequestDto): Promise<SidebarDetailResponseDto> {
    const sidebar = await this.sidebarRepository.findOne({ where: { slug: request.slug } });
    if (!sidebar) {
      throw new RequestInvalidException('SIDE_BAR_NOT_FOUND');
    }

    const fieldSelected = [
      'Product.name',
      'Product.price',
      'Product.saleOff',
      'Product.finalPrice',
      'Product.image',
      'Author.id',
      'Author.name',
      'Category.id',
      'Category.name',
      'Publisher.id',
      'Publisher.name',
      'Distributor.id',
      'Distributor.name',
    ];

    const { query, parameters } = this.conditionHandler(sidebar);
    const productsInCategory = await this.productRepository
      .createQueryBuilder('Product')
      .innerJoin('Product.author', 'Author')
      .innerJoin('Product.category', 'Category')
      .innerJoin('Product.publisher', 'Publisher')
      .innerJoin('Product.distributor', 'Distributor')
      .select(fieldSelected)
      .where(query, parameters)
      .getMany();

    const productsResult = this.responseHandler([...productsInCategory]);
    const categories = uniqueBy(
      productsResult.map((product) => product.category),
      'id',
    );
    const authors = uniqueBy(
      productsResult.map((product) => product.author),
      'id',
    );
    const publishers = uniqueBy(
      productsResult.map((product) => product.publisher),
      'id',
    );
    const filterEntities = [categories, authors, publishers];
    const filterResponse = filterDataConstants.map((e, index) =>
      this.dataFilterResponse(e.title, e.type, filterEntities[index]),
    );
    if (productsResult.length === 0) {
      priceFilters.values = [];
    }

    return { products: productsResult, filters: [...filterResponse, priceFilters] };
  }

  async getProductDetail(slug: string): Promise<ProductDetailResponseDto> {
    const product = await this.productRepository.findOne({ where: { slug: slug } });
    return new ProductDetailResponseDto(product);
  }

  async getByAuthor(request: FilterProductRequestDto) {
    const condition = 'Author.slug IN (:...values)';
    const products = await this.productRepository
      .createQueryBuilder('Product')
      .innerJoin('Product.author', 'Author')
      .innerJoin('Product.category', 'Category')
      .innerJoin('Product.publisher', 'Publisher')
      .innerJoin('Product.distributor', 'Distributor')
      .select(['Product', 'Author', 'Category', 'Publisher', 'Distributor'])
      .where(condition, { values: [request.slug] })
      .getMany();
    return this.responseHandler(products);
  }

  async getByCategory(request: FilterProductRequestDto) {
    const condition = 'Category.slug IN (:...values)';
    const products = await this.productRepository
      .createQueryBuilder('Product')
      .innerJoin('Product.author', 'Author')
      .innerJoin('Product.category', 'Category')
      .innerJoin('Product.publisher', 'Publisher')
      .innerJoin('Product.distributor', 'Distributor')
      .select(['Product', 'Author', 'Category', 'Publisher', 'Distributor'])
      .where(condition, { values: [request.slug] })
      .getMany();
    return this.responseHandler(products);
  }

  async findAllProducts(requestDto: FindAllProductRequestDto): Promise<FindAllResponseDto<Product>> {
    const pagination = getSkipAndTake(requestDto.page, requestDto.pageSize);

    const fieldSelected = [
      'Product.id',
      'Product.name',
      'Product.slug',
      'Product.createdAt',
      'Product.image',
      'Product.price',
      'Product.saleOff',
      'Product.finalPrice',
      'Author.id',
      'Author.name',
      'Category.id',
      'Category.name',
      'Publisher.id',
      'Publisher.name',
      'Distributor.id',
      'Distributor.name',
    ];

    const { parameters, query } = this.getAllConditionHandler(requestDto.options);
    const [products, count] = await this.productRepository
      .createQueryBuilder('Product')
      .innerJoin('Product.author', 'Author')
      .innerJoin('Product.category', 'Category')
      .innerJoin('Product.publisher', 'Publisher')
      .innerJoin('Product.distributor', 'Distributor')
      .select(fieldSelected)
      .where(query, parameters)
      .orderBy({ 'Product.createdAt': 'DESC' })
      .take(pagination.take)
      .skip(pagination.skip)
      .getManyAndCount();

    const totalPage = Math.ceil(count / requestDto.pageSize);
    return {
      count,
      rows: products,
      page: Number(requestDto.page),
      totalPage,
    };
  }

  responseHandler(products: Product[]): ProductDetailResponseDto[] {
    return products.map((product) => new ProductDetailResponseDto(product));
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

  getAllConditionHandler(options: GetProductOptionRequestDto[]) {
    let parameters = {};
    const queryList = [];
    if (!options) {
      return { parameters, query: '' };
    }
    for (const option of options) {
      if (option.values.length <= 0) {
        continue;
      }
      if (EFilterData.Author === option.type) {
        queryList.push('Product.author IN (:...authors)');
        parameters = { ...parameters, authors: option.values };
      }
      if (EFilterData.Publisher === option.type) {
        queryList.push('Product.publisher IN (:...publishers)');
        parameters = { ...parameters, publishers: option.values };
      }
      if (EFilterData.Distributor === option.type) {
        queryList.push('Product.distributor IN (:...distributors)');
        parameters = { ...parameters, distributors: option.values };
      }
    }

    let query = '';
    if (queryList.length > 1) {
      query = queryList.join(' OR ');
    } else {
      query = queryList[0];
    }
    return { parameters, query };
  }

  conditionHandler(sidebar: Sidebar) {
    let parameters = {};
    const queryList = [];
    if (sidebar.category.length > 0) {
      queryList.push('Product.category IN (:...category)');
      parameters = { ...parameters, category: sidebar.category };
    }
    if (sidebar.products.length > 0) {
      queryList.push('Product.id IN (:...products)');
      parameters = { ...parameters, products: sidebar.products };
    }

    let query = '';
    if (queryList.length > 1) {
      query = queryList.join(' OR ');
    } else {
      query = queryList[0];
    }
    return { parameters, query };
  }
}
