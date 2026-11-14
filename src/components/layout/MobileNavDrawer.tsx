import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { stripLocale } from '@/i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MAIN_NAV_ITEMS, isActivePath } from './navData';

interface MobileNavDrawerProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

/* Visibility flips instantly on open (so focus can move in) and only after the slide on close. */
const OPEN =
  'visible [transition:transform_300ms_cubic-bezier(0.22,1,0.36,1),opacity_300ms_cubic-bezier(0.22,1,0.36,1),visibility_0s]';
const CLOSED =
  'invisible [transition:transform_300ms_cubic-bezier(0.22,1,0.36,1),opacity_300ms_cubic-bezier(0.22,1,0.36,1),visibility_0s_300ms]';

/**
 * Below-lg navigation drawer (modal dialog). Always mounted and hidden with visibility,
 * so closed links are out of the tab order and the slide uses plain CSS transitions.
 * While open: focus is trapped, Escape closes, the page behind does not scroll, and it
 * closes itself if the viewport grows to lg (where the header shows inline links).
 * It slides in from the inline end: the right in English, the left in Arabic.
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
    <div className={`fixed inset-0 z-[70] lg:hidden ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 motion-reduce:transition-none bg-cf-bg/75 ${
          isOpen ? `${OPEN} opacity-100` : `${CLOSED} opacity-0`
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.siteMenu}
        className={`absolute inset-y-0 end-0 flex w-full flex-col bg-cf-bg text-white shadow-[-24px_0_48px_-24px_rgba(0,0,0,0.6)] motion-reduce:transition-none rtl:shadow-[24px_0_48px_-24px_rgba(0,0,0,0.6)] sm:w-[400px] sm:border-s sm:border-white/10 ${
          isOpen ? `${OPEN} translate-x-0` : `${CLOSED} translate-x-full rtl:-translate-x-full`
        }`}
      >
        {/* Top bar mirrors the header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-4 sm:px-6">
          {/* This file keeps transparent padding (artwork 966×289 at 17,20 of 1000×328), unlike the
              header's trimmed copy. Scale it so the artwork is h-9 tall like the header logo, and pull
              it toward the bar's start edge by the padding (the padding is the same on both sides). */}
          <img
            src="/images/tissuebioengineering.webp"
            alt={t.site.logoAlt}
            width={1000}
            height={328}
            className="ms-[calc(-2.25rem*17/289)] h-[calc(2.25rem*328/289)] w-auto"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.nav.closeMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0dc2ff]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label={t.nav.mainLabel}
          className="flex-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-4"
        >
          <ul>
            {MAIN_NAV_ITEMS.map(({ key, path, icon: Icon }) => {
              const isActive = isActivePath(page, path);
              const item = t.nav.items[key];
              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-4 rounded-xl px-3 py-3 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0dc2ff] ${
                      isActive ? 'bg-white/[0.06]' : 'active:bg-white/[0.06]'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                        isActive
                          ? 'border-[#0dc2ff]/40 bg-[#0dc2ff]/10 text-[#0dc2ff]'
                          : 'border-white/10 text-white/60'
                      }`}
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-base font-semibold leading-tight ${
                          isActive ? 'text-[#0dc2ff]' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-white/65">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 flex-col gap-3 border-t border-white/[0.08] p-4 sm:p-6">
          <Link
            to="/consultation"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cf-accent text-base font-semibold text-cf-ink transition-colors duration-200 hover:bg-cf-accent-hover focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cf-accent"
          >
            {t.common.bookConsultation}
            <ArrowRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
          <LanguageSwitcher
            onNavigate={onClose}
            className="h-12 w-full border border-white/15 text-base text-white/85 hover:border-white/30 hover:bg-white/[0.06]"
          />
        </div>
      </div>
    </div>
  );
};
