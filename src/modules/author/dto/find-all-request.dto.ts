import { PaginationDto } from '@common/dto/pagination';

type SortType = 'ASC' | 'DESC';
export class FindAllRequestDto extends PaginationDto {
  order: Record<string, SortType>;
}
