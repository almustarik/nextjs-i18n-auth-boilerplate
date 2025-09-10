import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { currentPageAtom, pageSizeAtom } from '@/store/useUiStore';
import type { PaginationParams } from '@/types/common';

export const usePaginatedQuery = <TData>(
  queryKey: any[],
  queryFn: (
    params: PaginationParams
  ) => Promise<{ data: TData; totalCount: number }>
) => {
  const [page] = useAtom(currentPageAtom);
  const [limit] = useAtom(pageSizeAtom);

  return useQuery<{ data: TData; totalCount: number }, Error>({
    queryKey: [...queryKey, { page, limit }],
    queryFn: () => queryFn({ page, limit }),
  });
};
