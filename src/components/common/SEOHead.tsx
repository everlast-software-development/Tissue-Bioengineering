import React from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/context';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  localizePath,
  stripLocale,
  type Locale,
} from '@/i18n/config';

interface SEOHeadProps {
  /** Page title; suffixed with the site name. */
  title?: string;
  /** Meta description; the site description if omitted. */
  description?: string;
  /**
   * Emit the canonical URL and the language alternates (hreflang). Off for the 404 page,
   * which has no equivalent page to point at.
   */
  alternates?: boolean;
}

/**
 * Page title and meta tags, in the current locale. React 19 hoists <title>, <meta> and <link>
 * rendered anywhere in the tree into <head>, and removes them when the component unmounts.
 *
 * Each page is canonical to itself in its own language, and lists every language version
 * (plus x-default, the English page) as an alternate.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, alternates = true }) => {
  const { t, locale } = useI18n();
  const { pathname } = useLocation();

  const pageTitle = title ? `${title} | ${t.site.name}` : t.site.name;
  const metaDescription = description ?? t.site.description;
  const page = stripLocale(pathname);
  const urlIn = (l: Locale) => `${window.location.origin}${localizePath(page, l)}`;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={t.site.keywords} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={LOCALE_META[locale].ogLocale} />
      {LOCALES.filter((l) => l !== locale).map((l) => (
        <meta key={l} property="og:locale:alternate" content={LOCALE_META[l].ogLocale} />
      ))}
      {alternates && (
        <>
          <meta property="og:url" content={urlIn(locale)} />
          <link rel="canonical" href={urlIn(locale)} />
          {LOCALES.map((l) => (
            <link key={l} rel="alternate" hrefLang={LOCALE_META[l].htmlLang} href={urlIn(l)} />
          ))}
          <link rel="alternate" hrefLang="x-default" href={urlIn(DEFAULT_LOCALE)} />
        </>
      )}
    </>
  );
};
