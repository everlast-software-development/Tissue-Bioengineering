import React from 'react';
import { Link } from 'react-router-dom';

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

/** One copy of the ticker list. The second copy (for the seamless loop) is hidden from assistive tech. */
const TickerList: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
    {MARQUEE_ITEMS.map((item) => (
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
  return (
    <section
      className="relative isolate flex min-h-[max(100svh,680px)] flex-col overflow-hidden bg-cf-bg text-cf-text lg:min-h-[max(100svh,800px)]"
      aria-labelledby="hero-heading"
    >
      {/* ── Background: full-bleed cell render, focal point on the right ── */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src="/images/cell-matrix-bg.webp"
          alt=""
          width={1024}
          height={1024}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[62%_40%] lg:object-[70%_50%]"
        />
        <div className="hero-scrim absolute inset-0" />
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="cf-container flex flex-1 items-end pb-12 pt-32 sm:pb-16 lg:items-center lg:pb-20 lg:pt-[120px]">
        <div className="hero-rise w-full max-w-[820px]">
          <h1
            id="hero-heading"
            className="font-semibold leading-[0.98] tracking-[-0.04em] text-cf-text [font-size:clamp(2.625rem,7.4vw,5.25rem)]"
          >
            Tissue <span className="block text-cf-accent">Bioengineering</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-cf-text-2 sm:mt-8 sm:text-lg lg:text-[19px]">
            Advancing regenerative medicine through tissue engineering, biomaterials, stem cell
            technologies, and personalized regenerative therapies.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <Link to="/research" className="cf-btn cf-btn-light w-full sm:w-auto">
              Explore Research
            </Link>
            <Link to="/services" className="cf-btn cf-btn-outline w-full backdrop-blur-sm sm:w-auto">
              Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* ── Areas of focus: hairline band along the bottom of the hero ── */}
      <div className="relative border-y border-cf-line bg-cf-raised/90">
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
