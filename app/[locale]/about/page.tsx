import { Navbar } from "@/components/nav/Navbar"
import { getTranslations } from "next-intl/server"
import { setRequestLocale } from "next-intl/server"

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations("about")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t("title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("description")}</p>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }, { locale: "bn" }]
}