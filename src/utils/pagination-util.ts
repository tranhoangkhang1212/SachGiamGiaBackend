import { PaginationDto, PaginationQueryDto } from '@common/dto/pagination';
import { PaginationResponseDto } from '@common/dto/pagination-response.dto';

export const getSkipAndTake = (page: number, pageSize: number): PaginationQueryDto => {
  const skip = (page - 1) * pageSize;
  return {
    take: pageSize,
    skip: Number(skip),
  };
};
export const getPageResponse = <T extends object>(
  pagination: PaginationDto,
  count: number,
  rows: T[],
): PaginationResponseDto<T> => {
  const totalPage = Math.ceil(count / pagination.pageSize);
  return { count, page: pagination.page, rows, totalPage };
};
