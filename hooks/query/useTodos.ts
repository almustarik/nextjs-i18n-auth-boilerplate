import { useToast } from '@/components/ui/use-toast';
import { createTodo, deleteTodo, getTodos, updateTodo } from '@/lib/api/todos';
import { DEFAULT_PAGINATION_LIMIT } from '@/lib/constants';
import type { Todo } from '@/types/entities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePaginatedQuery } from './usePaginatedQuery';

export const TODO_QUERY_KEY = 'todos';

export function useTodos(params?: {
  userId?: number;
  filters?: Record<string, any>;
}) {
  const { data, totalCount, isLoading, isFetching, effectiveParams } =
    usePaginatedQuery<Todo[]>(
      [TODO_QUERY_KEY, 'list', params],
      0,
      DEFAULT_PAGINATION_LIMIT,
      (p) => getTodos({ ...params, ...p, filters: params?.filters }),
      {
        syncFromUrl: true,
        whitelistKeys: [
          'offset',
          'limit',
          'search',
          'sort',
          'status',
          'something',
        ],
        staleTime: 30_000,
      }
    );

  const offset = Number(effectiveParams.offset) || 0;
  const limit = Number(effectiveParams.limit) || DEFAULT_PAGINATION_LIMIT;

  const pageCount = limit > 0 ? Math.ceil(totalCount / limit) : 0;
  const hasNextPage = offset + limit < totalCount;
  const hasPreviousPage = offset > 0;

  return {
    data,
    totalCount,
    offset,
    limit,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isFetching,
  };
}

export const useAddTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, Error, Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>(
    {
      mutationFn: createTodo,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
        toast({ title: 'Success', description: 'Todo added successfully.' });
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
      toast({ title: 'Success', description: 'Todo updated successfully.' });
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
      toast({ title: 'Success', description: 'Todo deleted successfully.' });
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
