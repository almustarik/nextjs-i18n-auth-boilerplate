import { SignInForm } from '@/components/auth/SignInForm';
import { getServerAuthSession } from '@/lib/auth';
import { getProviders } from 'next-auth/react';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({
  params,
  searchParams,
}: SignInPageProps) {
  const { locale } = await params;
  const { callbackUrl } = await searchParams;

  // Make sure locale is set as early as possible
  setRequestLocale(locale);

  const session = await getServerAuthSession();

  if (session) {
    redirect(callbackUrl || `/${locale}/dashboard`);
  }

  const providers = await getProviders();

  return (
    <div className="bg-background min-h-screen">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="container py-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-primary text-3xl font-bold tracking-tight">
                Welcome Back
              </h1>
              <p className="text-muted-foreground mt-2">
                Sign in to continue to your account
              </p>
            </div>
            <SignInForm providers={providers} callbackUrl={callbackUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' },
    { locale: 'es' },
    { locale: 'bn' },
  ];
}
