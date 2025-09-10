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

  const {
    data: todos,
    page,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isFetching,
  } = useTodos();

  const [, setPageAtomValue] = useAtom(setPageAtom);
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrlPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
    setPageAtomValue(newPage);
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      updateUrlPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      updateUrlPage(page - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pageCount) {
      updateUrlPage(pageNumber);
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
