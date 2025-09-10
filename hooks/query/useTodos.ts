import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePaginatedQuery } from './usePaginatedQuery';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api/todos';
import type { Todo } from '@/types/entities';
import { useToast } from '@/components/ui/use-toast';
import { useAtom } from 'jotai';
import { pageSizeAtom } from '@/store/useUiStore';
import { useSearchParams } from 'next/navigation';

export const TODO_QUERY_KEY = 'todos';

// Define the return type of useTodos
interface UseTodosResult {
  data: Todo[] | undefined;
  totalCount: number;
  page: number;
  limit: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  isFetching: boolean;
  // Add other properties from queryResult if needed
}

export const useTodos = (params?: {
  userId?: number;
  filters?: Record<string, any>;
}): UseTodosResult => {
  const searchParams = useSearchParams();
  const _pageParam = searchParams.get('_page'); // Changed to _page
  const initialPage = _pageParam ? parseInt(_pageParam, 10) : 1; // Changed to _pageParam

  const defaultLimit = useAtom(pageSizeAtom)[0]; // Get default limit from atom
  const _limitParam = searchParams.get('_limit'); // Changed to _limit
  const limit = _limitParam ? parseInt(_limitParam, 10) : defaultLimit; // Changed to _limitParam

  const { data, ...queryResult } = usePaginatedQuery<Todo[]>(
    [TODO_QUERY_KEY, 'list', params],
    initialPage,
    limit,
    ({ page: p, limit: l }) =>
      getTodos({ ...params, page: p, limit: l, filters: params?.filters })
  );

  const totalCount = data?.totalCount ?? 0;
  const pageCount = Math.ceil(totalCount / limit);
  const hasNextPage = initialPage < pageCount;
  const hasPreviousPage = initialPage > 1;

  return {
    data: data?.data,
    totalCount,
    page: initialPage,
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
