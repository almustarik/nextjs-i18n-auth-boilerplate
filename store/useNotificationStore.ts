import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type NotificationFilter = "all" | "unread" | "read"
export type NotificationType = "info" | "success" | "warning" | "error"

// Notification view state
export const notificationFilterAtom = atomWithStorage<NotificationFilter>("notification-filter", "all")
export const notificationTypeFilterAtom = atom<NotificationType | "all">("all")

// Notification badge state (derived from React Query data)
export const unreadCountAtom = atom(0)

// Notification actions
export const setNotificationFilterAtom = atom(null, (get, set, filter: NotificationFilter) => {
  set(notificationFilterAtom, filter)
})

export const setNotificationTypeFilterAtom = atom(null, (get, set, type: NotificationType | "all") => {
  set(notificationTypeFilterAtom, type)
})

// Derived atom for filtered notifications (to be used with React Query data)
export const notificationFiltersAtom = atom((get) => ({
  filter: get(notificationFilterAtom),
  type: get(notificationTypeFilterAtom),
}))
