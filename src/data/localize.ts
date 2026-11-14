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
export function applyTranslations<T extends { id: string }>(
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
