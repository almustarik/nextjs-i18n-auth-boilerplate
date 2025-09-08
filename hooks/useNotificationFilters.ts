"use client"

import { useAtom, useAtomValue } from "jotai"
import {
  notificationFilterAtom,
  notificationTypeFilterAtom,
  notificationFiltersAtom,
  unreadCountAtom,
  setNotificationFilterAtom,
  setNotificationTypeFilterAtom,
} from "@/store/useNotificationStore"

export function useNotificationFilters() {
  const filter = useAtomValue(notificationFilterAtom)
  const typeFilter = useAtomValue(notificationTypeFilterAtom)
  const filters = useAtomValue(notificationFiltersAtom)
  const unreadCount = useAtomValue(unreadCountAtom)

  const [, setFilter] = useAtom(setNotificationFilterAtom)
  const [, setTypeFilter] = useAtom(setNotificationTypeFilterAtom)

  return {
    filter,
    typeFilter,
    filters,
    unreadCount,
    setFilter,
    setTypeFilter,
  }
}
