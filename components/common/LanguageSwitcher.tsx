'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { cookieStorage } from '@/lib/cookies';
import type { Route } from 'next'; // 👈 add this

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return; // no-op

    // Remember preference
    cookieStorage.setItem('NEXT_LOCALE', newLocale);

    // Replace the first segment (/en/..., /fr/..., etc.)
    const segments = pathname.split('/');
    // ensure leading slash segment exists
    if (segments.length === 0 || segments[0] !== '') segments.unshift('');
    segments[1] = newLocale;

    let newPath = segments.join('/');
    if (!newPath.startsWith('/')) newPath = `/${newPath}`;

    const params = searchParams.toString();
    if (params) newPath += `?${params}`;

    // 👇 cast because typedRoutes requires a Route literal,
    // and we are generating it at runtime
    router.push(newPath as Route);
    // If you prefer not to add a new history entry, use:
    // router.replace(newPath as Route);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {currentLanguage?.flag ?? <Globe size={16} />}
          <span className="hidden sm:inline">
            {currentLanguage?.name ?? 'Language'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={locale === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
