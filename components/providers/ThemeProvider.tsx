"use client"

import { useAtom, useAtomValue } from "jotai"
import { useEffect, type ReactNode } from "react"
import { resolvedThemeAtom, setThemeAtom, type Theme } from "@/store/useThemeStore"

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useAtom(setThemeAtom)
  const resolvedTheme = useAtomValue(resolvedThemeAtom)

  useEffect(() => {
    // Initialize theme on mount
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const currentTheme = localStorage.getItem("theme")
      if (currentTheme === "system" || !currentTheme) {
        const newTheme = mediaQuery.matches ? "dark" : "light"
        root.classList.remove("light", "dark")
        root.classList.add(newTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [resolvedTheme])

  return <>{children}</>
}
