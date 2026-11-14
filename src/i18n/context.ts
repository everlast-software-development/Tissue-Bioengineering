import { createContext, useContext } from 'react';
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from './config';
import { en } from './messages/en';
import type { Messages } from './messages/en';

export interface I18nValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  /** Shared UI strings (navigation, footer, forms, categories, …) for the current locale. */
  t: Messages;
  /** Path of a site page in the current locale (`/about` -> `/ar/about` in Arabic). */
  to: (path: string) => string;
}

export const I18nContext = createContext<I18nValue>({
  locale: DEFAULT_LOCALE,
  dir: LOCALE_META[DEFAULT_LOCALE].dir,
  t: en,
  to: (path) => path,
});

/** Current locale, text direction, shared strings and the path localizer. */
export const useI18n = () => useContext(I18nContext);

/**
 * Page- or feature-level strings defined next to the component that uses them, one object
 * per locale. Declare the Arabic object as `typeof en` so a missing key is a type error.
 */
export type LocalizedMessages<T> = Record<Locale, T>;

/** Picks the current locale's entry from a page-level message bundle. */
export function useMessages<T>(bundle: LocalizedMessages<T>): T {
  return bundle[useI18n().locale];
}
