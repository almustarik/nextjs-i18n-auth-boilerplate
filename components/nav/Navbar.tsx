'use client';

import { UserMenu } from '@/components/auth/UserMenu';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useUI } from '@/hooks/useUI';
import {
  CheckCircle,
  Code2,
  FileText,
  HomeIcon,
  LayoutDashboard,
  Menu,
  User2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { Suspense } from 'react';
import { MobileMenu } from './MobileMenu';

// Shared navItems array
const navItems = [
  {
    href: '/',
    labelKey: 'navigation.home',
    icon: HomeIcon,
    auth: false,
    showInDesktop: true,
    showInMobile: true,
  },
  {
    href: '/about',
    labelKey: 'navigation.about',
    icon: User2,
    auth: false,
    showInDesktop: true,
    showInMobile: true,
  },
  {
    href: '/dashboard',
    labelKey: 'navigation.dashboard',
    icon: LayoutDashboard,
    auth: true,
    showInDesktop: true,
    showInMobile: true,
  },
  {
    href: '/dashboard/todos',
    labelKey: 'navigation.todos',
    icon: CheckCircle,
    auth: true,
    showInDesktop: true,
    showInMobile: true,
  },
  {
    href: '/public-todos',
    labelKey: 'navigation.publicTodos',
    icon: FileText,
    auth: false,
    showInDesktop: true,
    showInMobile: true,
  },
  {
    href: '/listings',
    labelKey: 'navigation.listings',
    icon: FileText,
    auth: false,
    showInDesktop: true,
    showInMobile: true,
  },
  // {
  //   href: '/privacy-policy',
  //   labelKey: 'navigation.privacyPolicy',
  //   icon: FileText,
  //   auth: false,
  //   showInDesktop: false,
  //   showInMobile: true,
  // },
  // {
  //   href: '/terms-of-service',
  //   labelKey: 'navigation.termsOfService',
  //   icon: FileCheck,
  //   auth: false,
  //   showInDesktop: false,
  //   showInMobile: true,
  // },
];

export function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setMobileMenuOpen } = useUI();

  return (
    <>
      <nav className="prose bg-card/95 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-primary hover:text-accent flex items-center gap-2 text-xl font-bold transition-colors"
            >
              <Code2 className="h-6 w-6" />
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => {
                if (item.auth && !session) return null;
                if (!item.showInDesktop) return null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <Suspense fallback={<Skeleton className="h-8 w-24" />}>
                <LanguageSwitcher />
              </Suspense>
              <ThemeToggle />
            </div>

            {session ? (
              <UserMenu />
            ) : (
              <Button
                onClick={() => {
                  const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
                  window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`;
                }}
                className="bg-accent hover:bg-accent/90"
              >
                {t('actions.signIn')}
              </Button>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <MobileMenu navItems={navItems} />
    </>
  );
}
