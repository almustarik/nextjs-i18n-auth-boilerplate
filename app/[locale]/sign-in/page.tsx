import { SignInForm } from "@/components/auth/SignInForm"
import { Navbar } from "@/components/nav/Navbar"
import { getProviders } from "next-auth/react"
import { getServerAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  setRequestLocale(locale)

  const session = await getServerAuthSession()

  if (session) {
    redirect(`/${locale}/dashboard`)
  }

  const providers = await getProviders()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="container py-12">
          <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to continue to your account</p>
          </div>
          <SignInForm providers={providers} />
        </div>
      </div>
    </div>
    </div>
  )
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }, { locale: "bn" }]
}
