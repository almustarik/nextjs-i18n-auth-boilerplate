import { apiClient } from "@/lib/axios"
import type { ApiResult } from "@/types/common"
import type { Profile } from "@/types/entities"
import type { UpdateProfileRequest } from "@/types/api"

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<ApiResult<Profile>>("/profile")
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to fetch profile")
    }
    return response.data.data
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const response = await apiClient.put<ApiResult<Profile>>("/profile", data)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Failed to update profile")
    }
    return response.data.data
  },
}
