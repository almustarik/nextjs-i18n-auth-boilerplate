"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { profileApi } from "@/lib/api/profile"
import type { UpdateProfileRequest } from "@/types/api"

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile)
    },
  })
}
