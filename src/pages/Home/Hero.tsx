import React from 'react';
import { Link } from '@/i18n/Link';
import { useMessages } from '@/i18n/context';
import { NeuroNoise } from '@/components/ui/neuro-noise';
import { homeMessages } from './messages';

/** One copy of the ticker list. The second copy (for the seamless loop) is hidden from assistive tech. */
const TickerList: React.FC<{ items: string[]; hidden?: boolean }> = ({ items, hidden }) => (
  <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
    {items.map((item) => (
      <li key={item} className="flex items-center">
        <span className="whitespace-nowrap px-6 text-[13px] font-medium text-cf-text-2 sm:px-8 sm:text-sm">
          {item}
        </span>
        <span className="h-4 w-px bg-cf-line-strong" aria-hidden="true" />
      </li>
    ))}
  </ul>
);

export const Hero: React.FC = () => {
  const t = useMessages(homeMessages).hero;
  const sectionRef = React.useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[max(100svh,680px)] flex-col overflow-hidden bg-cf-bg text-cf-text lg:min-h-[max(100svh,800px)]"
      aria-labelledby="hero-heading"
    >
      {/* ── Background: "Neuro Noise" shader in the site palette ─────────────────
          Adapted from Paper Shaders (Apache-2.0), components/ui/neuro-noise. Cursor ripple over
          the section. Stacking: shader → readability overlay + vignette → content. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <NeuroNoise className="absolute inset-0 opacity-10" trackRef={sectionRef} />
        <div className="hero-scrim pointer-events-none absolute inset-0" />
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      {/* The empty parts of the content layer let the pointer through. */}
      <div className="cf-container pointer-events-none flex flex-1 items-end pb-12 pt-32 sm:pb-16 lg:items-center lg:pb-20 lg:pt-[120px]">
        <div className="hero-rise pointer-events-auto w-full max-w-[820px]">
          <h1
            id="hero-heading"
            className="font-semibold leading-[0.98] tracking-[-0.04em] text-cf-text [font-size:clamp(2.625rem,7.4vw,5.25rem)]"
          >
            {t.titleLine1} <span className="block text-cf-accent">{t.titleLine2}</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-cf-text-2 sm:mt-8 sm:text-lg lg:text-[19px]">
            {t.lead}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <Link to="/research" className="cf-btn cf-btn-light w-full sm:w-auto">
              {t.exploreResearch}
            </Link>
            <Link
              to="/services"
              className="cf-btn cf-btn-outline w-full backdrop-blur-sm sm:w-auto"
            >
              {t.ourServices}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Areas of focus: hairline band along the bottom of the hero ── */}
      <div className="relative border-y border-cf-line bg-cf-raised/90">
        <div
          className="hero-ticker overflow-hidden py-4 sm:py-5"
          aria-label={t.tickerLabel}
          role="region"
        >
          <div className="hero-ticker__track flex w-max">
            <TickerList items={t.ticker} />
            <TickerList items={t.ticker} hidden />
          </div>
        </div>
      </div>
    </section>
  );
};
