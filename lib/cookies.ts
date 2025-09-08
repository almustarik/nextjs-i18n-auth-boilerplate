"use client"

import Cookies from "js-cookie"

export const cookieStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 7 })
  },
  removeItem: (name: string): void => {
    Cookies.remove(name)
  },
}
