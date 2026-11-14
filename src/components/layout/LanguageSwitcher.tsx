import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { useI18n } from '@/i18n/context';
import { LOCALES, LOCALE_META, localizePath, stripLocale } from '@/i18n/config';
import { cn } from '@/lib/utils';

/**
 * Link to the current page in the other language, keeping the query string and the anchor
 * (`/services?x=1#slug` <-> `/ar/services?x=1#slug`). The visible text is the target language's
 * own name, marked with its `lang` so screen readers pronounce it correctly.
 */
export const LanguageSwitcher: React.FC<{
  className?: string;
  /** Classes for the language name (e.g. visually hidden where the bar is tight). */
  labelClassName?: string;
  onNavigate?: () => void;
}> = ({ className, labelClassName, onNavigate }) => {
  const { locale, t } = useI18n();
  const { pathname, search, hash } = useLocation();
  const target = LOCALES.find((l) => l !== locale) ?? locale;
  const meta = LOCALE_META[target];

  return (
    <Link
      // Plain react-router Link: the target path is already in the other language. MainLayout
      // keeps the scroll position on a language switch, so the reader stays where they were.
      to={{ pathname: localizePath(stripLocale(pathname), target), search, hash }}
      hrefLang={meta.htmlLang}
      title={t.language.switchTo}
      onClick={onNavigate}
      className={cn(
        'cf-focus inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200',
        className
      )}
    >
      <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span lang={meta.htmlLang} dir={meta.dir} className={labelClassName}>
        {meta.nativeName}
      </span>
    </Link>
  );
};
