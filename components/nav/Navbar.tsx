'use client';

import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserMenu } from '@/components/auth/UserMenu';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useI18nRouting } from '@/hooks/useI18nRouting';
import { Code2, Menu } from 'lucide-react';
import { useUI } from '@/hooks/useUI';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations();
  const { push } = useI18nRouting();
  const { toggleMobileMenu } = useUI();
  const pathname = usePathname();

  return (
    <nav className="bg-card/95 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => push('/')}
            className="text-primary hover:text-accent flex items-center gap-2 text-xl font-bold transition-colors"
          >
            <Code2 className="h-6 w-6" />
          </button>

          <div className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => push('/')}
              className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
            >
              {t('navigation.home')}
            </button>
            <button
              onClick={() => push('/about')}
              className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
            >
              {t('navigation.about')}
            </button>
            {session && ( // Conditionally render dashboard link
              <button
                onClick={() => push('/dashboard')}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
              >
                {t('navigation.dashboard')}
              </button>
            )}
            {session && ( // Conditionally render todos link
              <button
                onClick={() => push('/dashboard/todos')}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
              >
                {t('navigation.todos')}
              </button>
            )}
            <button
              onClick={() => push('/public-todos')}
              className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
            >
              {t('navigation.publicTodos')}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {session ? (
            <UserMenu />
          ) : (
            <Button
              onClick={() => push(`/sign-in?callbackUrl=${pathname}`)}
              className="bg-accent hover:bg-accent/90"
            >
              {t('actions.signIn')}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
