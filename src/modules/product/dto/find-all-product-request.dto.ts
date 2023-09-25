import { FindAllRequestDto } from '@module/author/dto/find-all-request.dto';
import { EFilterData } from 'src/constant/enum/filter-data';

export class GetProductOptionRequestDto {
  type: EFilterData;
  values: [];
}

export class FindAllProductRequestDto extends FindAllRequestDto {
  ids?: string[];
  name?: string;
  options: GetProductOptionRequestDto[];
}
