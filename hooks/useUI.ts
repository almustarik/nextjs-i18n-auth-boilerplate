'use client';

import { useAtom, useAtomValue } from 'jotai';
import {
  mobileMenuOpenAtom,
  searchOpenAtom,
  setMobileMenuOpenAtom,
  setSearchOpenAtom,
  toggleMobileMenuAtom,
  toggleSearchAtom,
  closeAllOverlaysAtom,
} from '@/store/useUiStore';

export function useUI() {
  // state
  const mobileMenuOpen = useAtomValue(mobileMenuOpenAtom);
  const searchOpen = useAtomValue(searchOpenAtom);

  // controlled setters
  const [, setMobileMenuOpen] = useAtom(setMobileMenuOpenAtom);
  const [, setSearchOpen] = useAtom(setSearchOpenAtom);

  // convenience actions
  const [, toggleMobileMenu] = useAtom(toggleMobileMenuAtom);
  const [, toggleSearch] = useAtom(toggleSearchAtom);
  const [, closeAllOverlays] = useAtom(closeAllOverlaysAtom);

  return {
    // state
    mobileMenuOpen,
    searchOpen,

    // setters (use these with <Sheet onOpenChange> and open buttons)
    setMobileMenuOpen, // (open: boolean) => void
    setSearchOpen, // (open: boolean) => void

    // convenience
    toggleMobileMenu,
    toggleSearch,
    closeAllOverlays,
  };
}
