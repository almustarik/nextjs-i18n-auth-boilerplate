import { http, HttpResponse } from "msw"
import { mockProfiles } from "./data/profile"
import { mockProjects } from "./data/projects"
import { mockNotifications } from "./data/notifications"
import type { ApiResult, Paginated } from "@/types/common"
import type { CreateProjectRequest, UpdateProfileRequest } from "@/types/api"

export const handlers = [
  // Profile endpoints
  http.get("/api/profile", ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId") || "user-1"

    const profile = mockProfiles.find((p) => p.userId === userId)

    if (!profile) {
      return HttpResponse.json<ApiResult<null>>({ success: false, error: "Profile not found" }, { status: 404 })
    }

    return HttpResponse.json<ApiResult<typeof profile>>({ success: true, data: profile })
  }),

  http.put("/api/profile", async ({ request }) => {
    const body = (await request.json()) as UpdateProfileRequest
    const userId = "user-1" // In real app, get from auth

    const profileIndex = mockProfiles.findIndex((p) => p.userId === userId)

    if (profileIndex === -1) {
      return HttpResponse.json<ApiResult<null>>({ success: false, error: "Profile not found" }, { status: 404 })
    }

    const updatedProfile = {
      ...mockProfiles[profileIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    mockProfiles[profileIndex] = updatedProfile

    return HttpResponse.json<ApiResult<typeof updatedProfile>>({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
    })
  }),

  // Projects endpoints
  http.get("/api/projects", ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const userId = url.searchParams.get("userId") || "user-1"

    const userProjects = mockProjects.filter((p) => p.userId === userId)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProjects = userProjects.slice(startIndex, endIndex)

    const result: Paginated<(typeof paginatedProjects)[0]> = {
      data: paginatedProjects,
      total: userProjects.length,
      page,
      limit,
      totalPages: Math.ceil(userProjects.length / limit),
    }

    return HttpResponse.json<ApiResult<typeof result>>({ success: true, data: result })
  }),

  http.post("/api/projects", async ({ request }) => {
    const body = (await request.json()) as CreateProjectRequest
    const userId = "user-1" // In real app, get from auth

    const newProject = {
      id: `project-${Date.now()}`,
      ...body,
      status: "active" as const,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockProjects.push(newProject)

    return HttpResponse.json<ApiResult<typeof newProject>>(
      {
        success: true,
        data: newProject,
        message: "Project created successfully",
      },
      { status: 201 },
    )
  }),

  // Notifications endpoints
  http.get("/api/notifications", ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId") || "user-1"
    const read = url.searchParams.get("read")
    const type = url.searchParams.get("type")

    let userNotifications = mockNotifications.filter((n) => n.userId === userId)

    if (read !== null) {
      userNotifications = userNotifications.filter((n) => n.read === (read === "true"))
    }

    if (type && type !== "all") {
      userNotifications = userNotifications.filter((n) => n.type === type)
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return HttpResponse.json<ApiResult<typeof userNotifications>>({ success: true, data: userNotifications })
  }),

  http.patch("/api/notifications/:id", async ({ params }) => {
    const { id } = params
    const notificationIndex = mockNotifications.findIndex((n) => n.id === id)

    if (notificationIndex === -1) {
      return HttpResponse.json<ApiResult<null>>({ success: false, error: "Notification not found" }, { status: 404 })
    }

    const updatedNotification = {
      ...mockNotifications[notificationIndex],
      read: true,
      updatedAt: new Date().toISOString(),
    }

    mockNotifications[notificationIndex] = updatedNotification

    return HttpResponse.json<ApiResult<typeof updatedNotification>>({
      success: true,
      data: updatedNotification,
      message: "Notification marked as read",
    })
  }),
]
