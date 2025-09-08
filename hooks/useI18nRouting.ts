"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useI18nRouting() {
  const locale = useLocale()
  const router = useRouter()

  const push = useCallback(
    (href: string) => {
      const localizedHref = href.startsWith("/") ? `/${locale}${href}` : href
      router.push(localizedHref)
    },
    [locale, router],
  )

  const replace = useCallback(
    (href: string) => {
      const localizedHref = href.startsWith("/") ? `/${locale}${href}` : href
      router.replace(localizedHref)
    },
    [locale, router],
  )

  return {
    push,
    replace,
    locale,
  }
}
