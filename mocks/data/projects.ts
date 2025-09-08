import type { Project } from "@/types/entities"

export const mockProjects: Project[] = [
  {
    id: "project-1",
    title: "E-commerce Platform",
    description: "A modern e-commerce platform built with Next.js and TypeScript",
    status: "active",
    userId: "user-1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "project-2",
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates",
    status: "completed",
    userId: "user-1",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-25T16:45:00Z",
  },
  {
    id: "project-3",
    title: "Analytics Dashboard",
    description: "A comprehensive analytics dashboard for business intelligence",
    status: "active",
    userId: "user-2",
    createdAt: "2024-01-20T11:15:00Z",
    updatedAt: "2024-01-22T13:20:00Z",
  },
  {
    id: "project-4",
    title: "Mobile App Backend",
    description: "RESTful API backend for a mobile application",
    status: "archived",
    userId: "user-1",
    createdAt: "2024-01-05T08:30:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
]
