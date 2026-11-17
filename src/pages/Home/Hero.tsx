import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useMessages } from '@/i18n/context';
import { setHeroPrimaryVisible } from '@/lib/heroCta';
import { HeroVideo } from './HeroVideo';
import { homeMessages } from './messages';

/** Ticker speed, px per second (one list width per animation cycle). */
const TICKER_SPEED = 24;

/**
 * Pointer drift of the sculpture. The largest offset per axis is a share of the clip's box,
 * within px limits; it always stays under the box's inset in the plate (4% per side, see
 * `.hero-drift` in src/index.css), so the sculpture never leaves its area or reaches the header.
 * `tau` is the easing's time constant (about 95% of the way in 3 × tau).
 */
const DRIFT = {
  x: { share: 0.02, min: 6, max: 16 },
  y: { share: 0.014, min: 5, max: 14 },
  tau: 260,
};

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

/**
 * The sculpture's pointer drift: while a mouse moves over the hero, the clip's box eases a few
 * pixels toward the pointer, and back to rest when the pointer leaves. A plain 2D translation
 * written straight to the element (no React renders): the clip is never rotated, scaled, re-timed
 * or mirrored. Off for touch input, and whenever `enabled` is false (the transform is cleared).
 */
function usePointerDrift(
  sectionRef: React.RefObject<HTMLElement | null>,
  driftRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  React.useEffect(() => {
    const section = sectionRef.current;
    const drift = driftRef.current;
    if (!section || !drift) return;
    drift.style.transform = '';
    if (!enabled) return;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const k = 1 - Math.exp(-dt / DRIFT.tau);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      const settled = Math.abs(target.x - cur.x) < 0.02 && Math.abs(target.y - cur.y) < 0.02;
      if (settled) {
        cur.x = target.x;
        cur.y = target.y;
      }
      drift.style.transform =
        cur.x || cur.y ? `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)` : '';
      if (settled) {
        raf = 0;
        last = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    const run = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const range = (axis: { share: number; min: number; max: number }, size: number) =>
      Math.min(axis.max, Math.max(axis.min, size * axis.share));
    const unit = (v: number) => Math.max(-1, Math.min(1, v));

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const box = section.getBoundingClientRect();
      target.x = unit(((e.clientX - box.left) / box.width) * 2 - 1) * range(DRIFT.x, drift.offsetWidth);
      target.y = unit(((e.clientY - box.top) / box.height) * 2 - 1) * range(DRIFT.y, drift.offsetHeight);
      run();
    };
    const rest = () => {
      target.x = 0;
      target.y = 0;
      run();
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', rest);
    window.addEventListener('blur', rest);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', rest);
      window.removeEventListener('blur', rest);
      cancelAnimationFrame(raf);
      drift.style.transform = '';
    };
  }, [sectionRef, driftRef, enabled]);
}

/**
 * One copy of the ticker list: the items `repeat` times over, so that one copy is at least as wide
 * as the rail and the loop never shows a gap. The second copy (for the seamless loop) and the
 * repeats are hidden from assistive tech.
 */
const TickerList = React.forwardRef<
  HTMLUListElement,
  { items: string[]; repeat: number; hidden?: boolean }
>(function TickerList({ items, repeat, hidden }, ref) {
  return (
    <ul ref={ref} className="flex h-full shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: repeat }, (_, r) =>
        items.map((item) => (
          <li key={`${r}-${item}`} className="hero-ticker__item" aria-hidden={r > 0 || undefined}>
            <span className="px-5 text-[13px] font-medium text-cf-muted lg:text-sm">{item}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-cf-accent" aria-hidden="true" />
          </li>
        ))
      )}
    </ul>
  );
});

/**
 * Home hero, "Specimen Plate": the two-line title and copy as one block on the column grid, the
 * transparent helix clip centred in its own area (columns 7–12, from below the transparent header
 * down to the rail, on the same background as the copy), and the areas-of-focus ticker on a rail
 * underneath. The hero fills the viewport height. Layout and the clip's fit live in src/index.css
 * (`.hero-*`).
 *
 * Motion: the clip and the ticker run while the hero is on screen in a visible tab, and never
 * under prefers-reduced-motion (the still frame and a static, scrollable strip instead). There is
 * no playback control. The ticker runs against the reading direction: right to left in English,
 * left to right in Arabic. With a mouse (side by side, motion allowed), the sculpture drifts a few
 * pixels toward the pointer. The clip itself is HeroVideo.tsx.
 */
export const Hero: React.FC = () => {
  const t = useMessages(homeMessages).hero;
  const sectionRef = React.useRef<HTMLElement>(null);
  const primaryRef = React.useRef<HTMLAnchorElement>(null);
  const driftRef = React.useRef<HTMLDivElement>(null);
  const tickerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  /* The larger encode from tablet width up (the stacked tablet stage is up to ~570px tall). */
  const largeClip = useMediaQuery('(min-width: 768px)');
  const mouseDesktop = useMediaQuery('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
  const onScreen = useOnScreen(sectionRef, '80px 0px');
  const pageVisible = usePageVisible();
  const playing = !reducedMotion && onScreen && pageVisible;

  usePointerDrift(sectionRef, driftRef, mouseDesktop && !reducedMotion);

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

  /* Enough repeats for one copy to span the rail (so the loop never shows a gap), and 24px/s
     whatever the copy's width (it differs per language and viewport): one copy per cycle. */
  const [repeat, setRepeat] = React.useState(1);
  React.useEffect(() => {
    const list = listRef.current;
    const track = trackRef.current;
    const ticker = tickerRef.current;
    if (!list || !track || !ticker) return;
    const measure = () => {
      const width = list.getBoundingClientRect().width;
      if (width <= 0) return;
      const needed = Math.max(1, Math.ceil(ticker.clientWidth / (width / repeat)));
      if (needed !== repeat) setRepeat(needed);
      else track.style.setProperty('--hero-ticker-dur', `${width / TICKER_SPEED}s`);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    ro.observe(ticker);
    return () => ro.disconnect();
  }, [repeat]);

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

        {/* The sculpture, whole and caption-free on the hero's background. Never mirrored (see HeroVideo). */}
        <div className="hero-plate" role="img" aria-label={t.heroVideoLabel}>
          <div ref={driftRef} className="hero-drift">
            <HeroVideo
              variant={largeClip ? 'desktop' : 'mobile'}
              playing={playing}
              reducedMotion={reducedMotion}
            />
          </div>
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

      {/* ── Rail: areas of focus, running continuously (no control) ── */}
      <div className="hero-rail">
        <div
          ref={tickerRef}
          className="hero-ticker"
          role="region"
          aria-label={t.tickerLabel}
          tabIndex={0}
        >
          <div ref={trackRef} className="hero-ticker__track">
            <TickerList ref={listRef} items={t.ticker} repeat={repeat} />
            <TickerList items={t.ticker} repeat={repeat} hidden />
          </div>
        </div>
      </div>
    </section>
  );
};
