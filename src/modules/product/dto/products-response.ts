import { Product } from '../entities/product.entity';

export class ProductResponseDto {
  count: number;
  products: ProductDetailResponseDto[];
}

export class ProductDetailResponseDto {
  constructor(product?: Product) {
    this.id = product?.id;
    this.name = product?.name;
    this.slug = product?.slug;
    this.image = product?.image;
    this.author = new ProductInfo(product?.author?.id, product?.author?.name);
    this.publisher = new ProductInfo(product?.publisher?.id, product?.publisher?.name);
    this.category = new ProductInfo(product?.category?.id, product?.category?.name);
    this.distributor = new ProductInfo(product?.distributor?.id, product?.distributor?.name);
    this.price = product?.price;
    this.finalPrice = product?.finalPrice;
    this.saleOff = product?.saleOff;
    this.totalView = product?.totalView;
    this.totalBuy = product?.totalBuy;
    this.star = product?.star;
    this.description = product?.description;
  }

  id: string;
  name: string;
  slug: string;
  image: string;
  author: ProductInfo;
  publisher: ProductInfo;
  category: ProductInfo;
  distributor: ProductInfo;
  price: number;
  finalPrice: number;
  saleOff: number;
  totalView: number;
  totalBuy: number;
  star: number;
  description: string;
}

export class ProductInfo {
  constructor(id?: string, name?: string) {
    this.id = id;
    this.name = name;
  }
  id: string;
  name: string;
}
