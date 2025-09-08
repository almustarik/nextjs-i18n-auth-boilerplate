import { apiClient } from "@/lib/axios"
import type { ApiResult } from "@/types/common"
import type { Notification } from "@/types/entities"
import type { NotificationFilters } from "@/types/api"

export const notificationsApi = {
  getNotifications: async (filters?: NotificationFilters): Promise<Notification[]> => {
    const response = await apiClient.get<ApiResult<Notification[]>>("/notifications", { params: filters })
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to fetch notifications")
    }
    return response.data.data
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<ApiResult<Notification>>(`/notifications/${id}`)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to mark notification as read")
    }
    return response.data.data
  },
}
