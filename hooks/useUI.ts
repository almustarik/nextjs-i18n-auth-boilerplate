"use client"

import { useAtom, useAtomValue } from "jotai"
import {
  mobileMenuOpenAtom,
  searchOpenAtom,
  toggleMobileMenuAtom,
  toggleSearchAtom,
  closeAllOverlaysAtom,
} from "@/store/useUiStore"

export function useUI() {
  const mobileMenuOpen = useAtomValue(mobileMenuOpenAtom)
  const searchOpen = useAtomValue(searchOpenAtom)

  const [, toggleMobileMenu] = useAtom(toggleMobileMenuAtom)
  const [, toggleSearch] = useAtom(toggleSearchAtom)
  const [, closeAllOverlays] = useAtom(closeAllOverlaysAtom)

  return {
    mobileMenuOpen,
    searchOpen,
    toggleMobileMenu,
    toggleSearch,
    closeAllOverlays,
  }
}