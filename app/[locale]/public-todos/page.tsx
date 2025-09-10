'use client';

import { useTranslations } from 'next-intl';
import { useTodos } from '@/hooks/query/useTodos';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';
import { Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useAtom } from 'jotai';
import { setPageAtom } from '@/store/useUiStore';
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
  const [, setPageAtomValue] = useAtom(setPageAtom);

  const currentFilters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== '_page' && key !== '_limit') {
      // Exclude _page and _limit
      currentFilters[key] = value;
    }
  });

  const {
    data: todos,
    page,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isFetching,
    limit, // Destructure limit here
  } = useTodos({ filters: currentFilters });

  useEffect(() => {
    const pageParam = searchParams.get('_page');
    const limitParam = searchParams.get('_limit'); // Get _limit from URL
    if (!pageParam || !limitParam) {
      // Check if either is missing
      const params = new URLSearchParams(searchParams.toString());
      if (!pageParam) {
        params.set('_page', '1');
      }
      if (!limitParam) {
        params.set('_limit', limit.toString()); // Set _limit using the 'limit' from useTodos
      }
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router, limit]); // Add 'limit' to dependency array

  const updateUrlParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    // Always include the current limit in the URL
    params.set('_limit', limit.toString());

    for (const key in newParams) {
      if (Object.prototype.hasOwnProperty.call(newParams, key)) {
        params.set(key, newParams[key].toString());
      }
    }
    router.push(`?${params.toString()}`);
    if (newParams._page) {
      // Changed to _page
      setPageAtomValue(Number(newParams._page)); // Changed to _page
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      updateUrlParams({ _page: page + 1, _limit: limit }); // Changed to _page
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      updateUrlParams({ _page: page - 1, _limit: limit }); // Changed to _page
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pageCount) {
      updateUrlParams({ _page: pageNumber, _limit: limit }); // Changed to _page
    }
  };

  const paginationPages = generatePaginationPages(page, pageCount);

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
                disabled={page === 1}
              />
            </PaginationItem>
            {paginationPages.map((p, index) => (
              <PaginationItem key={index}>
                {typeof p === 'number' ? (
                  <PaginationLink
                    onClick={() => goToPage(p)}
                    isActive={page === p}
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
                disabled={page === pageCount}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
