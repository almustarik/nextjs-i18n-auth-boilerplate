import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  UseMutationOptions,
  UseMutationResult,
  MutationFunction,
} from '@tanstack/react-query';

interface UseAppMutationOptions<TData, TError, TVariables, TContext>
  extends Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  > {
  mutationFn: MutationFunction<TData, TVariables>;
  queryKeyToInvalidate?: any[];
}

export function useAppMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseAppMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const queryClient = useQueryClient();
  const { queryKeyToInvalidate, onSuccess, ...restOptions } = options;

  return useMutation<TData, TError, TVariables, TContext>({
    onSuccess: (data, variables, context) => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }
      onSuccess?.(data, variables, context);
    },
    ...restOptions,
  });
}
