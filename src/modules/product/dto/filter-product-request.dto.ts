import { IsNotEmpty } from 'class-validator';

export class FilterProductRequestDto {
  @IsNotEmpty()
  slug: string;
}

export class SearchProductRequestDto {
  keyword: string;
}
