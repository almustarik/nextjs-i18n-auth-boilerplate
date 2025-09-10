export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type Locale = 'en' | 'fr' | 'es' | 'bn';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
