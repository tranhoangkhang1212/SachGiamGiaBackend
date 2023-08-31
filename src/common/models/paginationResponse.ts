export class PaginationResponse {
  constructor(
    public readonly total: number,
    public readonly totalPages: number,
    public readonly currentPage: number,
    public readonly itemsPerPage: number,
  ) {}
}
