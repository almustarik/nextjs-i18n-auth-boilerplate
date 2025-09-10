'use client';

import type React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useUI } from '@/hooks/useUI';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarOpen } = useUI();

  return (
    <AuthGuard>
      <div className="bg-background min-h-screen">
        <div className="flex">
          <main className="min-h-[calc(100vh-4rem)] flex-1 transition-all duration-300">
            <div className="container py-6">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
