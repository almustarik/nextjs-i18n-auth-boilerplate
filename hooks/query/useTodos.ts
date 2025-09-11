import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePaginatedQuery } from './usePaginatedQuery';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api/todos';
import type { Todo } from '@/types/entities';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_PAGINATION_LIMIT } from '@/lib/constants';

export const TODO_QUERY_KEY = 'todos';

// Define the return type of useTodos
interface UseTodosResult {
  data: Todo[] | undefined;
  totalCount: number;
  offset: number;
  limit: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  isFetching: boolean;
}

export const useTodos = (params?: {
  userId?: number;
  filters?: Record<string, any>;
}): UseTodosResult => {
  const searchParams = useSearchParams();
  const offsetParam = searchParams.get('offset');
  const initialOffset = offsetParam ? parseInt(offsetParam, 10) : 0;

  const limitParam = searchParams.get('limit');
  const limit = limitParam
    ? parseInt(limitParam, 10)
    : DEFAULT_PAGINATION_LIMIT;

  const { data, ...queryResult } = usePaginatedQuery<Todo[]>(
    [TODO_QUERY_KEY, 'list', params],
    initialOffset,
    limit,
    ({ offset: o, limit: l }) =>
      getTodos({ ...params, offset: o, limit: l, filters: params?.filters })
  );

  const totalCount = data?.totalCount ?? 0;
  const pageCount = Math.ceil(totalCount / limit);
  const hasNextPage = initialOffset + limit < totalCount;
  const hasPreviousPage = initialOffset > 0;

  return {
    data: data?.data,
    totalCount,
    offset: initialOffset,
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
