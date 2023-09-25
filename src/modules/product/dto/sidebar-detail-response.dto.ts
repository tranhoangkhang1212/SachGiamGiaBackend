import { ProductFilter } from 'src/constant/enum/product-filter';
import { ProductDetailResponseDto } from './products-response';

export class SidebarDetailResponseDto {
  products: ProductDetailResponseDto[];
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
