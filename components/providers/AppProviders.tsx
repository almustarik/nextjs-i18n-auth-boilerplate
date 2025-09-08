"use client"

import type { ReactNode } from "react"
import { JotaiProvider } from "./JotaiProvider"
import { QueryProvider } from "@/lib/queryClient"
import { ThemeProvider } from "./ThemeProvider"
import { AuthProvider } from "@/components/auth/AuthProvider"

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <JotaiProvider>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </JotaiProvider>
  )
}
