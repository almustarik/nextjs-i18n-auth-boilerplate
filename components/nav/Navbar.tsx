"use client"

import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserMenu } from "@/components/auth/UserMenu"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useI18nRouting } from "@/hooks/useI18nRouting"
import { Code2, Menu } from "lucide-react"
import { useUI } from "@/hooks/useUI"

export function Navbar() {
  const { data: session } = useSession()
  const t = useTranslations();
  const { push } = useI18nRouting()
  const { toggleMobileMenu } = useUI()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => push("/")}
            className="flex items-center gap-2 font-bold text-xl text-primary hover:text-accent transition-colors"
          >
            <Code2 className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => push("/")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t("navigation.home")}
            </button>
            <button
              onClick={() => push("/about")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {t("navigation.about")}
            </button>
            {session && ( // Conditionally render dashboard link
              <button
                onClick={() => push("/dashboard")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {t("navigation.dashboard")}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {session ? (
            <UserMenu />
          ) : (
            <Button onClick={() => push("/sign-in")} className="bg-accent hover:bg-accent/90">
              {t("actions.signIn")}
            </Button>
          )}

          <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
