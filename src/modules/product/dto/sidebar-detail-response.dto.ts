import { PaginationResponseDto } from '@common/dto/pagination-response.dto';
import { ProductFilter } from 'src/constant/enum/product-filter';

export class SidebarDetailResponseDto<T> {
  product: PaginationResponseDto<T>;
  filters: ProductFilterData[];
}

export class ProductFilterData {
  title: string;
  type: ProductFilter;
  values: ProductFilterValue[];
}

export class ProductFilterValue {
  id: string;
  name: string;
}
