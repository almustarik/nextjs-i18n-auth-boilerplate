import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePaginatedQuery } from './usePaginatedQuery';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api/todos';
import type { Todo } from '@/types/entities';
import { useToast } from '@/components/ui/use-toast';
import { useAtom } from 'jotai';
import { currentPageAtom, pageSizeAtom, setPageAtom } from '@/store/useUiStore';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const TODO_QUERY_KEY = 'todos';

export const useTodos = (params?: { userId?: number }) => {
  const [page] = useAtom(currentPageAtom);
  const [limit] = useAtom(pageSizeAtom);
  const [, setPage] = useAtom(setPageAtom);
  const searchParams = useSearchParams();

  useEffect(() => {
    const pageParam = searchParams.get('page');
    const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
    if (initialPage !== page) {
      setPage(initialPage);
    }
  }, [searchParams, setPage, page]);

  const { data, ...queryResult } = usePaginatedQuery<Todo>(
    [TODO_QUERY_KEY, 'list', params, page, limit],
    ({ page: p, limit: l }) => getTodos({ ...params, page: p, limit: l })
  );

  const totalCount = data?.totalCount ?? 0;
  const pageCount = Math.ceil(totalCount / limit);
  const hasNextPage = page < pageCount;
  const hasPreviousPage = page > 1;

  return {
    data: data?.data,
    totalCount,
    page,
    limit,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    ...queryResult,
  };
};

export const useAddTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, Error, Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>(
    {
      mutationFn: createTodo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
        toast({
          title: 'Success',
          description: 'Todo added successfully.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to add todo.',
          variant: 'destructive',
        });
      },
    }
  );
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, Error, Partial<Todo> & { id: number }>({
    mutationFn: ({ id, ...data }) => updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
      toast({
        title: 'Success',
        description: 'Todo updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update todo.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, number>({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
      toast({
        title: 'Success',
        description: 'Todo deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete todo.',
        variant: 'destructive',
      });
    },
  });
};
