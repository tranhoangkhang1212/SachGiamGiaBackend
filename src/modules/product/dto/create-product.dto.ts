import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  image: string;

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

  subId: string;
}
