'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useTranslations } from 'next-intl';
import {
  useTodos,
  useAddTodo,
  useUpdateTodo,
  useDeleteTodo,
} from '@/hooks/query/useTodos';
import { useEffect, useState } from 'react';
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
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
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

  const addTodoMutation = useAddTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodoMutation.mutate({
        title: newTodoTitle,
        completed: false,
        userId: 1, // Assuming a default user for now
      });
      setNewTodoTitle('');
    }
  };

  const handleToggleComplete = (todo: { id: number; completed: boolean }) => {
    updateTodoMutation.mutate({
      id: todo.id,
      completed: !todo.completed,
    });
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
      setPageAtomValue(Number(newParams._page));
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      updateUrlParams({ _page: page + 1, _limit: limit });
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      updateUrlParams({ _page: page - 1, _limit: limit });
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pageCount) {
      updateUrlParams({ _page: pageNumber, _limit: limit });
    }
  };

  const paginationPages = generatePaginationPages(page, pageCount);

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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTodo();
                }
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
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleComplete(todo)}
                      />
                      {editingTodo?.id === todo.id ? (
                        <Input
                          value={editingTodo!.title}
                          onChange={(e) =>
                            setEditingTodo({
                              ...editingTodo!,
                              title: e.target.value,
                            })
                          }
                          onBlur={handleUpdateTodo}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateTodo();
                            }
                          }}
                          className="text-lg font-medium"
                        />
                      ) : (
                        <span
                          className={`text-lg font-medium ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
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
      <Toaster />
    </AppShell>
  );
}
