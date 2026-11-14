import {
  Home,
  Building2,
  Dna,
  Stethoscope,
  BookOpen,
  Handshake,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import type { Messages } from '@/i18n/messages/en';

/**
 * Header navigation, single source for both menus: every item appears in the below-lg
 * drawer (MobileNavDrawer); items with `inline` are also shown as links in the header bar from lg.
 * Titles and descriptions come from the dictionaries (`nav.items[key]` in src/i18n/messages).
 */
interface MainNavItem {
  /** Key of the item's title and description in `nav.items`. */
  key: keyof Messages['nav']['items'];
  /** Locale-neutral path; the localized <Link> adds the language prefix. */
  path: string;
  icon: LucideIcon;
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
  { key: 'home', path: '/', icon: Home, inline: true },
  { key: 'about', path: '/about', icon: Building2, inline: true },
  { key: 'research', path: '/research', icon: Dna, inline: true },
  { key: 'services', path: '/services', icon: Stethoscope, inline: true },
  { key: 'articles', path: '/articles', icon: BookOpen, inline: true },
  { key: 'partners', path: '/case-studies', icon: Handshake },
  { key: 'contact', path: '/contact', icon: Mail, inline: true },
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
