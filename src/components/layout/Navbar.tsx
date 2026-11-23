import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { stripLocale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MenuToggle } from './MenuToggle';
import { HeaderLanguageSwitcher } from './LanguageSwitcher';
import { ArrowPillLink } from '@/components/common/ArrowPillLink';
import { MAIN_NAV_ITEMS, isActivePath } from './navData';

/** Scroll distance (px) after which the page counts as scrolled: the header gains its solid
 *  background over a hero (Home, inner pages), and from lg every page's header gains its bottom
 *  hairline. */
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
 * centre axis, the current page's label in the cyan accent (colour only, no other mark); on the other edge one
 * group of pills: the language control (the current language; the other one drops beneath it on
 * hover or keyboard focus) and Book Consultation (ArrowPillLink: label pill plus arrow disc).
 *
 * Below lg: logo (36px) and the icon-only menu button (44px; three lines that fold into a cross
 * while the menu is open). Every destination, the language control and Book Consultation are in
 * the menu (MobileNavDrawer), which slides in over the page from the inline end.
 *
 * Home and every inner page with a PageHero: transparent over the hero, solid once scrolled. On
 * inner pages the hero band's background runs up behind the bar; the transparency there is set in
 * index.css ("Site header over an inner-page hero", keyed on `data-scrolled` and the hero's
 * `.cf-page-hero`), so it is right from the first frame. Pages without a hero (404): always solid.
 * Inner pages keep a spacer (--site-header-h) so content starts below the header; PageHero pulls
 * itself up under the bar over it. Bottom hairline: below lg it shows whenever
 * the bar is solid; from lg only once the page is scrolled, on every page, so at the top of any
 * page the desktop header has no separator. No backdrop blur. In Arabic everything
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
      <header
        className="site-header fixed inset-x-0 top-0 z-50"
        data-scrolled={scrolled || undefined}
      >
        {/* Background layer: solid (no blur); fades in over a hero (Home, inner pages) once scrolled. */}
        <div
          aria-hidden="true"
          className={cn(
            'site-header__bg absolute inset-0 bg-cf-bg transition-opacity duration-300 ease-out motion-reduce:transition-none',
            solid ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* The height includes the hairline (border-box), so showing it never shifts the layout; it
            only changes colour. Below lg it shows once the bar is solid; from lg once scrolled. */}
        <div
          className={cn(
            'site-header__bar relative h-[var(--site-header-h)] border-b transition-colors duration-300',
            solid ? 'border-cf-line' : 'border-transparent',
            scrolled ? 'lg:border-cf-line' : 'lg:border-transparent'
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
                <ArrowPillLink to="/consultation">{t.common.bookConsultation}</ArrowPillLink>
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

      {/* Inner pages start below the fixed header (PageHero pulls itself up under it); the Home hero
          sits underneath it. */}
      {!isHome && <div aria-hidden="true" className="h-[var(--site-header-h)] shrink-0" />}

      {/* Rendered outside <header> so the fixed full-screen menu is never clipped by it. */}
      <MobileNavDrawer id="site-drawer" isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
});
