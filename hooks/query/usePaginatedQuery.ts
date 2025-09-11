'use client';

import { createQueryParams } from '@/lib/utils';
import type { PaginationParams } from '@/types/common';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

type PaginatedResult<TData> = {
  data: TData | undefined;
  totalCount: number;
  isLoading: boolean;
  isFetching: boolean;
  effectiveParams: PaginationParams & Record<string, any>;
};

type ExtraOptions<TData> = Omit<
  UseQueryOptions<{ data: TData; totalCount: number }, Error>,
  'queryKey' | 'queryFn'
> & {
  syncFromUrl?: boolean;
  whitelistKeys?: string[];
};

export function usePaginatedQuery<TData>(
  queryKey: any[],
  baseOffset: number,
  baseLimit: number,
  queryFn: (
    params: PaginationParams & Record<string, any>
  ) => Promise<{ data: TData; totalCount: number }>,
  options: ExtraOptions<TData> = { syncFromUrl: false }
): PaginatedResult<TData> {
  const { syncFromUrl = false, whitelistKeys, ...queryOptions } = options;
  const searchParams = useSearchParams();

  const urlParamsObj = Object.fromEntries(searchParams.entries());
  const flattened = createQueryParams(urlParamsObj);

  const filteredFromUrl = whitelistKeys
    ? Object.fromEntries(
        Object.entries(flattened).filter(([k]) => whitelistKeys.includes(k))
      )
    : flattened;

  const mergedParams: PaginationParams & Record<string, any> = {
    offset: baseOffset,
    limit: baseLimit,
    ...(syncFromUrl ? filteredFromUrl : {}),
  };

  const effectiveKey = syncFromUrl
    ? [
        ...queryKey,
        { offset: mergedParams.offset, limit: mergedParams.limit },
        searchParams.toString(),
      ]
    : [...queryKey, { offset: mergedParams.offset, limit: mergedParams.limit }];

  const { data, isLoading, isFetching } = useQuery<
    { data: TData; totalCount: number },
    Error
  >({
    queryKey: effectiveKey,
    queryFn: () => queryFn(mergedParams),
    ...queryOptions,
  });

  return {
    data: data?.data,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isFetching,
    effectiveParams: mergedParams,
  };
}
