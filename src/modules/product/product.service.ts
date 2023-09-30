import { PaginationDto } from '@common/dto/pagination';
import { PaginationResponseDto } from '@common/dto/pagination-response.dto';
import { BaseService } from '@common/services/base.service';
import { FindAllResponseDto } from '@module/auth/dto/find-all-response.dto';
import { FileUploadService } from '@module/file-upload/file-upload.service';
import { Sidebar } from '@module/sidebar/entities/sidebar.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { EFilterData } from 'src/constant/enum/filter-data';
import { EProductSort } from 'src/constant/enum/product-enum';
import { ProductFilter } from 'src/constant/enum/product-filter';
import { EStatus } from 'src/constant/enum/status-eum';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { getPageResponse, getSkipAndTake } from 'src/utils/pagination-util';
import * as unorm from 'unorm';
import { SidebarRepository } from './../sidebar/sidebar.repository';
import { CreateMultipleProductsRequestDto, CreateProductDto } from './dto/create-product.dto';
import { DeleteProductRequestDto } from './dto/delete-product-request.dto';
import { TSortType, priceValuesFilter } from './dto/filter-data-constant';
import { FilterProductRequestDto, SearchProductRequestDto } from './dto/filter-product-request.dto';
import { FindAllProductRequestDto, GetProductOptionRequestDto } from './dto/find-all-product-request.dto';
import { ProductDetailResponseDto, ProductResponseDto, ShortProductResponseDto } from './dto/products-response';
import { FilterListProductRequestDto, SidebarSearchRequestDto } from './dto/sidebar-search-request.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ImageModel } from './entities/images.model';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { getTimeStamp } from 'src/utils/date-time-utils';

@Injectable()
export class ProductService extends BaseService {
  constructor(
    @InjectRepository(Product)
    private productRepository: ProductRepository,

    @InjectRepository(Sidebar)
    private sidebarRepository: SidebarRepository,

    private fileUploadService: FileUploadService,
  ) {
    super();
    this._entity = Product;
    this._model = this.productRepository;
  }

  paramsSelectAll = ['Product', 'Author', 'Category', 'Publisher', 'Distributor'];
  productListSelect = [
    'Product.id',
    'Product.name',
    'Product.slug',
    'Product.images',
    'Product.price',
    'Product.finalPrice',
    'Product.saleOff',
    'Author',
    'Publisher',
  ];

  async create(requestDto: CreateProductDto) {
    const slug = slugify(requestDto.name, { trim: true, lower: true });
    const product = await this.productRepository.findOne({ where: { slug: slug } });
    if (product) {
      throw new HttpException(
        { code: 1003, message: `Product name already exists ${requestDto.name}` },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!requestDto.finalPrice) {
      requestDto.finalPrice = Math.ceil(requestDto.price - requestDto.price * (requestDto.saleOff / 100));
    }

    const imageModels = this.createImageModels(requestDto.images);
    const createProductDto = { ...requestDto, slug, status: EStatus.Enable, images: imageModels };
    const result = await this.createAndSave(createProductDto);
    return result;
  }

  async update(requestDto: UpdateProductDto) {
    const { id, description } = requestDto;
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new RequestInvalidException('PRODUCT_NOT_FOUND');
    }

    if (description) {
      const fileName = product.slug + getTimeStamp() + '.json';
      this.fileUploadService.uploadFileWithContent(description, fileName);
      product.description = fileName;
    }
    return this.productRepository.save(product);
  }

  async delete(requestDto: DeleteProductRequestDto) {
    await this.productRepository.delete({ id: requestDto.id });
  }

  async createMultiple(requestDto: CreateMultipleProductsRequestDto) {
    const productsCreated = [];
    for (const product of requestDto.products) {
      const productCreated = await this.create(product);
      productsCreated.push(productCreated);
    }
    return productsCreated;
  }

  async createMultipleWithFile(file: Express.Multer.File) {
    const rawData = JSON.parse(file.buffer.toString('utf-8')) as CreateProductDto[];
    const productsCreated = [];
    for (const product of rawData) {
      const productCreated = await this.create(product);
      productsCreated.push(productCreated);
    }
    return productsCreated;
  }

