import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ArticleBlock } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Words per minute behind the articles' reading time. */
const READING_WPM = 200;

/** Whole minutes (at least 1) to read an article body, from its word count. */
export function readingMinutes(body: ArticleBlock[]): number {
  const text = body
    .flatMap((block) => {
      switch (block.type) {
        case 'note':
        case 'heading':
        case 'paragraph':
          return [block.text];
        case 'list':
          return block.items;
        case 'faq':
          return block.items.flatMap((item) => [item.question, item.answer]);
        case 'image':
          return [];
      }
    })
    .join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / READING_WPM));
}
