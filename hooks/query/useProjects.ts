"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { projectsApi } from "@/lib/api/projects"
import type { CreateProjectRequest, PaginationParams } from "@/types/api"
import type { Project } from "@/types/entities"

export function useProjects(params?: PaginationParams) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectsApi.getProjects(params),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.createProject(data),
    onMutate: async (newProject) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["projects"] })

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(["projects"])

      // Optimistically update
      queryClient.setQueryData(["projects"], (old: any) => {
        if (!old) return old

        const optimisticProject: Project = {
          id: `temp-${Date.now()}`,
          ...newProject,
          status: "active",
          userId: "user-1", // Will be replaced by server
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return {
          ...old,
          data: [optimisticProject, ...old.data],
          total: old.total + 1,
        }
      })

      return { previousProjects }
    },
    onError: (err, newProject, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(["projects"], context.previousProjects)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
