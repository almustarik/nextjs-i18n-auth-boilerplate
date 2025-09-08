import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "@/lib/auth"
import { mockProfiles } from "@/mocks/data/profile"
import type { ApiResult } from "@/types/common"
import type { UpdateProfileRequest } from "@/types/api"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return NextResponse.json<ApiResult<null>>({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const profile = mockProfiles.find((p) => p.userId === session.user.id)

    if (!profile) {
      return NextResponse.json<ApiResult<null>>({ success: false, error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json<ApiResult<typeof profile>>({ success: true, data: profile })
  } catch (error) {
    return NextResponse.json<ApiResult<null>>({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return NextResponse.json<ApiResult<null>>({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body: UpdateProfileRequest = await request.json()
    const profileIndex = mockProfiles.findIndex((p) => p.userId === session.user.id)

    if (profileIndex === -1) {
      return NextResponse.json<ApiResult<null>>({ success: false, error: "Profile not found" }, { status: 404 })
    }

    const updatedProfile = {
      ...mockProfiles[profileIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    mockProfiles[profileIndex] = updatedProfile

    return NextResponse.json<ApiResult<typeof updatedProfile>>({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    return NextResponse.json<ApiResult<null>>({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
