import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { stripLocale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { MobileNavDrawer } from './MobileNavDrawer';
import { HeaderLanguageSwitcher } from './LanguageSwitcher';
import { MAIN_NAV_ITEMS, isActivePath } from './navData';

/** Scroll distance (px) on Home after which the header gains its solid background. */
const SOLID_AFTER = 8;

/** Section links shown in the bar from lg; the menu below lg lists every item. */
const INLINE_ITEMS = MAIN_NAV_ITEMS.filter((item) => item.inline);

/** True once the page is scrolled past `threshold`. Only re-renders when the threshold is crossed. */
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
 * Site header ("Clinical Editorial", single row). Fixed and always fully visible; its height is
 * --site-header-h in src/index.css (64px, 80px from lg), including the bottom hairline.
 *
 * lg+: three zones. The logo (40px) and the action group sit in two equal flexible columns, so
 * the section links are centred on the page whenever there is room, and simply sit between the
 * two when there is not (they never overlap). Actions: the language dropdown, then Book
 * Consultation (40px, the logo's height). The current page is marked by a 2px cyan rule laid on
 * the header's bottom hairline.
 *
 * Below lg: logo (36px) and the Menu button only. Every destination, the language control and
 * Book Consultation are in the menu (MobileNavDrawer).
 *
 * Home: transparent over the hero, solid once scrolled. Inner pages: always solid, with a spacer
 * (--site-header-h) so content starts below the header. No backdrop blur. In Arabic everything
 * mirrors through the document direction and logical properties.
 */
export const Navbar = memo(function Navbar() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const page = stripLocale(pathname);
  const isHome = page === '/';
  const scrolled = useScrolledPast(SOLID_AFTER);
  const solid = !isHome || scrolled;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /* Close the menu on navigation (including a language switch). */
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Background layer: solid (no blur); fades in over the Home hero once scrolled. */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 bg-cf-bg transition-opacity duration-300 ease-out motion-reduce:transition-none',
            solid ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* The height includes the hairline (border-box). */}
        <div
          className={cn(
            'relative h-16 border-b transition-colors duration-300 lg:h-20',
            solid ? 'border-cf-line' : 'border-white/[0.09]'
          )}
        >
          <div className="cf-container flex h-full items-center gap-8 xl:gap-10">
            {/* Start zone: logo */}
            <div className="flex min-w-0 flex-1 basis-0 items-center">
              <Link to="/" aria-label={t.nav.homeAria} className="cf-focus -m-1 shrink-0 rounded-sm p-1">
                <img
                  src="/images/tissuebioengineering-header.webp"
                  alt=""
                  width={966}
                  height={289}
                  className="h-9 w-auto lg:h-10"
                />
              </Link>
            </div>

            {/* Centre zone: section links (lg+) */}
            <nav aria-label={t.nav.mainLabel} className="hidden h-full shrink-0 lg:block">
              <ul className="flex h-full items-stretch gap-6 xl:gap-9">
                {INLINE_ITEMS.map(({ key, path }) => {
                  const isActive = isActivePath(page, path);
                  return (
                    <li key={path} className="relative">
                      <Link
                        to={path}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex h-full items-center whitespace-nowrap text-[15px] font-medium tracking-[-0.005em] transition-colors duration-150 rtl:text-[15.5px]',
                          'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cf-accent',
                          isActive ? 'text-cf-text' : 'text-cf-text-2 hover:text-cf-text'
                        )}
                      >
                        {t.nav.items[key].title}
                      </Link>
                      {/* Current page: 2px rule laid on the bottom hairline. */}
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
              </ul>
            </nav>

            {/* End zone: language + primary CTA (lg+), Menu button (below lg) */}
            <div className="flex flex-1 basis-0 items-center justify-end">
              <div className="hidden items-center gap-3 lg:flex xl:gap-4">
                <HeaderLanguageSwitcher />
                <Link
                  to="/consultation"
                  className="cf-focus inline-flex h-10 items-center whitespace-nowrap rounded-[2px] bg-cf-text px-5 text-[14px] font-semibold text-cf-bg transition-colors duration-150 hover:bg-white"
                >
                  {t.common.bookConsultation}
                </Link>
              </div>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-expanded={isDrawerOpen}
                aria-controls="site-drawer"
                aria-label={t.nav.openMenu}
                className="cf-focus inline-flex h-11 shrink-0 items-center rounded-[2px] border border-cf-line-strong px-4 text-[14px] font-medium text-cf-text transition-colors duration-150 hover:border-cf-muted lg:hidden"
              >
                {t.nav.menu}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Inner pages start below the fixed header; the Home hero sits underneath it. */}
      {!isHome && <div aria-hidden="true" className="h-[var(--site-header-h)] shrink-0" />}

      {/* Rendered outside <header> so the fixed full-screen menu is never clipped by it. */}
      <MobileNavDrawer id="site-drawer" isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
});
