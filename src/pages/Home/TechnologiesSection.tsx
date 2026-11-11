import React from 'react';
import { technologies, technologyImages } from '@/data/technologies';
import { Technology } from '@/types';
import { ICONS } from '@/lib/icons';
import { SectionHeader } from '@/components/common/SectionHeader';

const PlatformRow: React.FC<{ tech: Technology; flip: boolean }> = ({ tech, flip }) => {
  const Icon = ICONS[tech.iconName];
  const image = technologyImages[tech.id];

  return (
    <li className="relative grid lg:grid-cols-12 lg:items-center">
      {/* Image: full width below lg; 8 of 12 columns from lg, alternating sides */}
      <div
        className={`relative h-[280px] overflow-hidden rounded-xl border border-cf-line bg-cf-panel sm:h-[380px] lg:row-start-1 lg:h-[480px] ${
          flip ? 'lg:col-span-8 lg:col-start-5' : 'lg:col-span-8 lg:col-start-1'
        }`}
      >
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cf-bg/60 via-cf-bg/10 to-transparent" aria-hidden="true" />
      </div>

      {/* Spec panel: overlaps the image's bottom edge below lg, its inner edge from lg */}
      <div
        className={`relative z-10 mx-3 -mt-20 rounded-xl border border-cf-line-strong bg-cf-panel/95 p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-md sm:mx-8 sm:-mt-28 sm:p-8 lg:row-start-1 lg:mx-0 lg:mt-0 lg:p-9 ${
          flip ? 'lg:col-span-5 lg:col-start-1' : 'lg:col-span-5 lg:col-start-8'
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="text-[13px] font-medium text-cf-accent">{tech.badge}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cf-line-strong text-cf-accent">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        </div>

        <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-cf-text sm:text-[32px]">
          {tech.title}
        </h3>
        <p className="mt-2 text-sm font-medium text-cf-text-2">{tech.tagline}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-cf-muted">{tech.description}</p>

        {/* Spec grid: hairline-separated cells, values in mono */}
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-cf-line bg-cf-line">
          {Object.entries(tech.specifications).map(([key, val], i, all) => (
            <div
              key={key}
              className={`bg-cf-panel px-4 py-3 ${
                all.length % 2 === 1 && i === all.length - 1 ? 'col-span-2' : ''
              }`}
            >
              <dt className="text-xs text-cf-muted">{key}:</dt>
              <dd className="mt-1 text-[13px] text-cf-text">{val}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <span className="mb-2 block text-xs font-medium text-cf-muted">Key Applications:</span>
          <ul className="flex flex-wrap gap-1.5">
            {tech.applications.map((app) => (
              <li
                key={app}
                className="rounded-md border border-cf-line-strong px-2.5 py-1 text-xs text-cf-text-2"
              >
                {app}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};

export const TechnologiesSection: React.FC = () => {
  return (
    <section
      className="cf-section relative border-t border-cf-line bg-cf-bg"
      aria-labelledby="tech-heading"
    >
      <div className="cf-container">
        <SectionHeader
          id="tech-heading"
          eyebrow="Proprietary Tech"
          title="Engineered Hardware & Biomaterials"
          subtitle="Next-generation bioprinters, exosome bioreactors, and shear-thinning hydrogel platforms."
        />

        <ul className="space-y-16 sm:space-y-20 lg:space-y-24">
          {technologies.map((tech, i) => (
            <PlatformRow key={tech.id} tech={tech} flip={i % 2 === 1} />
          ))}
        </ul>
      </div>
    </section>
  );
};
