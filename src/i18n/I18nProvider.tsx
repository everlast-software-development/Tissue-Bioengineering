import React, { useLayoutEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LOCALE_META, localeFromPath, localizePath } from './config';
import { I18nContext, type I18nValue } from './context';
import { en } from './messages/en';
import { ar } from './messages/ar';

const MESSAGES = { en, ar } as const;

/**
 * Derives the locale from the URL (`/ar/...` is Arabic) and keeps <html lang> and <html dir>
 * in step with it. index.html sets both before the first paint for `/ar` URLs, so an Arabic
 * page never flashes left-to-right.
 */
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dir: LOCALE_META[locale].dir,
      t: MESSAGES[locale],
      to: (path: string) => localizePath(path, locale),
    }),
    [locale]
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = LOCALE_META[locale].htmlLang;
    root.dir = LOCALE_META[locale].dir;
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
