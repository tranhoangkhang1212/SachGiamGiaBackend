import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateHomeProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;

  @IsArray()
  productsShow: string[] = [];

  @IsArray()
  category: string[] = [];

  @IsArray()
  products: string[] = [];

  @IsArray()
  authors: string[] = [];

  @IsArray()
  publishers: string[] = [];

  @IsArray()
  distributors: string[] = [];
}
