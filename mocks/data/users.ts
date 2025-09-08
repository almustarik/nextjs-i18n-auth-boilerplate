import type { User } from "@/types/entities"

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "demo@example.com",
    name: "Demo User",
    role: "user",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    email: "admin@example.com",
    name: "Demo Admin",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]
