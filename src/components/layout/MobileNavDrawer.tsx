import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { stripLocale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { MenuLanguageSwitcher } from './LanguageSwitcher';
import { MenuToggle } from './MenuToggle';
import { MAIN_NAV_ITEMS, isActivePath } from './navData';

interface MobileNavDrawerProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

/** Index of the foot (language + CTA) in the entrance sequence: it follows the last link. */
const FOOT_INDEX = MAIN_NAV_ITEMS.length;

/** Stagger position of an element: `--i` counts from the first to enter, `--ri` from the first to leave. */
const stagger = (i: number) =>
  ({ '--i': i, '--ri': FOOT_INDEX - i }) as React.CSSProperties;

/**
 * Below-lg site menu (modal dialog). A panel slides in from the inline end (right in English,
 * left in Arabic) led by a curved edge that bows ahead of it and settles flat as the panel lands;
 * the page behind dims. Then the links enter one after another, the foot last. Closing runs the
 * same sequence backwards. All motion is CSS (`.site-menu*` in src/index.css); with reduced
 * motion the panel simply fades.
 *
 * Content: every destination, numbered, with its one-line description, separated by hairlines;
 * the current page carries the same 2px cyan rule as the desktop links. At the foot: the language
 * control (tap to reveal the other language), then Book Consultation. Below sm the panel is the
 * full width and its top row carries the logo, exactly where the header's logo is, so the menu
 * takes over the header; from sm it is a 416px panel beside the dimmed page.
 *
 * The close control is the same icon button as the header's, drawn above the panel at the same
 * position, so the user sees one button fold from three lines into a cross. It is inside the
 * dialog, so it is reachable while the dialog is modal, and it takes focus on open.
 *
 * Always mounted and hidden with visibility, so closed links are out of the tab order. While open:
 * Tab cycles inside, Escape closes, the page behind does not scroll (its scrollbar gutter is kept so
 * nothing shifts), and it closes itself if the viewport grows to lg (where the header shows the
 * links inline).
 */
export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ id, isOpen, onClose }) => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const page = stripLocale(pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    navRef.current?.scrollTo(0, 0); // the list stays mounted; each opening starts at the top
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevGutter = root.style.scrollbarGutter;
    root.style.overflow = 'hidden';
    root.style.scrollbarGutter = 'stable';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !rootRef.current) return;
      const items = rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = (e: MediaQueryListEvent) => e.matches && onClose();

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      root.style.overflow = prevOverflow;
      root.style.scrollbarGutter = prevGutter;
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={rootRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.siteMenu}
      data-open={isOpen}
      className="site-menu fixed inset-0 z-[70] overflow-hidden lg:hidden"
    >
      {/* Close: same geometry as the header's button (44px at the container gutter, centred in the
          header row's 63px content box above its hairline), first in the tab order, drawn above
          the panel. */}
      <MenuToggle
        ref={closeRef}
        open={isOpen}
        onClick={onClose}
        aria-label={t.nav.closeMenu}
        className="absolute end-5 top-[9.5px] z-10 sm:end-8"
      />

      {/* Dims the page; a tap on it closes the menu. */}
      <div aria-hidden="true" onClick={onClose} className="site-menu__backdrop absolute inset-0 bg-[#02050A]/70" />

      <div className="site-menu__panel absolute inset-y-0 end-0 flex w-full flex-col bg-cf-panel sm:w-[26rem] sm:max-w-[calc(100%-3rem)]">
        {/* Curved leading edge: a parabola in the panel's colour, bowing ahead of the panel while it
            moves and scaled flat once it has landed. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="site-menu__curve fill-cf-panel"
        >
          <path d="M100 0 V100 Q-100 50 100 0" />
        </svg>

        {/* Top row: the header's geometry below lg. The logo sits where the header's logo is and is
            only needed while the panel covers the header (below sm); it appears last, with the
            foot, rather than travelling in under the close button. */}
        <div className="h-16 shrink-0 border-b border-cf-line">
          <div style={stagger(FOOT_INDEX)} className="site-menu__item flex h-full items-center px-5 sm:px-8">
            <img
              src="/images/tissuebioengineering.webp"
              alt={t.site.logoAlt}
              width={1000}
              height={328}
              className="ms-[calc(-2.25rem*17/289)] h-[calc(2.25rem*328/289)] w-auto sm:hidden"
            />
          </div>
        </div>

        <nav ref={navRef} aria-label={t.nav.mainLabel} className="flex-1 overflow-y-auto overscroll-contain">
          <ol className="px-5 sm:px-8">
            {MAIN_NAV_ITEMS.map(({ key, path }, i) => {
              const isActive = isActivePath(page, path);
              const item = t.nav.items[key];
              return (
                <li key={path} style={stagger(i)} className="site-menu__item relative border-b border-cf-line">
                  <Link
                    to={path}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline py-[0.875rem] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cf-accent sm:grid-cols-[3rem_minmax(0,1fr)] sm:py-4"
                  >
                    <span
                      aria-hidden="true"
                      className={cn('text-[11px] tabular-nums', isActive ? 'text-cf-accent' : 'text-cf-muted')}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          'block text-[26px] font-medium leading-[1.1] tracking-[-0.02em] transition-colors duration-150 rtl:tracking-normal sm:text-[28px]',
                          isActive ? 'text-cf-text' : 'text-cf-text-2 group-hover:text-cf-text'
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-cf-muted">{item.description}</span>
                    </span>
                  </Link>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute inset-x-0 -bottom-px h-0.5 bg-cf-accent',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Foot: language, then the primary action. */}
        <div style={stagger(FOOT_INDEX)} className="site-menu__item shrink-0 border-t border-cf-line">
          <div className="grid gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:gap-4 sm:px-8 sm:pb-6 sm:pt-5">
            {/* Keyed on isOpen: the language list is folded again whenever the menu reopens. */}
            <MenuLanguageSwitcher key={String(isOpen)} onNavigate={onClose} />
            <Link
              to="/consultation"
              onClick={onClose}
              className="cf-focus flex h-12 items-center justify-center rounded-full bg-cf-text px-6 text-[15px] font-semibold text-cf-bg transition-colors duration-150 hover:bg-white"
            >
              {t.common.bookConsultation}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
