import { IsNotEmpty } from 'class-validator';
import { FilterListProductRequestDto } from './sidebar-search-request.dto';
import { EProductSort } from 'src/constant/enum/product-enum';
import { PaginationDto } from '@common/dto/pagination';

export class FilterProductRequestDto {
  @IsNotEmpty()
  slug: string;
}

export class SearchProductRequestDto extends PaginationDto {
  @IsNotEmpty()
  keyword: string;
  filters: FilterListProductRequestDto[] = [];
  sort: EProductSort;
}

export class FilterProductList {
  authors: string[];
  categories: string[];
  distributors: string[];
  publishers: string[];
  products: string[];
}
