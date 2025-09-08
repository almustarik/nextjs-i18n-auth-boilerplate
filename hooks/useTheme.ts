"use client"

import { useAtom, useAtomValue } from "jotai"
import { themeAtom, resolvedThemeAtom, setThemeAtom, type Theme } from "@/store/useThemeStore"

export function useTheme() {
  const theme = useAtomValue(themeAtom)
  const resolvedTheme = useAtomValue(resolvedThemeAtom)
  const [, setTheme] = useAtom(setThemeAtom)

  return {
    theme,
    resolvedTheme,
    setTheme,
    themes: ["light", "dark", "system"] as Theme[],
  }
}
