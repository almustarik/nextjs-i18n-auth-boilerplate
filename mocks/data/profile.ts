import type { Profile } from "@/types/entities"

export const mockProfiles: Profile[] = [
  {
    id: "profile-1",
    userId: "user-1",
    firstName: "Demo",
    lastName: "User",
    bio: "This is a demo user profile for testing purposes.",
    avatar: "/diverse-user-avatars.png",
    timezone: "America/New_York",
    language: "en",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "profile-2",
    userId: "user-2",
    firstName: "Demo",
    lastName: "Admin",
    bio: "This is a demo admin profile with elevated permissions.",
    avatar: "/admin-avatar.png",
    timezone: "America/Los_Angeles",
    language: "en",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]
