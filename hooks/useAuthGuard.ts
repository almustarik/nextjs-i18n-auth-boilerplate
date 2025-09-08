"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuthGuard(redirectTo = "/sign-in") {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push(redirectTo)
    }
  }, [session, status, router, redirectTo])

  return {
    session,
    isLoading: status === "loading",
    isAuthenticated: !!session,
  }
}
