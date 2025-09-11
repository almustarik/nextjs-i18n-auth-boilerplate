import { apiClient } from '@/lib/axios';
import type { PaginationParams } from '@/types/common';
import type { Todo } from '@/types/entities';

const TODO_API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const getTodos = async (
  params: (PaginationParams & Record<string, any>) | undefined
): Promise<{ data: Todo[]; totalCount: number }> => {
  const { filters, ...rest } = params || {};

  const requestParams: Record<string, any> = {
    ...rest,
    ...(filters ?? {}),
  };

  const response = await apiClient.get<Todo[]>(TODO_API_URL, {
    params: requestParams,
  });

  const totalCount = Number(response.headers['x-total-count'] || 0);
  return { data: response.data, totalCount };
};

export const getTodo = async (id: number): Promise<Todo> => {
  const response = await apiClient.get<Todo>(`${TODO_API_URL}/${id}`);
  return response.data;
};

export const createTodo = async (data: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await apiClient.post<Todo>(TODO_API_URL, data);
  return response.data;
};

export const updateTodo = async (
  id: number,
  data: Partial<Todo>
): Promise<Todo> => {
  const response = await apiClient.put<Todo>(`${TODO_API_URL}/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await apiClient.delete(`${TODO_API_URL}/${id}`);
};
