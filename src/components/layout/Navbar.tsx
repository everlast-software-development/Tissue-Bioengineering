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
import { HeaderCta } from './HeaderCta';
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
 * Site header, single row. Fixed and always fully visible; its height is --site-header-h in
 * src/index.css (64px, 72px from lg), including the bottom hairline.
 *
 * lg+ (designed with the Home hero; layout and styles in the "Site header, desktop" block of
 * src/index.css): the logo (40px) on the hero's content edge; the section links on the page's
 * centre axis, the current page marked by a small cyan dot under its label; on the other edge one
 * group of pills: the language control (the current language; the other one drops beneath it on
 * hover or keyboard focus) and Book Consultation (HeaderCta: label pill plus arrow disc, quiet
 * while the hero's own primary button is on screen, filled once it has scrolled away).
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
      <header className="site-header fixed inset-x-0 top-0 z-50">
        {/* Background layer: solid (no blur); fades in over the Home hero once scrolled. */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 bg-cf-bg transition-opacity duration-300 ease-out motion-reduce:transition-none',
            solid ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* The height includes the hairline (border-box), which only shows once the bar is solid:
            over the Home hero nothing draws a line across the sculpture. */}
        <div
          className={cn(
            'relative h-[var(--site-header-h)] border-b transition-colors duration-300',
            solid ? 'border-cf-line' : 'border-transparent'
          )}
        >
          <div className="site-header__row cf-container flex h-full items-center">
            {/* Start: logo, on the hero's content edge */}
            <div className="flex min-w-0 items-center">
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

            {/* Centre: section links (lg+) */}
            <nav aria-label={t.nav.mainLabel} className="hidden lg:block">
              <ul className="site-nav__list flex items-center">
                {INLINE_ITEMS.map(({ key, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      aria-current={isActivePath(page, path) ? 'page' : undefined}
                      className="site-nav__link cf-focus"
                    >
                      {t.nav.items[key].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* End: language + Book Consultation (lg+), menu button (below lg) */}
            <div className="ms-auto flex shrink-0 items-center ps-6 lg:ps-0">
              <div className="hidden items-center gap-2 lg:flex">
                <HeaderLanguageSwitcher />
                <HeaderCta filled={ctaFilled} />
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