  async findAllForSidebar(requestBody: SidebarSearchRequestDto): Promise<PaginationResponseDto<ProductResponseDto>> {
    const sidebar = await this.sidebarRepository.findOne({ where: { slug: requestBody.slug } });
    if (!sidebar) {
      throw new RequestInvalidException('SIDE_BAR_NOT_FOUND');
    }

    const fieldSelected = [
      'Product.id',
      'Product.name',
      'Product.slug',
      'Product.price',
      'Product.saleOff',
      'Product.finalPrice',
      'Product.images',
      'Product.totalView',
      'Product.createdAt',
      'Author.id',
      'Author.name',
      'Category.id',
      'Category.name',
      'Publisher.id',
      'Publisher.name',
      'Distributor.id',
      'Distributor.name',
    ];

    const pagination = getSkipAndTake(requestBody.page, requestBody.pageSize);
    const { query, parameters } = this.conditionHandler(sidebar);
    const moreCondition = this.moreConditionHandler(requestBody.filters);
    const { field, order } = this.getSortOrder(requestBody.sort);

    const [products, count] = await this.productRepository
      .createQueryBuilder('Product')
      .innerJoin('Product.author', 'Author')
      .innerJoin('Product.category', 'Category')
      .innerJoin('Product.publisher', 'Publisher')
      .innerJoin('Product.distributor', 'Distributor')
      .select(fieldSelected)
      .where(query, parameters)
      .andWhere('Product.status = :status', { status: EStatus.Enable })
      .orderBy({ [field]: order as TSortType })
      .take(pagination.take)
      .skip(pagination.skip)
      .getManyAndCount();

    let productsResult = this.responseHandler([...products]);
    let total = count;
    if (moreCondition.query) {
      const [products, count] = await this.productRepository
        .createQueryBuilder('Product')
        .innerJoin('Product.author', 'Author')
        .innerJoin('Product.category', 'Category')
        .innerJoin('Product.publisher', 'Publisher')
        .innerJoin('Product.distributor', 'Distributor')
        .select(fieldSelected)
        .where(query, parameters)
        .andWhere(moreCondition.query, moreCondition.parameters)
        .andWhere('Product.status = :status', { status: EStatus.Enable })
        .orderBy({ 'Product.totalView': 'DESC' })
        .take(pagination.take)
        .skip(pagination.skip)
        .getManyAndCount();

      productsResult = this.responseHandler([...products]);
      total = count;
    }

    return getPageResponse<ProductResponseDto>(requestBody, total, productsResult);
  }

  async getProductDetail(slug: string): Promise<ProductDetailResponseDto> {
    const query = 'Product.slug IN (:...values) OR Product.id IN (:...values)';
    const product = await this.productRepository
      .createQueryBuilder('Product')
      .select(this.paramsSelectAll)
      .innerJoin('Product.author', 'Author')
      .innerJoin('Product.category', 'Category')
      .innerJoin('Product.publisher', 'Publisher')
      .innerJoin('Product.distributor', 'Distributor')
      .where(query, { values: [slug] })
      .getOne();
    if (!product) {
      throw new RequestInvalidException('PRODUCT_NOT_FOUND');
    }
    return new ProductDetailResponseDto(product);
  }

  async getSameAuthor(slug: string): Promise<ProductResponseDto[]> {
    const product = await this.productRepository
      .createQueryBuilder('Product')
      .select(['Product.author', 'Product.slug', 'Author.id'])
      .innerJoin('Product.author', 'Author')
      .where('Product.slug IN (:...values)', { values: [slug] })
      .getOne();
    const query = 'Product.author IN (:...values)';
    const params = { values: [product.author.id] };
    let products = await this.getProductList(query, params, 5);
    if (products.length === 0) {
      products = await this.getProductList('', {}, 5);
    }
    return products;
  }

  async getByAuthor(request: FilterProductRequestDto) {
    const condition = 'Author.slug IN (:...values)';
    const products = await this.getProductByParameters(condition, { values: [request.slug] }, this.paramsSelectAll);
    return this.responseHandler(products);
  }

  async getByCategory(request: FilterProductRequestDto) {
    const condition = 'Category.slug IN (:...values)';
    const products = await this.getProductByParameters(condition, { values: [request.slug] }, this.paramsSelectAll);
    return this.responseHandler(products);
  }

