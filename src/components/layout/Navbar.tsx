import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { NavDropdown } from './NavDropdown';

/** Scroll distance (px) on Home after which the header gains its solid background. */
const SOLID_AFTER = 8;

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0dc2ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05142D]';

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
 * Below lg the menu is a drawer; from lg it is a dropdown.
 */
export const Navbar = memo(function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const scrolled = useScrolledPast(SOLID_AFTER);
  const solid = !isHome || scrolled;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownWrapRef = useRef<HTMLDivElement>(null);

  /* Close both menus on navigation. */
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsDrawerOpen(false);
  }, [pathname]);

  /* Dropdown: close on outside pointer, on Escape (focus returns to the trigger). */
  useEffect(() => {
    if (!isDropdownOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!dropdownWrapRef.current?.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isDropdownOpen]);

  /* Dropdown: close when keyboard focus leaves it. */
  const handleDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);
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
          {/* Logo */}
          <Link
            to="/"
            aria-label="Tissue Bioengineering home"
            className={`-m-1 shrink-0 rounded-md p-1 ${FOCUS_RING}`}
          >
            <img
              src="/images/tissuebioengineering.webp"
              alt=""
              width={1000}
              height={328}
              className="h-9 w-auto lg:h-10"
            />
          </Link>

          <div className="flex items-center gap-3">
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

            {/* Desktop menu (lg+): disclosure button + dropdown panel */}
            <nav aria-label="Main" className="hidden lg:block">
              <div ref={dropdownWrapRef} className="relative" onBlur={handleDropdownBlur}>
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setIsDropdownOpen((open) => !open)}
                  aria-expanded={isDropdownOpen}
                  aria-controls="site-menu"
                  className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium text-white transition-colors duration-200 ${FOCUS_RING} ${
                    isDropdownOpen
                      ? 'border-white/30 bg-white/10'
                      : 'border-white/15 hover:border-white/30 hover:bg-white/[0.06]'
                  }`}
                >
                  <Menu className="h-4 w-4" aria-hidden="true" />
                  Menu
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 motion-reduce:transition-none ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <NavDropdown id="site-menu" isOpen={isDropdownOpen} onNavigate={closeDropdown} />
              </div>
            </nav>

            {/* Drawer trigger (below lg) */}
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
