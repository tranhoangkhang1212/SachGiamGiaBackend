import { BaseLayoutModel } from './entities/base-layout.model';
import { BaseService } from '@common/services/base.service';
import { AuthorResponse, ProductResponseDto, ShortProductResponseDto } from '@module/product/dto/products-response';
import { Product } from '@module/product/entities/product.entity';
import { ProductService } from '@module/product/product.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EStatus } from 'src/constant/enum/status-eum';
import { slugGenerate } from 'src/utils/common-util';
import { CreateHomeProductDto } from './dto/create-home-product.dto';
import { GetHomeProductRequestDto } from './dto/get-home-product-request.dto';
import { HomeProductsResponseDto } from './dto/home-product-response.dto';
import { HomeProductModel } from './entities/home-product.model';
import { Layout } from './entities/layout.entity';
import { LayoutRepository } from './layout.repository';
import { FileUploadService } from '@module/file-upload/file-upload.service';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { BannerModel } from './entities/banner.model';
import { UpdateBannerRequestDto } from './dto/update-banner-request.dto';
import { UpdateHomeProductShowRequestDto } from './dto/update-home-product-request.dto';
import { Category } from '@module/category/entities/category.entity';
import { CategoryRepository } from '@module/category/category.repository';
import { AuthorRepository } from '@module/author/author.repository';
import { Author } from '@module/author/entities/author.entity';
import { Publisher } from '@module/publisher/entities/publisher.entity';
import { Distributor } from '@module/distributors/entities/distributor.entity';
import { PublisherRepository } from '@module/publisher/publisher.repository';
import { DistributorRepository } from '@module/distributors/distributor.repository';
import { ProductRepository } from '@module/product/product.repository';
import { In } from 'typeorm';
import { SidebarPageResponseDto } from '@module/sidebar/dto/sidebar-page-response.dto';
import { UpdateBaseLayoutRequestDto } from './dto/update-base-layout-request.dto';

@Injectable()
export class LayoutService extends BaseService {
  constructor(
    private productService: ProductService,

    private fileUploadService: FileUploadService,

    @InjectRepository(Layout)
    private layoutRepository: LayoutRepository,

    @InjectRepository(Product)
    private productRepository: ProductRepository,

    @InjectRepository(Category)
    private categoryRepository: CategoryRepository,

    @InjectRepository(Author)
    private authorRepository: AuthorRepository,

    @InjectRepository(Publisher)
    private publisherRepository: PublisherRepository,

    @InjectRepository(Distributor)
    private distributorRepository: DistributorRepository,
  ) {
    super();
    this._entity = Layout;
    this._model = this.layoutRepository;
  }

  async createDefaultLayout() {
    return await this.layoutRepository.save(new Layout());
  }

  async createHomeProduct(createLayoutDto: CreateHomeProductDto) {
    const homeProduct: HomeProductModel = {
      ...createLayoutDto,
      status: EStatus.Enable,
    };
    const layout = await this.getLayout();
    layout.homeProducts.push(homeProduct);
    return this.layoutRepository.save(layout);
  }

  // async updateHomeProductShow(requestDto: UpdateHomeProductShowRequestDto) {}

  async getAllHomeProductsByAdmin(): Promise<SidebarPageResponseDto[]> {
    const { homeProducts } = await this.layoutRepository.findOne();

    const responseDtos: SidebarPageResponseDto[] = [];
    for (const homeProduct of homeProducts) {
      const { name, slug } = homeProduct;

      const dto = new SidebarPageResponseDto();
      const { authorResponse, categoryResponse, distributorsResponse, productsResponse, publishersResponse } =
        await this.getAllHomeProducts(homeProduct);

      const productsShow = await this.productRepository.find({
        where: {
          id: In(homeProduct.productsShow),
        },
      });
      const productShowResponse = productsShow.map((product) => new ShortProductResponseDto(product.id, product.name));

      dto.name = name;
      dto.slug = slug;
      dto.products = productsResponse;
      dto.author = authorResponse;
      dto.category = categoryResponse;
      dto.publisher = publishersResponse;
      dto.distributor = distributorsResponse;
      dto.productShow = productShowResponse;
      responseDtos.push(dto);
    }
    return responseDtos;
  }

  async getHomeProducts(): Promise<HomeProductsResponseDto[]> {
    const layout = await this.getLayout();
    const products: HomeProductsResponseDto[] = await Promise.all(
      layout.homeProducts.map(async (product) => {
        const query = 'Product.id IN (:...values)';
        const productsList = await this.productService.getProductList(query, { values: product.productsShow });
        return { name: product.name, products: productsList };
      }),
    );
    return products;
  }

  async getHomeProductBySlug(queryParams: GetHomeProductRequestDto): Promise<HomeProductsResponseDto> {
    const layout = await this.getLayout();
    const homeProduct = layout.homeProducts.find((homeProduct) => homeProduct.slug === queryParams.slug);
    const { query, params } = this.getCondition(homeProduct);
    const productsList = await this.productService.getProductList(query, params);
    return { name: homeProduct.name, products: productsList };
  }

