import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { stripLocale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { MenuLanguageSwitcher } from './LanguageSwitcher';
import { MAIN_NAV_ITEMS, isActivePath } from './navData';

interface MobileNavDrawerProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

/* Visibility flips instantly on open (so focus can move in on the same frame) and only after the
   fade on close (so the fade is seen). */
const OPEN =
  'visible opacity-100 [transition:opacity_200ms_cubic-bezier(0,0,0.2,1),visibility_0s] motion-reduce:transition-none';
const CLOSED =
  'pointer-events-none invisible opacity-0 [transition:opacity_200ms_cubic-bezier(0,0,0.2,1),visibility_0s_200ms] motion-reduce:transition-none';

/**
 * Below-lg site menu (modal dialog): a full-screen index of every destination, numbered, with
 * each section's one-line description, separated by hairlines; the current page's row carries the
 * same 2px cyan rule as the desktop links. Pinned at the foot: the language control (tap to reveal
 * the other language), then Book Consultation.
 *
 * Always mounted and hidden with visibility, so closed links are out of the tab order. While open:
 * focus moves to Close and Tab cycles inside, Escape closes, the page behind does not scroll, and
 * it closes itself if the viewport grows to lg (where the header shows the links inline).
 * It fades in place (no slide), so it reads the same in English and Arabic.
 */
export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ id, isOpen, onClose }) => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const page = stripLocale(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
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
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.siteMenu}
      className={cn('fixed inset-0 z-[70] flex flex-col bg-cf-bg lg:hidden', isOpen ? OPEN : CLOSED)}
    >
      {/* Top bar: same geometry as the header below lg. */}
      <div className="h-16 shrink-0 border-b border-cf-line">
        <div className="cf-container flex h-full items-center justify-between gap-4">
          <img
            src="/images/tissuebioengineering-header.webp"
            alt={t.site.logoAlt}
            width={966}
            height={289}
            className="h-9 w-auto"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.nav.closeMenu}
            className="cf-focus inline-flex h-11 shrink-0 items-center rounded-[2px] border border-cf-line-strong px-4 text-[14px] font-medium text-cf-text transition-colors duration-150 hover:border-cf-muted"
          >
            {t.nav.close}
          </button>
        </div>
      </div>

      <nav aria-label={t.nav.mainLabel} className="flex-1 overflow-y-auto overscroll-contain">
        <ol className="cf-container">
          {MAIN_NAV_ITEMS.map(({ key, path }, i) => {
            const isActive = isActivePath(page, path);
            const item = t.nav.items[key];
            return (
              <li key={path} className="relative border-b border-cf-line">
                <Link
                  to={path}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className="group grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline py-4 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cf-accent sm:grid-cols-[4rem_minmax(0,1fr)] sm:py-5"
                >
                  <span
                    aria-hidden="true"
                    className={cn('text-[12px] tabular-nums', isActive ? 'text-cf-accent' : 'text-cf-muted')}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block text-[22px] font-medium leading-tight tracking-[-0.015em] transition-colors duration-150 sm:text-[26px]',
                        isActive ? 'text-cf-text' : 'text-cf-text-2 group-hover:text-cf-text'
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="mt-1 block truncate text-[13.5px] text-cf-muted">
                      {item.description}
                    </span>
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
      <div className="shrink-0 border-t border-cf-line bg-cf-raised">
        <div className="cf-container grid gap-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:gap-4 sm:pb-6 sm:pt-5">
          {/* Keyed on isOpen: the language list is folded again whenever the menu reopens. */}
          <MenuLanguageSwitcher key={String(isOpen)} onNavigate={onClose} />
          <Link
            to="/consultation"
            onClick={onClose}
            className="cf-focus flex h-12 items-center justify-center rounded-[2px] bg-cf-text px-6 text-[15px] font-semibold text-cf-bg transition-colors duration-150 hover:bg-white"
          >
            {t.common.bookConsultation}
          </Link>
        </div>
      </div>
    </div>
  );
};
