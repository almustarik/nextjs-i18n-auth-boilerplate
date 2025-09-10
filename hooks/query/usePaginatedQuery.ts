import { useQuery } from '@tanstack/react-query';
import type { PaginationParams } from '@/types/common';

export const usePaginatedQuery = <TData>(
  queryKey: any[],
  page: number,
  limit: number,
  queryFn: (
    params: PaginationParams
  ) => Promise<{ data: TData; totalCount: number }>
) => {
  return useQuery<{ data: TData; totalCount: number }, Error>({
    queryKey: [...queryKey, { page, limit }],
    queryFn: () => queryFn({ page, limit }),
  });
};
