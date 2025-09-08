import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "@/lib/auth"
import { mockNotifications } from "@/mocks/data/notifications"
import type { ApiResult } from "@/types/common"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession()

    if (!session?.user) {
      return NextResponse.json<ApiResult<null>>({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const read = searchParams.get("read")
    const type = searchParams.get("type")

    let userNotifications = mockNotifications.filter((n) => n.userId === session.user.id)

    if (read !== null) {
      userNotifications = userNotifications.filter((n) => n.read === (read === "true"))
    }

    if (type && type !== "all") {
      userNotifications = userNotifications.filter((n) => n.type === type)
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json<ApiResult<typeof userNotifications>>({ success: true, data: userNotifications })
  } catch (error) {
    return NextResponse.json<ApiResult<null>>({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