  async getAllBanners() {
    const layout = await this.getLayout();
    return layout.banners;
  }

  async getBannersShow() {
    const layout = await this.getLayout();
    return layout.banners.filter((banner) => banner.show === true).map((banner) => banner.url);
  }

  async addBanner(file: Express.Multer.File) {
    const layout = await this.getLayout();
    try {
      const { url, fileName } = await this.fileUploadService.uploadFile(file, []);
      const newBanner = new BannerModel(url, fileName, true);
      layout.banners.unshift(newBanner);
      this.layoutRepository.save(layout);
      return layout.banners;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteBanners(requestDto: UpdateBannerRequestDto) {
    const layout = await this.getLayout();
    const urls = requestDto.urls;
    const bannerRemoved = layout.banners.filter((banner) => urls.includes(banner.url)).map((banner) => banner.fileName);
    this.fileUploadService.deleteMultipleObjects(bannerRemoved);
    layout.banners = layout.banners.filter((banner) => !urls.includes(banner.url));
    return this.layoutRepository.save(layout);
  }

  async updateBannersStatus(requestDto: UpdateBannerRequestDto) {
    const layout = await this.getLayout();
    const urls = requestDto.urls;
    for (const banner of layout.banners) {
      if (!urls.includes(banner.url)) {
        continue;
      }
      banner.show = !banner.show;
    }
    return this.layoutRepository.save(layout);
  }

  async getLayout() {
    const layout = await this.layoutRepository.findOne();
    if (!layout) {
      throw new RequestInvalidException('LAYOUT_NOT_FOUND');
    }
    return layout;
  }

  async getAllHomeProducts(homeProduct: HomeProductModel) {
    let productsResponse = [];
    if (homeProduct.products.length > 0) {
      const products = await this.productRepository.find({ where: { id: In(homeProduct.products) } });
      productsResponse = products.map((product) => new ShortProductResponseDto(product.id, product.name));
    }

    let categoryResponse = [];
    if (homeProduct.category.length > 0) {
      const categories = await this.categoryRepository.find({ where: { id: In(homeProduct.category) } });
      categoryResponse = categories.map((category) => new AuthorResponse(category.id, category.name));
    }

    let authorResponse = [];
    if (homeProduct.authors.length > 0) {
      const authors = await this.authorRepository.find({ where: { id: In(homeProduct.authors) } });
      authorResponse = authors.map((author) => new AuthorResponse(author.id, author.name));
    }

    let publishersResponse = [];
    if (homeProduct.publishers.length > 0) {
      const publishers = await this.publisherRepository.find({ where: { id: In(homeProduct.publishers) } });
      publishersResponse = publishers.map((publisher) => new AuthorResponse(publisher.id, publisher.name));
    }

    let distributorsResponse = [];
    if (homeProduct.distributors.length > 0) {
      const publishers = await this.distributorRepository.find({ where: { id: In(homeProduct.distributors) } });
      distributorsResponse = publishers.map((distributor) => new AuthorResponse(distributor.id, distributor.name));
    }

    return { productsResponse, authorResponse, categoryResponse, publishersResponse, distributorsResponse };
  }

  async updateBaseLayout(requestDto: UpdateBaseLayoutRequestDto) {
    const layout = await this.getLayout();
    const baseLayout = layout.baseLayout;
    await this.updateBaseLayoutHandler(baseLayout, requestDto);
    return await this.layoutRepository.save(layout);
  }

  async getBaseLayout() {
    return (await this.getLayout()).baseLayout;
  }

  private async updateBaseLayoutHandler(baseLayout: BaseLayoutModel, requestDto: UpdateBaseLayoutRequestDto) {
    const keys = Object.keys(requestDto);
    for (const key of keys) {
      if (requestDto[key]) {
        baseLayout[key] = requestDto[key];
      }
    }
  }

  private getProductResponse(product: Product): ProductResponseDto {
    return { ...product };
  }

  private getCondition(product: HomeProductModel) {
    const { products, authors, publishers, distributors } = product;

    const queryList = [];
    let params = {};
    if (products.length > 0) {
      queryList.push('Product.id IN (:..ids)');
      params = { ...params, ids: products };
    }
    if (authors.length > 0) {
      queryList.push('Product.author IN (:...authors)');
      params = { ...params, authors };
    }
    if (publishers.length > 0) {
      queryList.push('Product.authors IN (:..publishers)');
      params = { ...params, publishers };
    }
    if (distributors.length > 0) {
      queryList.push('Product.distributor IN (:...distributors)');
      params = { ...params, distributors };
    }

    let query = '';
    if (queryList.length === 1) {
      query = queryList[0];
    }
    if (queryList.length > 1) {
      query = queryList.join(' OR ');
    }
    return { query, params };
  }
}
