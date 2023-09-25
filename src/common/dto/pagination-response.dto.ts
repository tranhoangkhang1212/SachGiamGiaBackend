export class PaginationResponseDto<T> {
  rows: T[];
  page: number;
  count: number;
  totalPage: number;
}
