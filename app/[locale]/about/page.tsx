import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('about');

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-8">
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-4">{t('description')}</p>
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
