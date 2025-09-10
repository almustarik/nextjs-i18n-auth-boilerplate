import { atom } from 'jotai';

// UI state atoms
export const mobileMenuOpenAtom = atom(false);
export const searchOpenAtom = atom(false);

// UI actions
export const toggleMobileMenuAtom = atom(null, (get, set) => {
  set(mobileMenuOpenAtom, !get(mobileMenuOpenAtom));
});

export const toggleSearchAtom = atom(null, (get, set) => {
  set(searchOpenAtom, !get(searchOpenAtom));
});

// Close all modals/overlays
export const closeAllOverlaysAtom = atom(null, (get, set) => {
  set(mobileMenuOpenAtom, false);
  set(searchOpenAtom, false);
});

// Pagination state atoms
export const currentPageAtom = atom(1);
export const pageSizeAtom = atom(10);

// Pagination actions
export const setPageAtom = atom(null, (get, set, page: number) => {
  set(currentPageAtom, page);
});

export const setPageSizeAtom = atom(null, (get, set, pageSize: number) => {
  set(pageSizeAtom, pageSize);
});
