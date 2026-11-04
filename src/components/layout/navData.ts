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

/** Header menu items: desktop dropdown (NavDropdown) and mobile drawer (MobileNavDrawer). */
export interface UnifiedNavItem {
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export const MAIN_NAV_ITEMS: UnifiedNavItem[] = [
  {
    title: 'Home',
    path: '/',
    description: 'Return to main portal & cellular bio-reconstruction overview',
    icon: Home,
  },
  {
    title: 'About Us',
    path: '/about',
    description: 'Our history, mission & world-class bio-engineering team',
    icon: Building2,
  },
  {
    title: 'Research',
    path: '/research',
    description: 'Explore our latest innovations in Tissue Engineering & 3D printing',
    icon: Dna,
  },
  {
    title: 'Core Services',
    path: '/services',
    description: 'Autologous skin matrices, burn care & wound healing treatments',
    icon: Stethoscope,
  },
  {
    title: 'Articles',
    path: '/articles',
    description: 'Read peer-reviewed clinical papers & scientific publications',
    icon: BookOpen,
  },
  {
    title: 'Clinical Partners',
    path: '/case-studies',
    description: 'Collaborate with international hospital networks & trial centers',
    icon: Handshake,
  },
  {
    title: 'Contact',
    path: '/contact',
    description: 'Reach our research institute & clinical consultation desk',
    icon: Mail,
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
