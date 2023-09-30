import { IsArray, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  images: string[];

  @IsUUID(undefined, { each: true })
  author: string;

  @IsUUID(undefined, { each: true })
  publisher: string;

  @IsUUID(undefined, { each: true })
  category: string;

  @IsUUID(undefined, { each: true })
  distributor: string;

  @IsNumber()
  price: number;

  @IsNumber()
  finalPrice: number;

  @IsNumber()
  saleOff: number;

  description: string;

  statistics: string;

  subId: string;
}

export class CreateMultipleProductsRequestDto {
  products: CreateProductDto[];
}
