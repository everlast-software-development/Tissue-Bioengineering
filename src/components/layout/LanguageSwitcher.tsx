import React, { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/context';
import { LOCALES, LOCALE_META, localizePath, stripLocale, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

/** Delay before a hover-opened dropdown closes once the pointer leaves it (ms). */
const HOVER_CLOSE_DELAY = 140;

/* Arabic text on English pages: src/index.css only switches the typeface on Arabic pages. */
const SCRIPT_FONT: Partial<Record<Locale, string>> = {
  ar: "[font-family:'IBM_Plex_Sans_Arabic','IBM_Plex_Sans',sans-serif]",
};

/**
 * The current page in every other language, keeping the query string and the anchor
 * (`/services?x=1#slug` <-> `/ar/services?x=1#slug`). MainLayout keeps the scroll position on a
 * language switch, so the reader stays where they were.
 */
function useAlternateLanguages() {
  const { locale } = useI18n();
  const { pathname, search, hash } = useLocation();
  const page = stripLocale(pathname);
  return LOCALES.filter((l) => l !== locale).map((l) => ({
    locale: l,
    meta: LOCALE_META[l],
    to: { pathname: localizePath(page, l), search, hash },
  }));
}

const Chevron: React.FC<{ open: boolean; className?: string }> = ({ open, className }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 10 6"
    className={cn(
      'h-[6px] w-[10px] shrink-0 transition-transform duration-150 motion-reduce:transition-none',
      open && 'rotate-180',
      className
    )}
  >
    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Link to the current page in another language. The text is that language's own name, marked
 *  with its `lang` so screen readers pronounce it correctly. */
const LanguageOption: React.FC<{
  option: ReturnType<typeof useAlternateLanguages>[number];
  className?: string;
  onNavigate?: () => void;
}> = ({ option, className, onNavigate }) => {
  const { t } = useI18n();
  return (
    // Plain react-router Link: the target path is already in the other language.
    <Link
      to={option.to}
      hrefLang={option.meta.htmlLang}
      lang={option.meta.htmlLang}
      dir={option.meta.dir}
      title={t.language.switchTo}
      onClick={onNavigate}
      className={cn(SCRIPT_FONT[option.locale], className)}
    >
      {option.meta.nativeName}
    </Link>
  );
};

/**
 * Header (lg+) language control: the current language, abbreviated (`EN`, `عربي`), in a quiet pill
 * with a small chevron; the other language drops beneath it (styles in the "Site header, desktop"
 * block of src/index.css).
 *
 * Opens on hover (mouse), on keyboard focus, on click/tap, and from the keyboard (Enter/Space, or
 * ArrowDown, which also moves focus to the option). Closes when the pointer leaves (after a short
 * grace period), when focus leaves, on a click outside, on Escape (focus returns to the button,
 * which then stays closed) and on navigation. A click or Enter while it is open from hover or
 * focus keeps it open rather than toggling it shut.
 */
export const HeaderLanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { t, locale } = useI18n();
  const { pathname } = useLocation();
  const options = useAlternateLanguages();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  /** Opened by hover or focus rather than by an explicit click or key. */
  const openedPassively = useRef(false);
  /** Set while Escape hands focus back to the button, so that focus does not reopen it. */
  const returningFocus = useRef(false);
  const [open, setOpen] = useState(false);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const close = () => {
    cancelClose();
    openedPassively.current = false;
    setOpen(false);
  };
  const openPassively = () => {
    cancelClose();
    if (!open) {
      openedPassively.current = true;
      setOpen(true);
    }
  };

  /* Close on navigation (including the language switch itself). A pending hover-close timer is
     harmless: it only sets the same state. */
  useEffect(() => {
    openedPassively.current = false;
    setOpen(false);
  }, [pathname]);

  /* Close on a click or tap outside. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      openedPassively.current = false;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const focusFirstOption = () =>
    rootRef.current?.querySelector<HTMLElement>(`#${CSS.escape(panelId)} a`)?.focus();

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') openPassively();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse' || !open) return;
        // Keyboard focus inside keeps it open; it closes when that focus moves on.
        if (rootRef.current?.querySelector(':focus-visible')) return;
        cancelClose();
        closeTimer.current = window.setTimeout(close, HOVER_CLOSE_DELAY);
      }}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) close();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          close();
          returningFocus.current = true;
          buttonRef.current?.focus();
          returningFocus.current = false;
        } else if (e.key === 'ArrowDown' && e.target === buttonRef.current) {
          e.preventDefault();
          openedPassively.current = false;
          setOpen(true);
          // The panel becomes focusable once visibility flips (same frame as the re-render).
          requestAnimationFrame(focusFirstOption);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onFocus={(e) => {
          // Keyboard focus only: a click focuses the button too, and its own handler decides.
          if (!returningFocus.current && e.currentTarget.matches(':focus-visible')) openPassively();
        }}
        onClick={() => {
          cancelClose();
          if (open && openedPassively.current) {
            openedPassively.current = false; // pin it open: the click confirms the hover or focus
            return;
          }
          openedPassively.current = false;
          setOpen((v) => !v);
        }}
        className="hdr-pill cf-focus gap-2 pe-3.5 ps-4"
      >
        <span className="sr-only">{t.language.label}: </span>
        <span
          lang={LOCALE_META[locale].htmlLang}
          className="text-[12.5px] font-semibold leading-none tracking-[0.08em] rtl:text-[14.5px] rtl:font-medium rtl:tracking-normal"
        >
          {t.language.short}
        </span>
        <Chevron open={open} className="text-cf-muted" />
      </button>

      <div id={panelId} data-open={open} className="hdr-lang__panel">
        <ul className="min-w-[9.5rem] rounded-[16px] border border-cf-line-strong bg-cf-raised p-1 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]">
          {options.map((option) => (
            <li key={option.locale}>
              <LanguageOption
                option={option}
                onNavigate={close}
                className="flex h-10 items-center rounded-[12px] px-3.5 text-[14.5px] font-medium text-cf-text-2 transition-colors duration-150 hover:bg-cf-active hover:text-cf-text focus:outline-none focus-visible:bg-cf-active focus-visible:text-cf-text focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cf-accent"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Language control inside the below-lg site menu: a full-width row that reads like a form field
 * ("Language ... English ⌄"). Tapping it reveals the other language beneath it; Escape folds it
 * back (without closing the menu) and returns focus to the row. The option is only rendered while
 * revealed, so the menu's focus trap never reaches a hidden link.
 */
export const MenuLanguageSwitcher: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { t, locale } = useI18n();
  const options = useAlternateLanguages();
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const current = LOCALE_META[locale];

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation(); // fold this control only; the menu stays open
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="cf-focus flex h-12 w-full items-center justify-between gap-4 rounded-[2px] border border-cf-line-strong px-4 transition-colors duration-150 hover:border-cf-muted"
      >
        <span className="text-[13.5px] text-cf-muted">{t.language.label}</span>
        <span className="flex items-center gap-3 text-[15px] font-medium text-cf-text">
          <span lang={current.htmlLang}>{current.nativeName}</span>
          <Chevron open={open} className="text-cf-muted" />
        </span>
      </button>

      {open && (
        <ul id={listId} className="border-x border-b border-cf-line-strong">
          {options.map((option) => (
            <li key={option.locale}>
              <LanguageOption
                option={option}
                onNavigate={onNavigate}
                className="flex h-12 items-center px-4 text-[15px] font-medium text-cf-text-2 transition-colors duration-150 hover:bg-cf-active hover:text-cf-text focus:outline-none focus-visible:bg-cf-active focus-visible:text-cf-text focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cf-accent"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
