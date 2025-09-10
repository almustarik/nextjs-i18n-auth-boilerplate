'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Github } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface SignInFormProps {
  providers: Record<string, any> | null;
  callbackUrl?: string; // Add callbackUrl prop
}

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02s10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zM16.5 12.06h-2.25v6.88h-3V12.06H9.5V9.81h1.75V8.25c0-1.73 1.05-2.67 2.59-2.67h2.16v2.25h-1.3c-.84 0-1 .4-1 1v1.25h2.3l-.3 2.25z"
    />
  </svg>
);

export function SignInForm({ providers, callbackUrl }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('auth');
  const locale = useLocale();

  const handleProviderSignIn = async (providerId: string) => {
    setIsLoading(true);
    try {
      await signIn(providerId, {
        callbackUrl: callbackUrl || `/${locale}/dashboard`,
      });
    } catch (error) {
      console.error('Provider sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasOAuthProviders =
    providers && (providers.google || providers.github || providers.facebook);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{t('signIn')}</CardTitle>
        <CardDescription>{t('signInDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasOAuthProviders ? (
          <div className="space-y-2">
            {providers?.google && (
              <Button
                variant="outline"
                className="hover:bg-accent w-full bg-transparent"
                onClick={() => handleProviderSignIn('google')}
                disabled={isLoading}
              >
                <GoogleIcon />
                {t('signInWithGoogle')}
              </Button>
            )}
            {providers?.github && (
              <Button
                variant="outline"
                className="hover:bg-accent w-full bg-transparent"
                onClick={() => handleProviderSignIn('github')}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                {t('signInWithGitHub')}
              </Button>
            )}
            {providers?.facebook && (
              <Button
                variant="outline"
                className="hover:bg-accent w-full bg-transparent"
                onClick={() => handleProviderSignIn('facebook')}
                disabled={isLoading}
              >
                <FacebookIcon />
                {t('signInWithFacebook')}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground text-center text-sm">
            {t('oauthNotConfigured')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
