import type { Notification } from "@/types/entities"

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Welcome to the platform!",
    message: "Thank you for joining our platform. Get started by creating your first project.",
    type: "info",
    read: false,
    userId: "user-1",
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "notif-2",
    title: "Project completed",
    message: "Your project 'Task Management App' has been marked as completed.",
    type: "success",
    read: true,
    userId: "user-1",
    createdAt: "2024-01-24T15:30:00Z",
    updatedAt: "2024-01-24T16:00:00Z",
  },
  {
    id: "notif-3",
    title: "System maintenance",
    message: "Scheduled maintenance will occur tonight from 2 AM to 4 AM EST.",
    type: "warning",
    read: false,
    userId: "user-1",
    createdAt: "2024-01-23T12:00:00Z",
    updatedAt: "2024-01-23T12:00:00Z",
  },
  {
    id: "notif-4",
    title: "New feature available",
    message: "Check out our new analytics dashboard feature in the projects section.",
    type: "info",
    read: false,
    userId: "user-2",
    createdAt: "2024-01-22T09:15:00Z",
    updatedAt: "2024-01-22T09:15:00Z",
  },
]
