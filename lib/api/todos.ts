import { apiClient } from '@/lib/axios';
import type { Todo } from '@/types/entities';

import type { PaginationParams } from '@/types/common';

const TODO_API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const getTodos = async ({
  page = 1,
  limit = 10,
  filters,
}: PaginationParams & { filters?: Record<string, any> }): Promise<{
  data: Todo[];
  totalCount: number;
}> => {
  const params: Record<string, any> = {
    _page: page,
    _limit: limit,
  };

  if (filters) {
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        params[key] = filters[key];
      }
    }
  }

  const response = await apiClient.get<Todo[]>(TODO_API_URL, {
    params,
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
