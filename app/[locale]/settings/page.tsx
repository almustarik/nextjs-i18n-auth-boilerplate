import { AppShell } from "@/components/layout/AppShell"
import { getTranslations } from "next-intl/server"
import { setRequestLocale } from "next-intl/server"

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations("settings")

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>
    </AppShell>
  )
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }, { locale: "bn" }]
}