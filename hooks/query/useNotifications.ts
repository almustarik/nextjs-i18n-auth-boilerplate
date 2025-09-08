"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { notificationsApi } from "@/lib/api/notifications"
import { unreadCountAtom } from "@/store/useNotificationStore"
import type { NotificationFilters } from "@/types/api"
import { useEffect } from "react"

export function useNotifications(filters?: NotificationFilters) {
  const [, setUnreadCount] = useAtom(unreadCountAtom)

  const query = useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => notificationsApi.getNotifications(filters),
  })

  // Update unread count when notifications change
  useEffect(() => {
    if (query.data) {
      const unreadCount = query.data.filter((n) => !n.read).length
      setUnreadCount(unreadCount)
    }
  }, [query.data, setUnreadCount])

  return query
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
