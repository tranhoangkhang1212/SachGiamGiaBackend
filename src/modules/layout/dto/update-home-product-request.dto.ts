import { IsArray } from 'class-validator';

export class UpdateHomeProductShowRequestDto {
  @IsArray()
  products: string[];
}
