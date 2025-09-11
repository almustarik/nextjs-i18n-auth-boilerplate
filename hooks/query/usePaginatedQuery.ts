import { useQuery } from '@tanstack/react-query';
import type { PaginationParams } from '@/types/common';

export const usePaginatedQuery = <TData>(
  queryKey: any[],
  offset: number,
  limit: number,
  queryFn: (
    params: PaginationParams
  ) => Promise<{ data: TData; totalCount: number }>
) => {
  return useQuery<{ data: TData; totalCount: number }, Error>({
    queryKey: [...queryKey, { offset, limit }],
    queryFn: () => queryFn({ offset, limit }),
  });
};
