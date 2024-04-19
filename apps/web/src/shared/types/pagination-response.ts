export type PaginationResponse<T> = {
  count: number;
  next: string | null;
  previouse: string | null;
  results: T[];
};
