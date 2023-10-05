import { PaginationDto } from '@common/dto/pagination';
import { IsNotEmpty } from 'class-validator';
import { EProductSort } from 'src/constant/enum/product-enum';
import { ProductFilter } from 'src/constant/enum/product-filter';

export class FilterListProductRequestDto {
  type: ProductFilter;
  values: string[];
}

export class SearchRequestDto extends PaginationDto {
  @IsNotEmpty()
  slug: string;
  filters: FilterListProductRequestDto[] = [];
  sort: EProductSort;
}
