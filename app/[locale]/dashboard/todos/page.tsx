'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Toaster } from '@/components/ui/toaster';
import {
  useAddTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from '@/hooks/query/useTodos';
import { setPageAtom } from '@/store/useUiStore';
import { useAtom } from 'jotai';
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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

export default function TodosPage() {
  const t = useTranslations('todos');

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodo, setEditingTodo] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [, setPageAtomValue] = useAtom(setPageAtom);

  // Parse offset/limit with safe defaults
  const urlOffset = useMemo(() => {
    const v = Number(searchParams.get('offset'));
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }, [searchParams]);

  const urlLimit = useMemo(() => {
    const v = Number(searchParams.get('limit'));
    return Number.isFinite(v) && v > 0 ? v : 10;
  }, [searchParams]);

  // Memoize filters (exclude offset/limit)
  const currentFilters = useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'offset' && key !== 'limit') obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  // Hook uses the same contract as PublicTodosPage
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

  // Derive current page from effective offset/limit
  const currentPage = useMemo(() => {
    const effLimit = Math.max(1, limit || urlLimit);
    return Math.floor((offset || urlOffset) / effLimit) + 1;
  }, [offset, urlOffset, limit, urlLimit]);

  // Normalize URL so both offset & limit are present
  useEffect(() => {
    const p = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (!p.get('offset')) {
      p.set('offset', String(urlOffset));
      changed = true;
    }
    if (!p.get('limit')) {
      p.set('limit', String(limit || urlLimit));
      changed = true;
    }

    if (changed) router.replace(`?${p.toString()}`);
  }, [searchParams, router, urlOffset, urlLimit, limit]);

  const effectiveLimit = limit || urlLimit;
  const effectiveOffset = offset || urlOffset;

  // Mutations
  const addTodoMutation = useAddTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodoMutation.mutate({
        title: newTodoTitle,
        completed: false,
        userId: 1,
      });
      setNewTodoTitle('');
    }
  };

  const handleToggleComplete = (todo: { id: number; completed: boolean }) => {
    updateTodoMutation.mutate({ id: todo.id, completed: !todo.completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  const handleEditClick = (todo: { id: number; title: string }) => {
    setEditingTodo(todo);
  };

  const handleUpdateTodo = () => {
    if (editingTodo && editingTodo.title.trim()) {
      updateTodoMutation.mutate({
        id: editingTodo.id,
        title: editingTodo.title,
      });
      setEditingTodo(null);
    }
  };

  // URL helpers (mirror PublicTodosPage)
  const updateUrlParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', String(effectiveLimit));

    for (const key in newParams) {
      params.set(key, String(newParams[key]));
    }
    router.push(`?${params.toString()}`);

    // keep your existing atom behavior if you rely on page elsewhere
    if (Object.prototype.hasOwnProperty.call(newParams, 'offset')) {
      const newOffset = Number(newParams.offset);
      const newPage = Math.floor(newOffset / effectiveLimit) + 1;
      setPageAtomValue(newPage);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      updateUrlParams({ offset: effectiveOffset + effectiveLimit });
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      updateUrlParams({ offset: effectiveOffset - effectiveLimit });
    }
  };

  const goToPage = (pageNumber: number) => {
    const total = Math.max(1, pageCount || 1);
    const clamped = Math.min(Math.max(1, pageNumber), total);
    const newOffset = (clamped - 1) * effectiveLimit;
    updateUrlParams({ offset: newOffset });
  };

  const paginationPages = useMemo(
    () => generatePaginationPages(currentPage, Math.max(1, pageCount || 1)),
    [currentPage, pageCount]
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-primary text-3xl font-bold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('addTodo')}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder={t('todoPlaceholder')}
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTodo();
              }}
            />
            <Button
              onClick={handleAddTodo}
              disabled={addTodoMutation.isPending}
            >
              {addTodoMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {t('add')}
            </Button>
          </CardContent>
        </Card>

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
                        checked={!!todo.completed}
                        onCheckedChange={() => handleToggleComplete(todo)}
                      />
                      {editingTodo?.id === todo.id ? (
                        <Input
                          value={editingTodo.title}
                          onChange={(e) =>
                            setEditingTodo({
                              ...editingTodo,
                              title: e.target.value,
                            })
                          }
                          onBlur={handleUpdateTodo}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateTodo();
                          }}
                          className="text-lg font-medium"
                        />
                      ) : (
                        <span
                          className={`text-lg font-medium ${
                            todo.completed
                              ? 'text-muted-foreground line-through'
                              : ''
                          }`}
                        >
                          {todo.title}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {editingTodo?.id !== todo.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(todo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">
                {t('noTodos')}
              </p>
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

              {paginationPages.map((p, i) => (
                <PaginationItem key={`${p}-${i}`}>
                  {typeof p === 'number' ? (
                    <PaginationLink
                      onClick={() => goToPage(p)}
                      isActive={currentPage === p}
                    >
                      {p}
                    </PaginationLink>
                  ) : (
                    <span className="px-4 py-2 text-sm font-medium select-none">
                      …
                    </span>
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
      <Toaster />
    </AppShell>
  );
}
