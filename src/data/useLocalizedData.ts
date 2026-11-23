import { useMemo } from 'react';
import { useI18n } from '@/i18n/context';
import type { Locale } from '@/i18n/config';
import { mockServices } from './mockServices';
import { researchItems } from './research';
import { technologies, technologyImages } from './technologies';
import { articles } from './articles';
import { servicesAr } from './ar/services';
import { researchAr } from './ar/research';
import { technologiesAr, technologyImageAltAr } from './ar/technologies';
import { articlesAr } from './ar/articles';

/**
 * Content records (services, research, technologies, articles) are written in English in
 * src/data/*.ts. Each other locale supplies the translated text fields per record id
 * (src/data/ar/*.ts); everything else (ids, slugs, images, icons, categories used as filter
 * keys, DOIs, dates) always comes from the English record.
 */
export type Translations<T, K extends keyof T> = Record<string, Pick<T, K>>;

/**
 * Overlays `translations` on `records`. A record without a translation keeps its English text,
 * so a page never breaks; in development the gap is reported in the console.
 */
function applyTranslations<T extends { id: string }>(
  records: T[],
  translations: Record<string, Partial<T>> | undefined,
  collection: string
): T[] {
  if (!translations) return records;
  return records.map((record) => {
    const text = translations[record.id];
    if (!text) {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] No translation for ${collection} "${record.id}"; showing English.`);
      }
      return record;
    }
    return { ...record, ...text };
  });
}

/**
 * Content collections in the current locale. Components read content through these hooks
 * instead of importing src/data/*.ts directly; English returns the original arrays unchanged.
 */

function useTranslated<T extends { id: string }>(
  records: T[],
  byLocale: Partial<Record<Locale, Record<string, Partial<T>>>>,
  collection: string
): T[] {
  const { locale } = useI18n();
  return useMemo(
    () => applyTranslations(records, byLocale[locale], collection),
    // `records` and `byLocale` are module constants.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );
}

export const useServices = () => useTranslated(mockServices, { ar: servicesAr }, 'service');

export const useResearchItems = () =>
  useTranslated(researchItems, { ar: researchAr }, 'research item');

export const useTechnologies = () =>
  useTranslated(technologies, { ar: technologiesAr }, 'technology');

export const useArticles = () => useTranslated(articles, { ar: articlesAr }, 'article');

const IMAGE_ALT: Partial<Record<Locale, Record<string, string>>> = { ar: technologyImageAltAr };

/** `technologyImages` with alt text in the current locale. */
export function useTechnologyImages(): typeof technologyImages {
  const { locale } = useI18n();
  return useMemo(() => {
    const alts = IMAGE_ALT[locale];
    if (!alts) return technologyImages;
    return Object.fromEntries(
      Object.entries(technologyImages).map(([id, image]) => [
        id,
        { ...image, alt: alts[id] ?? image.alt },
      ])
    );
  }, [locale]);
}
