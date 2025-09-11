'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useTodos } from '@/hooks/query/useTodos';
// import { setPageAtom } from '@/store/useUiStore';
// import { useAtom } from 'jotai';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const generatePaginationPages = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = [];
  const maxPagesToShow = 5; // Number of pages to show around the current page

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
  }

  return pages;
};

export default function PublicTodosPage() {
  const t = useTranslations('publicTodos');

  const searchParams = useSearchParams();
  const router = useRouter();
  // const [, setPageAtomValue] = useAtom(setPageAtom);

  const currentFilters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== 'offset' && key !== 'limit') {
      // Exclude offset and limit
      currentFilters[key] = value;
    }
  });

  const {
    data: todos,
    offset,
    limit,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isFetching,
  } = useTodos({ filters: currentFilters });

  // Derive page from offset and limit for pagination UI
  const currentPage = Math.floor(offset / limit) + 1;

  useEffect(() => {
    const offsetParam = searchParams.get('offset');
    const limitParam = searchParams.get('limit');
    if (!offsetParam || !limitParam) {
      // Check if either is missing
      const params = new URLSearchParams(searchParams.toString());
      if (!offsetParam) {
        params.set('offset', '0');
      }
      if (!limitParam) {
        params.set('limit', limit.toString());
      }
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router, limit]);

  const updateUrlParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    // Always include the current limit in the URL
    params.set('limit', limit.toString());

    for (const key in newParams) {
      if (Object.prototype.hasOwnProperty.call(newParams, key)) {
        params.set(key, newParams[key].toString());
      }
    }
    router.push(`?${params.toString()}`);
    // if (newParams._page) {
    //   setPageAtomValue(Number(newParams._page));
    // }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      updateUrlParams({ offset: offset + limit, limit: limit });
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      updateUrlParams({ offset: offset - limit, limit: limit });
    }
  };

  const goToPage = (pageNumber: number) => {
    const newOffset = (pageNumber - 1) * limit;
    if (newOffset >= 0 && pageNumber <= pageCount) {
      updateUrlParams({ offset: newOffset, limit: limit });
    }
  };

  const paginationPages = generatePaginationPages(currentPage, pageCount);

  return (
    <div className="container space-y-6 py-6">
      <div>
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('yourTodos')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isFetching ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          ) : todos && todos.length > 0 ? (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="bg-muted/50 flex items-center justify-between rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={todo.completed}
                      disabled // Public todos are read-only
                    />
                    <span
                      className={`text-lg font-medium ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
                    >
                      {todo.title}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center">{t('noTodos')}</p>
          )}
        </CardContent>
      </Card>

      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {paginationPages.map((p, index) => (
              <PaginationItem key={index}>
                {typeof p === 'number' ? (
                  <PaginationLink
                    onClick={() => goToPage(p)}
                    isActive={currentPage === p}
                  >
                    {p}
                  </PaginationLink>
                ) : (
                  <span className="px-4 py-2 text-sm font-medium">{p}</span>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={goToNextPage}
                disabled={currentPage === pageCount}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
