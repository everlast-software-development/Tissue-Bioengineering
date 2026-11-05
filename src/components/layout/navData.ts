import {
  Home,
  Building2,
  Dna,
  Stethoscope,
  BookOpen,
  Handshake,
  Mail,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

/**
 * Header navigation, single source for both menus: every item appears in the below-lg
 * drawer (MobileNavDrawer); items with `inline` are also shown as links in the header bar from lg.
 */
export interface UnifiedNavItem {
  title: string;
  path: string;
  /** Short enough to fit on one line in the drawer (it is truncated as a fallback). */
  description: string;
  icon: LucideIcon;
  /** Shown as a link in the header bar from lg (Navbar). */
  inline?: boolean;
  badge?: string;
}

/** True when `pathname` is `path` or a page under it (e.g. /articles/some-slug). Home matches only `/`. */
export function isActivePath(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

export const MAIN_NAV_ITEMS: UnifiedNavItem[] = [
  {
    title: 'Home',
    path: '/',
    description: 'Main portal & overview',
    icon: Home,
  },
  {
    title: 'About Us',
    path: '/about',
    description: 'Our history & mission',
    icon: Building2,
    inline: true,
  },
  {
    title: 'Research',
    path: '/research',
    description: 'Latest tissue engineering work',
    icon: Dna,
    inline: true,
  },
  {
    title: 'Core Services',
    path: '/services',
    description: 'Skin matrices & burn care',
    icon: Stethoscope,
    inline: true,
  },
  {
    title: 'Articles',
    path: '/articles',
    description: 'Clinical papers & insights',
    icon: BookOpen,
    inline: true,
  },
  {
    title: 'Clinical Partners',
    path: '/case-studies',
    description: 'Our hospital network',
    icon: Handshake,
  },
  {
    title: 'Contact',
    path: '/contact',
    description: 'Get in touch with us',
    icon: Mail,
    inline: true,
  },
];

/**
 * Footer "Navigation" column (the footer shows the first five). Kept separate from
 * MAIN_NAV_ITEMS on purpose: labels, order and items differ from the header menu.
 */
export const NAV_LINKS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Research & Innovation', path: '/research' },
  { label: 'Technologies', path: '/technologies' },
  { label: 'Articles', path: '/articles' },
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'Request Consultation', path: '/consultation' },
  { label: 'Contact Us', path: '/contact' },
];
