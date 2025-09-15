'use client';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useUI } from '@/hooks/useUI';
import { Suspense } from 'react';
import { Code2, LayoutDashboard, User2 } from 'lucide-react';

interface NavItem {
  href: string;
  labelKey: string;
  icon: any;
  auth: boolean;
  showInMobile: boolean;
}

interface MobileMenuProps {
  navItems: NavItem[];
}

export function MobileMenu({ navItems }: MobileMenuProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const { mobileMenuOpen, setMobileMenuOpen } = useUI();

  const filteredNav = navItems.filter(
    (item) =>
      (status === 'authenticated' ? !item.auth || item.auth : !item.auth) &&
      item.showInMobile
  );

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));

  const callbackUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent
        side="left"
        className="flex w-full max-w-xs flex-col sm:max-w-sm"
      >
        <SheetHeader>
          <SheetTitle>
            <SheetClose asChild>
              <Link href="/" className="mb-4 flex items-center space-x-2">
                <Code2 className="h-8 w-8 text-blue-600" />
              </Link>
            </SheetClose>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu
          </SheetDescription>
        </SheetHeader>

        <nav className="mt-4 grid gap-2 border-t px-3 pt-4 text-lg font-medium">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const label = t(item.labelKey);

            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 rounded-lg px-3 py-2 transition-all hover:text-blue-600 ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {label}
                </Link>
              </SheetClose>
            );
          })}

          {status !== 'authenticated' ? (
            <>
              <SheetClose asChild>
                <Link
                  href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="flex items-center gap-4 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-blue-600"
                >
                  <User2 className="h-5 w-5" />
                  {t('actions.signIn')}
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                >
                  <Button className="h-12 w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-medium text-white hover:from-blue-700 hover:to-indigo-700">
                    {t('actions.getStarted')}
                  </Button>
                </Link>
              </SheetClose>
            </>
          ) : (
            <SheetClose asChild>
              <Link
                href="/dashboard"
                className="flex items-center gap-4 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-blue-600"
              >
                <LayoutDashboard className="h-5 w-5" />
                {t('navigation.dashboard')}
              </Link>
            </SheetClose>
          )}
        </nav>

        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between gap-2">
            <Suspense fallback={<Skeleton className="h-8 w-24" />}>
              <LanguageSwitcher />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
