import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { stripLocale } from '@/i18n/config';
import { MobileNavDrawer } from './MobileNavDrawer';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MAIN_NAV_ITEMS, isActivePath } from './navData';

/** Scroll distance (px) on Home after which the header gains its solid background. */
const SOLID_AFTER = 8;

/** "Confocal" focus style: 2px cyan outline with offset. */
const CF_FOCUS =
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cf-accent';

/** Header classes (the Home page's "Confocal" design, used on every route). */
const SKIN = {
  background: 'border-cf-line bg-cf-bg/[0.92] backdrop-blur-md',
  container: 'cf-container h-16 lg:h-[88px]',
  logo: 'h-9 w-auto lg:h-10',
  link: `rounded-md px-3 text-[14px] font-medium ${CF_FOCUS}`,
  linkActive: 'text-cf-accent',
  linkIdle: 'text-cf-text-2 hover:bg-white/[0.04] hover:text-cf-text',
  cta: `h-11 rounded-lg bg-cf-accent px-5 text-sm font-semibold text-cf-ink hover:bg-cf-accent-hover ${CF_FOCUS}`,
  menu: `rounded-lg border-cf-line-strong bg-cf-bg/40 hover:border-cf-accent/60 hover:bg-white/[0.04] ${CF_FOCUS}`,
  /* Same frame as the menu button. Below sm only the language name shows (no icon); from lg to
     xl, where the inline links leave the least room, only the icon (the name stays as its
     accessible text, and the title shows on hover). */
  language:
    'h-11 shrink-0 border border-cf-line-strong bg-cf-bg/40 px-3 text-sm text-cf-text-2 hover:border-cf-accent/60 hover:text-cf-text [&>svg]:hidden sm:[&>svg]:block lg:max-xl:w-11 lg:max-xl:px-0',
  languageLabel: 'lg:max-xl:sr-only',
} as const;

/** Links shown in the header bar from lg; the drawer below lg lists every item. */
const INLINE_ITEMS = MAIN_NAV_ITEMS.filter((item) => item.inline);

/** True once the page is scrolled past SOLID_AFTER. Only re-renders when the threshold is crossed. */
function useScrolledPast(threshold: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const update = () => setPast(window.scrollY > threshold);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);
  return past;
}

/**
 * Site header. Fixed, constant height (64px; 88px from lg).
 * Home: transparent over the hero, solid once scrolled. Inner pages: always solid, with a
 * spacer so page content starts below it. Only the background layer's opacity animates.
 * From lg the main links sit inline, centred in the bar; below lg every item is in a drawer.
 * In Arabic the bar mirrors (logo on the right) through the document direction.
 */
export const Navbar = memo(function Navbar() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const page = stripLocale(pathname);
  const isHome = page === '/';
  const scrolled = useScrolledPast(SOLID_AFTER);
  const solid = !isHome || scrolled;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  /* Close the drawer on navigation. */
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    hamburgerRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Background layer: the only thing that changes between states, via opacity. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 border-b transition-opacity duration-300 ease-out motion-reduce:transition-none ${SKIN.background} ${
            solid ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Logo and actions are equal-width flex columns (flex-1 basis-0), so the inline nav sits
            in the exact centre of the bar; when space is tight they keep their content width and
            the nav shifts slightly rather than overlapping. */}
        <div className={`relative flex items-center gap-4 ${SKIN.container}`}>
          <div className="flex flex-1 basis-0 items-center">
            {/* Logo */}
            <Link
              to="/"
              aria-label={t.nav.homeAria}
              className={`-m-1 shrink-0 rounded-md p-1 ${CF_FOCUS}`}
            >
              <img
                src="/images/tissuebioengineering-header.webp"
                alt=""
                width={966}
                height={289}
                className={SKIN.logo}
              />
            </Link>
          </div>

          {/* Inline links (lg+), centred */}
          <nav aria-label={t.nav.mainLabel} className="hidden shrink-0 lg:block">
            <ul className="flex items-center gap-1">
              {INLINE_ITEMS.map(({ key, path }) => {
                const isActive = isActivePath(page, path);
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      aria-current={isActive ? 'page' : undefined}
                      className={`inline-flex h-10 items-center whitespace-nowrap transition-colors duration-200 ${SKIN.link} ${
                        isActive ? SKIN.linkActive : SKIN.linkIdle
                      }`}
                    >
                      {t.nav.items[key].title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex flex-1 basis-0 items-center justify-end gap-2 sm:gap-3">
            <LanguageSwitcher className={SKIN.language} labelClassName={SKIN.languageLabel} />

            {/* Primary CTA (from sm; inside the drawer below that) */}
            <Link
              to="/consultation"
              className={`hidden items-center whitespace-nowrap transition-colors duration-200 sm:inline-flex ${SKIN.cta}`}
            >
              {t.common.bookConsultation}
            </Link>

            {/* Menu button (below lg): opens the drawer with every item */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-expanded={isDrawerOpen}
              aria-controls="site-drawer"
              aria-label={t.nav.openMenu}
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center border text-white transition-colors duration-200 lg:hidden ${SKIN.menu}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Inner pages start below the fixed header; the Home hero sits underneath it. */}
      {!isHome && <div aria-hidden="true" className="h-16 shrink-0 lg:h-[88px]" />}

      {/* Rendered outside <header> so the fixed drawer is positioned against the viewport. */}
      <MobileNavDrawer
        id="site-drawer"
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </>
  );
});
