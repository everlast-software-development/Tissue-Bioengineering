import type { Messages } from '@/i18n/messages/en';

/**
 * Header navigation, single source for both menus: every item appears in the below-lg menu
 * (MobileNavDrawer); items with `inline` are also links in the header bar from lg (Navbar).
 * Titles and descriptions come from the dictionaries (`nav.items[key]` in src/i18n/messages).
 */
interface MainNavItem {
  /** Key of the item's title and description in `nav.items`. */
  key: keyof Messages['nav']['items'];
  /** Locale-neutral path; the localized <Link> adds the language prefix. */
  path: string;
  /** Shown as a link in the header bar from lg (Navbar). */
  inline?: boolean;
}

/**
 * True when `pathname` is `path` or a page under it (e.g. /articles/some-slug). Home matches
 * only `/`. Both are locale-neutral paths (see stripLocale in src/i18n/config.ts).
 */
export function isActivePath(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  { key: 'home', path: '/', inline: true },
  { key: 'about', path: '/about', inline: true },
  { key: 'research', path: '/research', inline: true },
  { key: 'services', path: '/services', inline: true },
  { key: 'articles', path: '/articles', inline: true },
  { key: 'partners', path: '/case-studies' },
  { key: 'contact', path: '/contact', inline: true },
];

/**
 * Footer "Navigation" column. Kept separate from MAIN_NAV_ITEMS on purpose: labels, order and
 * items differ from the header menu.
 */
export const FOOTER_NAV_LINKS: { key: keyof Messages['footer']['links']; path: string }[] = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'research', path: '/research' },
  { key: 'technologies', path: '/technologies' },
];
