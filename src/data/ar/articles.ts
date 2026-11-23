import type { Article } from '@/types';
import type { Translations } from '../useLocalizedData';

/** Arabic text for src/data/articles.ts, by article id. Slugs and images are shared. */
export const articlesAr: Translations<
  Article,
  'title' | 'category' | 'summary' | 'body' | 'author' | 'publishedAt' | 'coverImageAlt' | 'tags'
> = {
  // No Arabic text supplied yet: articles without an entry show in English (marked ltr).
};
