"use client"

import type React from "react"
import { Navbar } from "@/components/nav/Navbar"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useUI } from "@/hooks/useUI"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarOpen } = useUI()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <main
            className="flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)]"
          >
            <div className="container py-6">{children}</div>
          </main>
        </div>
        </div>
    </AuthGuard>
  )
}
