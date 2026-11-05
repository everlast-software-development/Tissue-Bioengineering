import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Dna } from 'lucide-react';

const MARQUEE_ITEMS = [
  'Skin Regeneration',
  'Biomaterial Scaffolds',
  'Stem Cell Therapy',
  '3D Bioprinting',
  'Cartilage Repair',
  'Bone Regeneration',
  'Burn Reconstruction',
  'Chronic Wound Healing',
  'Facial Tissue Engineering',
  'Personalized Regenerative Medicine',
  'Extracellular Matrix (ECM)',
  'Collagen Engineering',
  'Advanced Biomaterials',
  'Tissue Engineering',
];

const CTA_BASE =
  'group inline-flex h-12 sm:h-14 items-center justify-center gap-2.5 rounded-full px-7 text-[15px] sm:text-base font-semibold transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0dc2ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05142D]';

/** One copy of the ticker list. The second copy (for the seamless loop) is hidden from assistive tech. */
const TickerList: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
    {MARQUEE_ITEMS.map((item) => (
      <li key={item} className="flex items-center">
        <span className="px-6 sm:px-8 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-white/70">
          {item}
        </span>
        <span className="h-1 w-1 rounded-full bg-[#0dc2ff]/70" aria-hidden="true" />
      </li>
    ))}
  </ul>
);

export const Hero: React.FC = () => {
  return (
    <section
      className="relative isolate flex min-h-[max(100svh,640px)] flex-col overflow-hidden bg-[#05142D] text-white"
      aria-labelledby="hero-heading"
    >
      {/* ── Background: cellular scaffold focal image, masked into the navy ── */}
      <div className="hero-visual absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="/images/cell-matrix-bg.webp"
          alt=""
          width={1024}
          height={1024}
          fetchPriority="high"
          decoding="async"
          className="hero-visual__img absolute object-cover"
        />
        {/* Soft cyan bloom behind the cell cluster */}
        <div className="hero-visual__glow absolute" />
        {/* Top shade keeps the transparent Navbar legible */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#05142D]/80 to-transparent" />
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-start px-4 pt-32 pb-12 sm:px-6 sm:pt-40 lg:items-center lg:px-8 lg:pt-28 lg:pb-16">
        <div className="hero-rise w-full max-w-[34rem] lg:max-w-[38rem]">
          <h1
            id="hero-heading"
            className="font-bold text-white text-[clamp(2.75rem,11.5vw,4.5rem)] leading-[0.98] tracking-[-0.035em] lg:text-[clamp(4.25rem,6vw,5.25rem)]"
          >
            Tissue{' '}
            <span className="block bg-gradient-to-r from-[#0dc2ff] via-[#5fd6ff] to-sky-100 bg-clip-text pb-[0.08em] text-transparent">
              Bioengineering
            </span>
          </h1>

          <div className="mt-6 h-px w-16 bg-gradient-to-r from-[#0dc2ff] to-transparent sm:mt-8" aria-hidden="true" />

          <p className="mt-6 max-w-[30rem] text-base leading-relaxed text-slate-300 sm:mt-8 sm:text-lg">
            Advancing regenerative medicine through tissue engineering, biomaterials, stem cell
            technologies, and personalized regenerative therapies.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            <Link
              to="/research"
              className={`${CTA_BASE} bg-white text-navy shadow-[0_10px_30px_-12px_rgba(13,194,255,0.55)] hover:bg-[#0dc2ff]`}
            >
              Explore Research
              <ArrowRight
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              to="/services"
              className={`${CTA_BASE} border border-white/30 bg-[#05142D]/55 text-white backdrop-blur-sm hover:border-[#0dc2ff]/70 hover:bg-white/10`}
            >
              <Dna className="h-5 w-5 text-[#0dc2ff]" aria-hidden="true" />
              Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* ── Services ticker: deliberate bottom strip of the hero ──────── */}
      <div className="relative border-t border-white/10 bg-[#05142D]/70 backdrop-blur-sm">
        <div className="hero-ticker overflow-hidden py-4 sm:py-5" aria-label="Areas of focus" role="region">
          <div className="hero-ticker__track flex w-max">
            <TickerList />
            <TickerList hidden />
          </div>
        </div>
      </div>
    </section>
  );
};
