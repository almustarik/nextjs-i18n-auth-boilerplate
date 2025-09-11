export interface Paginated<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
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
  offset?: number;
  limit?: number;
}

export interface ApiResponseData<T> {
  count: number;
  data: T[];
}
