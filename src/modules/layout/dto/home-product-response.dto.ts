import { ProductResponseDto } from '@module/product/dto/products-response';

export class HomeProductsResponseDto {
  name: string;
  products: ProductResponseDto[];
}
