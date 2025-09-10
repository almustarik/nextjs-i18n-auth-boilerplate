export interface CreateProjectRequest {
  title: string;
  description: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  timezone: string;
  language: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface NotificationFilters {
  type?: string;
  read?: boolean;
}
