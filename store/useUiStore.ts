import { atom } from 'jotai';

/** =========================
 * UI state
 * ======================= */
export const mobileMenuOpenAtom = atom(false);
export const searchOpenAtom = atom(false);

/** Controlled setters (for components like <Sheet onOpenChange>) */
export const setMobileMenuOpenAtom = atom(null, (_get, set, open: boolean) =>
  set(mobileMenuOpenAtom, open)
);
export const setSearchOpenAtom = atom(null, (_get, set, open: boolean) =>
  set(searchOpenAtom, open)
);

/** Optional toggles (keep for convenience) */
export const toggleMobileMenuAtom = atom(null, (get, set) =>
  set(mobileMenuOpenAtom, !get(mobileMenuOpenAtom))
);
export const toggleSearchAtom = atom(null, (get, set) =>
  set(searchOpenAtom, !get(searchOpenAtom))
);

/** Close all modals/overlays */
export const closeAllOverlaysAtom = atom(null, (_get, set) => {
  set(mobileMenuOpenAtom, false);
  set(searchOpenAtom, false);
});

/** =========================
 * Pagination state
 * ======================= */
export const currentPageAtom = atom(1);
export const pageSizeAtom = atom(10);

/** Pagination actions */
export const setPageAtom = atom(null, (_get, set, page: number) => {
  set(currentPageAtom, page);
});
export const setPageSizeAtom = atom(null, (_get, set, pageSize: number) => {
  set(pageSizeAtom, pageSize);
});
