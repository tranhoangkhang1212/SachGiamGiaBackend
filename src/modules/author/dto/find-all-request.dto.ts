import { PaginationRequestDto } from '@common/dto/pagination';

type SortType = 'ASC' | 'DESC';
export class FindAllRequestDto extends PaginationRequestDto {
  order: Record<string, SortType>;
}
