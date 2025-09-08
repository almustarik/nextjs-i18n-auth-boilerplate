import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type Theme = "light" | "dark" | "system"

// Persisted theme atom
export const themeAtom = atomWithStorage<Theme>("theme", "system")

// Derived atom for resolved theme (handles system preference)
export const resolvedThemeAtom = atom((get) => {
  const theme = get(themeAtom)

  if (theme === "system") {
    // Check system preference
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  }

  return theme
})

// Theme actions
export const setThemeAtom = atom(null, (get, set, newTheme: Theme) => {
  set(themeAtom, newTheme)

  // Apply theme to document
  if (typeof window !== "undefined") {
    const root = window.document.documentElement
    const resolvedTheme =
      newTheme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : newTheme

    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
  }
})
