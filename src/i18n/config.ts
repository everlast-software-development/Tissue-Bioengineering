/**
 * Locales the site is published in, and the URL scheme that selects them.
 *
 * English (the default) keeps its original, unprefixed routes (`/`, `/about`, …).
 * Every other locale is the same page tree under a prefix (`/ar`, `/ar/about`, …),
 * so each page has one equivalent URL per language.
 */
export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

interface LocaleMeta {
  /** Value for <html lang>, hreflang and Intl. */
  htmlLang: string;
  dir: 'ltr' | 'rtl';
  /** Open Graph locale (og:locale). */
  ogLocale: string;
  /** The language's name in that language (language switcher). */
  nativeName: string;
  /**
   * Intl locale for formatting numbers and dates. Arabic uses Western digits (0–9): the site's
   * figures, units and scientific values are written with them, and they are standard in UAE
   * clinical and scientific publishing.
   */
  intl: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { htmlLang: 'en', dir: 'ltr', ogLocale: 'en_US', nativeName: 'English', intl: 'en-US' },
  ar: {
    htmlLang: 'ar',
    dir: 'rtl',
    ogLocale: 'ar_AE',
    nativeName: 'العربية',
    intl: 'ar-AE-u-nu-latn',
  },
};

/** URL prefix of a non-default locale ('' for the default). */
const prefixOf = (locale: Locale) => (locale === DEFAULT_LOCALE ? '' : `/${locale}`);

/** Locale selected by a pathname: `/ar` or `/ar/...` is Arabic, everything else English. */
export function localeFromPath(pathname: string): Locale {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    const prefix = prefixOf(locale);
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return locale;
  }
  return DEFAULT_LOCALE;
}

/** The locale-neutral page path: `/ar/about` -> `/about`, `/ar` -> `/`. */
export function stripLocale(pathname: string): string {
  const prefix = prefixOf(localeFromPath(pathname));
  if (!prefix) return pathname || '/';
  return pathname.slice(prefix.length) || '/';
}

/**
 * Path of a site page in `locale`. Accepts a locale-neutral path that may carry a query
 * and/or hash (`/services#slug` -> `/ar/services#slug`). External URLs, protocol-relative
 * URLs and in-page anchors (`#id`) are returned unchanged.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const prefix = prefixOf(locale);
  if (!prefix) return path;
  const split = path.search(/[?#]/);
  const pathname = split === -1 ? path : path.slice(0, split);
  const rest = split === -1 ? '' : path.slice(split);
  return `${prefix}${pathname === '/' ? '' : pathname}${rest}`;
}
