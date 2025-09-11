'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-primary text-3xl font-bold tracking-tight">
              {t('title')}
            </h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
        </div>
      </AppShell>
    </Suspense>
  );
}
