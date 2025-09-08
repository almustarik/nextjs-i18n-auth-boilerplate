import { apiClient } from "@/lib/axios"
import type { ApiResult, Paginated, PaginationParams } from "@/types/common"
import type { Project } from "@/types/entities"
import type { CreateProjectRequest } from "@/types/api"

export const projectsApi = {
  getProjects: async (params?: PaginationParams): Promise<Paginated<Project>> => {
    const response = await apiClient.get<ApiResult<Paginated<Project>>>("/projects", { params })
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to fetch projects")
    }
    return response.data.data
  },

  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<ApiResult<Project>>("/projects", data)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to create project")
    }
    return response.data.data
  },
}
