import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/** Back-to-Top appears once the page is scrolled past this fraction of its scrollable height. */
const BACK_TO_TOP_AFTER = 0.2;

/**
 * Top scroll-progress bar + floating Back-to-Top button.
 * Kept in its own component so scrolling never re-renders the layout, page or footer:
 * the bar is written straight to the DOM as a compositor-only transform, and React state
 * changes only when the Back-to-Top threshold is crossed.
 */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const shownRef = useRef(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const update = useCallback(() => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    const show = progress > BACK_TO_TOP_AFTER;
    if (show !== shownRef.current) {
      shownRef.current = show;
      setShowBackToTop(show);
    }
  }, []);

  // React detaches refs while a lazy route suspends; re-sync when the bar is re-attached,
  // since the scroll back to the top may have happened while it was detached.
  const attachBar = useCallback(
    (el: HTMLDivElement | null) => {
      barRef.current = el;
      if (el) update();
    },
    [update]
  );

  useEffect(() => {
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [update]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div
        ref={attachBar}
        className="fixed top-0 left-0 right-0 z-[60] origin-left h-0.5 bg-cf-accent"
        style={{ transform: 'scaleX(0)' }}
      />

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-lg border border-cf-line-strong bg-cf-panel text-cf-text shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)] transition-colors duration-200 hover:border-cf-accent/60 hover:text-cf-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cf-accent"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* After the footer so Back-to-Top stays last in tab order; the bar is fixed, z-[60]. */}
      <ScrollProgress />
    </div>
  );
};
