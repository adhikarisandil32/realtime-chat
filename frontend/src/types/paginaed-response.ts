export interface IPagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface IPaginatedResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T[];
  pagination: IPagination;
}
