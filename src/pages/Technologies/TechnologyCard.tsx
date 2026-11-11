import React from 'react';
import { Technology } from '@/types';
import { technologyImages } from '@/data/technologies';
import { ICONS } from '@/lib/icons';

/**
 * One platform as a datasheet section: title block, image beside description and
 * applications, then a full-width specification strip. Carries `id={tech.id}` for the
 * Technologies page index.
 */
export const TechnologyCard: React.FC<{ tech: Technology; index: number; total: number }> = ({
  tech,
  index,
  total,
}) => {
  const Icon = ICONS[tech.iconName];
  const image = technologyImages[tech.id];
  const specs = Object.entries(tech.specifications);

  return (
    <section
      id={tech.id}
      aria-labelledby={`${tech.id}-title`}
      className="scroll-mt-24 border-t border-cf-line py-14 first:border-t-0 sm:py-20 lg:scroll-mt-28 lg:py-28"
    >
      {/* Title block */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-4">
            <span className="cf-mono">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span className="h-px w-8 bg-cf-line-strong" aria-hidden="true" />
            <span className="text-[13px] font-medium text-cf-accent">{tech.badge}</span>
          </div>
          <h2
            id={`${tech.id}-title`}
            className="mt-5 max-w-[20ch] text-[32px] font-semibold leading-[1.04] tracking-[-0.04em] text-cf-text sm:text-5xl"
          >
            {tech.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium text-cf-text-2 sm:text-lg">
            {tech.tagline}
          </p>
        </div>
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cf-line-strong text-cf-accent sm:flex">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      {/* Image + description / applications */}
      <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-12 lg:gap-14">
        {image && (
          <figure className="overflow-hidden rounded-xl border border-cf-line bg-cf-panel lg:col-span-7">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading={index === 0 ? undefined : 'lazy'}
              decoding="async"
              className="aspect-[3/2] h-full w-full object-cover"
            />
          </figure>
        )}

        <div className="flex flex-col lg:col-span-5">
          <p className="text-lg leading-relaxed text-cf-text-2">{tech.description}</p>

          <div className="mt-10 lg:mt-auto">
            <span className="mb-3 block text-xs font-medium text-cf-muted">Key Applications:</span>
            <ol className="border-t border-cf-line">
              {tech.applications.map((app, i) => (
                <li
                  key={app}
                  className="flex items-baseline gap-4 border-b border-cf-line py-3.5 text-[15px] text-cf-text"
                >
                  <span className="cf-mono" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {app}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Specification strip */}
      <dl
        className={`mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-cf-line bg-cf-line sm:mt-14 sm:grid-cols-2 ${
          specs.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
        }`}
      >
        {specs.map(([key, val]) => (
          <div key={key} className="bg-cf-raised px-6 py-6 sm:py-7">
            <dt className="text-xs text-cf-muted">{key}:</dt>
            <dd className="mt-3 text-lg leading-snug text-cf-text sm:text-xl">
              {val}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
