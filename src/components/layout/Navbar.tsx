import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { stripLocale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { useHeroPrimaryVisible } from '@/lib/heroCta';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MenuToggle } from './MenuToggle';
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
 * --site-header-h in src/index.css (64px, 72px from lg), including the bottom hairline.
 *
 * lg+: the logo (40px) on the outer margin, the section links starting on the column 7 line of
 * the site grid (the Home hero plate's inner edge; .site-header__lead in src/index.css gives way
 * when the links and actions need the room, so nothing ever overlaps), and the actions on the
 * other margin: the language dropdown, then Book Consultation (40px, the logo's height), which
 * is outlined while the hero's own primary button is on screen and filled once it has scrolled
 * away (same box in both states, only the colours change). The current page is marked by a 2px
 * cyan rule laid on the header's bottom hairline.
 *
 * Below lg: logo (36px) and the icon-only menu button (44px; three lines that fold into a cross
 * while the menu is open). Every destination, the language control and Book Consultation are in
 * the menu (MobileNavDrawer), which slides in over the page from the inline end.
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
  const ctaFilled = !useHeroPrimaryVisible();

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

        {/* The height includes the hairline (border-box), which only shows once the bar is solid:
            over the Home hero nothing draws a line across the sculpture. The bar is the grid
            container (.cf-cols) the lead cell measures the column 7 line against. */}
        <div
          className={cn(
            'cf-cols relative h-[var(--site-header-h)] border-b transition-colors duration-300',
            solid ? 'border-cf-line' : 'border-transparent'
          )}
        >
          <div className="cf-container flex h-full items-center">
            {/* Start zone: logo; from lg the cell reaches the column 7 line */}
            <div className="site-header__lead flex min-w-0 items-center">
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
              <ul className="flex h-full items-stretch gap-6">
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
            <div className="ms-auto flex shrink-0 items-center ps-6">
              <div className="hidden items-center gap-3 lg:flex xl:gap-4">
                <HeaderLanguageSwitcher />
                <Link
                  to="/consultation"
                  data-filled={ctaFilled || undefined}
                  className={cn(
                    'cf-focus inline-flex h-10 items-center whitespace-nowrap rounded-[2px] border border-cf-text px-5 text-[14px] font-semibold transition-[background-color,color] duration-200 motion-reduce:transition-none',
                    ctaFilled
                      ? 'bg-cf-text text-cf-bg hover:bg-white'
                      : 'bg-transparent text-cf-text hover:bg-cf-text/10'
                  )}
                >
                  {t.common.bookConsultation}
                </Link>
              </div>

              {/* Opens the menu; while it is open the menu's own close button sits exactly on top. */}
              <MenuToggle
                ref={menuButtonRef}
                open={isDrawerOpen}
                onClick={() => (isDrawerOpen ? closeDrawer() : setIsDrawerOpen(true))}
                aria-expanded={isDrawerOpen}
                aria-controls="site-drawer"
                aria-label={t.nav.openMenu}
                className="lg:hidden"
              />
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
