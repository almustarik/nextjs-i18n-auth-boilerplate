'use client';

import type React from 'react';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [session, status, router, pathname, searchParams]);

  if (status === 'loading') {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      )
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
