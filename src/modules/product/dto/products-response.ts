import { Product } from '../entities/product.entity';

export class ProductPageResponseDto {
  count: number;
  products: ProductDetailResponseDto[];
}

export class ProductResponseDto {
  constructor(product?: Product) {
    this.id = product?.id;
    this.name = product?.name;
    this.slug = product?.slug;
    this.images = product?.images;
    this.price = product?.price;
    this.finalPrice = product?.finalPrice;
    this.saleOff = product?.saleOff;
    this.author = new AuthorResponse(product?.author?.id, product?.author?.name);
    this.publisher = new AuthorResponse(product?.publisher?.id, product?.publisher?.name);
    this.category = new AuthorResponse(product?.category?.id, product?.category?.name);
  }
  id: string;
  name: string;
  slug?: string;
  images: ProductImageResponse[];
  saleOff: number;
  price: number;
  finalPrice: number;
  author: AuthorResponse;
  publisher: AuthorResponse;
  category?: AuthorResponse;
}

export class ProductDetailResponseDto extends ProductResponseDto {
  constructor(product?: Product) {
    super();
    this.category = new AuthorResponse(product?.category?.id, product?.category?.name);
    this.distributor = new AuthorResponse(product?.distributor?.id, product?.distributor?.name);
    this.totalView = product?.totalView;
    this.totalBuy = product?.totalBuy;
    this.star = product?.star;
    this.description = product?.description;
    this.id = product?.id;
    this.name = product?.name;
    this.slug = product?.slug;
    this.images = product?.images;
    this.author = new AuthorResponse(product?.author?.id, product?.author?.name);
    this.publisher = new AuthorResponse(product?.publisher?.id, product?.publisher?.name);
    this.price = product?.price;
    this.finalPrice = product?.finalPrice;
    this.saleOff = product?.saleOff;
    this.statistics = product.statistics ? product.statistics : '';
  }

  distributor: AuthorResponse;
  totalView: number;
  totalBuy: number;
  star: number;
  description: string;
  statistics: string;
}

export class AuthorResponse {
  constructor(id?: string, name?: string) {
    this.id = id;
    this.name = name;
  }
  id: string;
  name: string;
}

export class ProductImageResponse {
  url: string;
  default: boolean;
}

export class ShortProductResponseDto {
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
  id: string;
  name: string;
}