  async findAllProducts(requestDto: FindAllProductRequestDto): Promise<FindAllResponseDto<Product>> {
    const pagination = getSkipAndTake(requestDto.page, requestDto.pageSize);

    const fieldSelected = [
      'Product.id',
      'Product.name',
      'Product.slug',
      'Product.createdAt',
      'Product.images',
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
      .andWhere('Product.status = :status', { status: EStatus.Enable })
      .orderBy({ 'Product.createdAt': 'DESC' })
      .take(pagination.take)
      .skip(pagination.skip)
      .getManyAndCount();

    return getPageResponse(requestDto, count, products);
  }

  async getProductOptions(requestDto: PaginationDto): Promise<PaginationResponseDto<ShortProductResponseDto>> {
    const { take, skip } = getSkipAndTake(requestDto.page, requestDto.pageSize);
    const [products, count] = await this.productRepository.findAndCount({ select: ['id', 'name'], take, skip });
    return getPageResponse(requestDto, count, products);
  }

  async getProductList<T>(condition: string, params: T, limit?: number): Promise<ProductResponseDto[]> {
    return await this.getProductByParameters(condition, params, this.productListSelect, limit);
  }

  async getProductByParameters<T>(condition: string, params: T, select: string[], limit?: number) {
    return await this.productRepository
      .createQueryBuilder('Product')
      .innerJoin('Product.author', 'Author')
      .innerJoin('Product.category', 'Category')
      .innerJoin('Product.publisher', 'Publisher')
      .innerJoin('Product.distributor', 'Distributor')
      .select(select)
      .where(condition, params)
      .andWhere('Product.status = :status', { status: EStatus.Enable })
      .limit(limit ? limit : 99999999)
      .getMany();
  }

  async searchProducts(request: SearchProductRequestDto) {
    const { keyword } = request;
    if (!keyword) {
      return [];
    }
    const products = await this.productRepository
      .createQueryBuilder()
      .select([
        'Product.id',
        'Product.name',
        'Product.price',
        'Product.saleOff',
        'Product.finalPrice',
        'Product.images',
      ])
      .where('unaccent(Product.name) ILIKE unaccent(:keyword)', { keyword: `%${unorm.nfkd(keyword)}%` })
      .getMany();
    return products;
  }

  responseHandler(products: Product[]): ProductResponseDto[] {
    return products.map((product) => new ProductResponseDto(product));
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
    if (queryList.length === 1) {
      query = queryList[0];
    }
    if (queryList.length > 1) {
      query = queryList.join(' OR ');
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
    if (sidebar.authors.length > 0) {
      queryList.push('Product.author IN (:...authors)');
      parameters = { ...parameters, authors: sidebar.authors };
    }
    if (sidebar.publishers.length > 0) {
      queryList.push('Product.publisher IN (:...publishers)');
      parameters = { ...parameters, publishers: sidebar.publishers };
    }
    if (sidebar.distributors.length > 0) {
      queryList.push('Product.distributor IN (:...distributors)');
      parameters = { ...parameters, distributors: sidebar.distributors };
    }

    let query = '';
    if (queryList.length > 1) {
      query = queryList.join(' OR ');
    } else {
      query = queryList[0];
    }
    return { parameters, query };
  }

  moreConditionHandler(requests: FilterListProductRequestDto[]) {
    let parameters = {};
    const queryList = [];
    let query = '';

    if (!requests || requests.length <= 0) {
      return { query, parameters };
    }
    for (const request of requests) {
      if (request.type === ProductFilter.Author) {
        queryList.push('Product.author IN (:...moreAuthors)');
        parameters = { ...parameters, moreAuthors: request.values };
      }
      if (request.type === ProductFilter.Category) {
        queryList.push('Product.category IN (:...moreCategory)');
        parameters = { ...parameters, moreCategory: request.values };
      }
      if (request.type === ProductFilter.Publisher) {
        queryList.push('Product.publisher IN (:...morePublishers)');
        parameters = { ...parameters, morePublishers: request.values };
      }
      if (request.type === ProductFilter.Price) {
        const prices = request.values.map((e) => Number(e));
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        const minPrice = priceValuesFilter[min] as string;
        const maxPrice = priceValuesFilter[max] as string;

        const minValue = minPrice.split('-')[0];
        const maxValue = maxPrice.split('-')[1];

        queryList.push(`Product.price >= ${Number(minValue)} AND Product.price <= ${Number(maxValue)}`);
      }
    }
    if (queryList.length > 1) {
      query = queryList.join(' AND ');
    } else {
      query = queryList[0];
    }
    return { parameters, query };
  }

  getSortOrder(sort: EProductSort) {
    if (sort === EProductSort.NoneSort) {
      return { field: 'Product.createdAt', order: 'DESC' };
    }
    const [field, order] = sort.split('-');
    return { field: `Product.${field}`, order };
  }

  createImageModels(images: string[]): ImageModel[] {
    return images.map((url, index) => ({ url, default: index === 0 }));
  }
}
