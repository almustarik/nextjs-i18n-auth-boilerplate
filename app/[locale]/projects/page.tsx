'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useTranslations } from 'next-intl';

export default function ProjectsPage() {
  const t = useTranslations('projects');

  return (
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
  );
}
