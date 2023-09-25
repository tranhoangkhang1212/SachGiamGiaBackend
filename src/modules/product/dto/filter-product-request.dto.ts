import { IsNotEmpty } from 'class-validator';

export class FilterProductRequestDto {
  @IsNotEmpty()
  slug: string;
}
