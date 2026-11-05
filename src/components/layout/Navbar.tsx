import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { MAIN_NAV_ITEMS, isActivePath } from './navData';

/** Scroll distance (px) on Home after which the header gains its solid background. */
const SOLID_AFTER = 8;

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0dc2ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05142D]';

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
 * Site header. Fixed, constant height (64px, 72px from lg).
 * Home: transparent over the hero, solid once scrolled. Inner pages: always solid, with a
 * spacer so page content starts below it. Only the background layer's opacity animates.
 * From lg the main links sit inline next to the logo; below lg every item is in a drawer.
 */
export const Navbar = memo(function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
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
          className={`absolute inset-0 border-b border-white/[0.08] bg-[#05142D] transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            solid ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
          <div className="flex min-w-0 items-center gap-8">
            {/* Logo */}
            <Link
              to="/"
              aria-label="Tissue Bioengineering home"
              className={`-m-1 shrink-0 rounded-md p-1 ${FOCUS_RING}`}
            >
              <img
                src="/images/tissuebioengineering-header.webp"
                alt=""
                width={966}
                height={289}
                className="h-9 w-auto lg:h-10"
              />
            </Link>

            {/* Inline links (lg+) */}
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {INLINE_ITEMS.map(({ title, path }) => {
                  const isActive = isActivePath(pathname, path);
                  return (
                    <li key={path}>
                      <Link
                        to={path}
                        aria-current={isActive ? 'page' : undefined}
                        className={`inline-flex h-10 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors duration-200 ${FOCUS_RING} ${
                          isActive
                            ? 'text-[#0dc2ff]'
                            : 'text-white/80 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        {title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Primary CTA (from sm; inside the drawer below that) */}
            <Link
              to="/consultation"
              className={`group hidden h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-navy transition-colors duration-200 hover:bg-[#0dc2ff] sm:inline-flex ${FOCUS_RING}`}
            >
              Book Consultation
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>

            {/* Menu button (below lg): opens the drawer with every item */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-expanded={isDrawerOpen}
              aria-controls="site-drawer"
              aria-label="Open menu"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.06] lg:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Inner pages start below the fixed header; the Home hero sits underneath it. */}
      {!isHome && <div aria-hidden="true" className="h-16 shrink-0 lg:h-[72px]" />}

      {/* Rendered outside <header> so the fixed drawer is positioned against the viewport. */}
      <MobileNavDrawer id="site-drawer" isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
});
