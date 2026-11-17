import React from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useMessages } from '@/i18n/context';
import { setHeroPrimaryVisible } from '@/lib/heroCta';
import { HeroVideo } from './HeroVideo';
import { homeMessages } from './messages';

/** Ticker speed, px per second (one list width per animation cycle). */
const TICKER_SPEED = 24;

/** True while `query` matches; follows changes while the page is open. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** False while the tab is hidden. */
function usePageVisible(): boolean {
  const [visible, setVisible] = React.useState(
    () => typeof document === 'undefined' || document.visibilityState !== 'hidden'
  );
  React.useEffect(() => {
    const update = () => setVisible(document.visibilityState !== 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}

/** True while any part of the element is within the viewport (plus `margin`). */
function useOnScreen(ref: React.RefObject<Element | null>, margin = '0px'): boolean {
  const [onScreen, setOnScreen] = React.useState(true);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return onScreen;
}

/** Fixed header height in px (--site-header-h), for observer margins. */
function headerHeightPx(): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--site-header-h')
    .trim();
  const n = parseFloat(value);
  if (!n) return 0;
  return value.endsWith('rem')
    ? n * parseFloat(getComputedStyle(document.documentElement).fontSize)
    : n;
}

/** One copy of the ticker list. The second copy (for the seamless loop) is hidden from assistive tech. */
const TickerList = React.forwardRef<HTMLUListElement, { items: string[]; hidden?: boolean }>(
  function TickerList({ items, hidden }, ref) {
    return (
      <ul ref={ref} className="flex h-full shrink-0 items-center" aria-hidden={hidden || undefined}>
        {items.map((item) => (
          <li key={item} className="hero-ticker__item">
            <span className="px-5 text-[13px] font-medium text-cf-muted lg:text-sm">{item}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-cf-accent" aria-hidden="true" />
          </li>
        ))}
      </ul>
    );
  }
);

/**
 * Home hero, "Specimen Plate": the two-line title and copy on the column grid, the helix clip in
 * a flat plate from the column 7 line to the viewport edge, and the areas-of-focus ticker on a
 * rail underneath. Layout and the plate's crop live in src/index.css (`.hero-*`).
 *
 * One play state for the clip and the ticker: the user's choice (the control at the rail's end;
 * starts paused under prefers-reduced-motion, and follows that preference if it changes), gated
 * by the hero being on screen in a visible tab. Both read the same `data-playing`, so they can
 * never drift apart. The clip itself is HeroVideo.tsx.
 */
export const Hero: React.FC = () => {
  const t = useMessages(homeMessages).hero;
  const sectionRef = React.useRef<HTMLElement>(null);
  const primaryRef = React.useRef<HTMLAnchorElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const desktop = useMediaQuery('(min-width: 1024px)');
  const [userPlaying, setUserPlaying] = React.useState(() => !reducedMotion);
  React.useEffect(() => {
    setUserPlaying(!reducedMotion);
  }, [reducedMotion]);
  const onScreen = useOnScreen(sectionRef, '80px 0px');
  const pageVisible = usePageVisible();
  const playing = userPlaying && onScreen && pageVisible;

  /* The header's Book Consultation is outlined while the primary button is in view (below the
     fixed header), filled once it has scrolled away. Reported before the first paint (the hero
     opens the page, so the button starts in view), then kept current by the observer. */
  React.useLayoutEffect(() => {
    const el = primaryRef.current;
    if (!el) return;
    setHeroPrimaryVisible(el.getBoundingClientRect().top < window.innerHeight);
    const io = new IntersectionObserver(([entry]) => setHeroPrimaryVisible(entry.isIntersecting), {
      rootMargin: `-${headerHeightPx()}px 0px 0px 0px`,
    });
    io.observe(el);
    return () => {
      io.disconnect();
      setHeroPrimaryVisible(false);
    };
  }, []);

  /* 24px/s whatever the list's width (it differs per language): one list width per cycle. */
  React.useEffect(() => {
    const list = listRef.current;
    const track = trackRef.current;
    if (!list || !track) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) track.style.setProperty('--hero-ticker-dur', `${width / TICKER_SPEED}s`);
    });
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero cf-cols relative bg-cf-bg text-cf-text"
      data-playing={playing}
      data-reduced-motion={reducedMotion || undefined}
      aria-labelledby="hero-heading"
    >
      <div className="hero-grid">
        {/* Always exactly two lines. */}
        <h1 id="hero-heading" className="hero-h1 text-cf-text">
          <span className="block whitespace-nowrap">{t.titleLine1}</span>
          <span className="block whitespace-nowrap">{t.titleLine2}</span>
        </h1>

        {/* The sculpture; the plate is caption-free. Never mirrored (see HeroVideo). */}
        <div className="hero-plate" role="img" aria-label={t.heroVideoLabel}>
          <HeroVideo
            variant={desktop ? 'desktop' : 'mobile'}
            playing={playing}
            reducedMotion={reducedMotion}
          />
        </div>

        <div className="hero-bottom">
          <p className="hero-lead text-cf-text">{t.lead}</p>
          <div className="hero-actions flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              ref={primaryRef}
              to="/research"
              className="cf-focus inline-flex h-[52px] items-center justify-center whitespace-nowrap rounded-lg bg-cf-text px-7 text-base font-medium text-cf-bg transition-colors duration-200 hover:bg-white motion-reduce:transition-none"
            >
              {t.exploreResearch}
            </Link>
            <Link
              to="/services"
              className="hero-text-link cf-focus inline-flex h-[52px] items-center gap-1.5 rounded-sm text-base font-medium text-cf-text"
            >
              {t.ourServices}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Rail: areas of focus, and the one control for the clip and the strip ── */}
      <div className="hero-rail">
        <div className="hero-ticker" role="region" aria-label={t.tickerLabel} tabIndex={0}>
          <div ref={trackRef} className="hero-ticker__track">
            <TickerList ref={listRef} items={t.ticker} />
            <TickerList items={t.ticker} hidden />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setUserPlaying((v) => !v)}
          aria-label={userPlaying ? t.pauseAnimation : t.playAnimation}
          className="cf-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] text-cf-text-2 transition-colors duration-150 hover:text-cf-text motion-reduce:transition-none"
          style={{ marginInlineEnd: 'calc(var(--cf-margin-eff) - 12px)' }}
        >
          {userPlaying ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
};
