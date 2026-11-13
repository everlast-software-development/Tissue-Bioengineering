import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Service } from '@/types';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { getArtDirection, type ArtDirection } from './serviceArtDirection';

const pad = (n: number) => String(n).padStart(2, '0');

interface ServiceProps {
  service: Service;
  /** Position in the full (unfiltered) list; sets the number, layout and image side. */
  index: number;
}

/* ── Shared parts ─────────────────────────────────────────────────────────── */

/** Number, category and the section's h2. */
const ServiceHeading: React.FC<ServiceProps & { featured?: boolean }> = ({
  service,
  index,
  featured,
}) => (
  <>
    <div className="flex items-center gap-4">
      <span className="cf-mono text-[13px] text-cf-text-2" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <span className="h-px w-10 bg-cf-line-strong" aria-hidden="true" />
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cf-accent">
        {service.category}
      </span>
    </div>
    <h2
      id={`${service.slug}-title`}
      className={cn(
        'mt-5 font-semibold text-cf-text [overflow-wrap:break-word] [text-wrap:balance]',
        featured
          ? 'leading-[1.04] tracking-[-0.04em] [font-size:clamp(1.875rem,1.2rem+3vw,3.5rem)] sm:mt-6'
          : 'leading-[1.1] tracking-[-0.035em] [font-size:clamp(1.75rem,1.3rem+1.6vw,2.625rem)]'
      )}
    >
      {service.title}
    </h2>
  </>
);

/** The therapy image in a graded frame (see .svc-media in index.css). */
const ServiceMedia: React.FC<
  ServiceProps & { art: ArtDirection; className?: string; sizes: string }
> = ({ service, index, art, className, sizes }) => {
  const Icon = ICONS[service.iconName];
  return (
    <div className={cn('svc-media', className)} data-grade={art.grade}>
      <img
        src={service.image}
        alt={service.imageAlt ?? service.title}
        width={art.width}
        height={art.height}
        sizes={sizes}
        loading={index === 0 ? undefined : 'lazy'}
        decoding="async"
        style={{ objectPosition: art.position }}
      />
      <span className="absolute left-4 top-4 z-[2] flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-cf-bg/80 text-cf-accent backdrop-blur-md">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span
        className="absolute bottom-4 left-4 z-[2] text-[11px] font-medium uppercase tracking-[0.18em] text-cf-text/80"
        aria-hidden="true"
      >
        Fig. {pad(index + 1)}
      </span>
    </div>
  );
};

const FeatureList: React.FC<{ features: string[]; className?: string }> = ({
  features,
  className,
}) => (
  <div className={className}>
    <h3 className="svc-label">Key Features</h3>
    <ul className="mt-4 border-t border-cf-line">
      {features.map((feat) => (
        <li
          key={feat}
          className="flex items-start gap-3.5 border-b border-cf-line py-3.5 text-base leading-snug text-cf-text"
        >
          <span
            className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cf-accent/35 bg-cf-accent/[0.08] text-cf-accent"
            aria-hidden="true"
          >
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
          {feat}
        </li>
      ))}
    </ul>
  </div>
);

/** Treatment duration and recovery as inline clinical metrics (values exactly as in the data). */
const ServiceMetrics: React.FC<{ service: Service; className?: string }> = ({
  service,
  className,
}) => (
  /* Subgrid rows keep both values level when a label wraps on narrow screens. */
  <dl className={cn('grid grid-cols-2 grid-rows-[auto_auto] gap-x-6 sm:gap-x-10', className)}>
    {(
      [
        ['Treatment Duration', service.treatmentDuration],
        ['Recovery Period', service.recoveryPeriod],
      ] as const
    ).map(([label, value]) => (
      <div
        key={label}
        className="relative row-span-2 grid min-w-0 grid-rows-subgrid border-t border-cf-line pt-4"
      >
        <span className="absolute -top-px left-0 h-px w-8 bg-cf-accent" aria-hidden="true" />
        <dt className="svc-label">{label}</dt>
        <dd className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-cf-text sm:text-xl">
          {value}
        </dd>
      </div>
    ))}
  </dl>
);

const ServiceCTA: React.FC<{ service: Service; featured?: boolean }> = ({ service, featured }) => (
  <Link
    to="/consultation"
    aria-describedby={`${service.slug}-title`}
    className={cn(
      'cf-btn group w-full sm:w-auto',
      featured ? 'cf-btn-primary min-h-[52px] px-7' : 'cf-btn-outline-accent'
    )}
  >
    Request Consultation
    <ArrowRight
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      aria-hidden="true"
    />
  </Link>
);

/* ── Layouts ──────────────────────────────────────────────────────────────── */

/**
 * Service 01: the page's editorial feature. Full-width heading with the lead beside it, a
 * cinematic image, then the details in two columns.
 */
const FeaturedService: React.FC<ServiceProps> = ({ service, index }) => {
  const art = getArtDirection(service);
  return (
    <article
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className="relative isolate scroll-mt-40 border-b border-cf-line bg-cf-raised"
    >
      {/* No overflow-hidden on the article: it would make it a scroll container, and Chrome then
          ignores its scroll-margin, hiding the title under the sticky filter on /services#<slug>. */}
      <div className="svc-glow-featured absolute inset-0 -z-10" aria-hidden="true" />

      <div className="cf-container py-16 sm:py-24 lg:py-28">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-16">
          <div className="min-w-0 lg:col-span-7">
            <ServiceHeading service={service} index={index} featured />
          </div>
          <p className="text-lg leading-[1.6] text-cf-text [text-wrap:pretty] sm:text-xl lg:col-span-5 lg:pb-1">
            {service.shortDescription}
          </p>
        </div>

        <ServiceMedia
          service={service}
          index={index}
          art={art}
          sizes="(min-width: 1432px) 1320px, 100vw"
          className="mt-10 aspect-[4/3] rounded-2xl sm:mt-14 sm:aspect-[16/9] lg:aspect-[21/9]"
        />

        <div className="mt-10 grid gap-12 sm:mt-14 lg:grid-cols-12 lg:gap-x-16">
          <div className="min-w-0 lg:col-span-5">
            <p className="text-base leading-[1.75] text-cf-text-2 [text-wrap:pretty] sm:text-[17px]">
              {service.fullDescription}
            </p>
            <ServiceMetrics service={service} className="mt-10" />
          </div>
          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <FeatureList features={service.features} />
            <div className="mt-10">
              <ServiceCTA service={service} featured />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/**
 * The one image frame shared by Services 02–07: 4:3 while stacked, square beside the text from
 * lg. At lg+ the square is ~65–75% of the text column's height and sticks while the text scrolls,
 * so it balances the column without dominating it. Per-image crops come from `art.position`.
 */
const EDITORIAL_FRAME = 'aspect-[4/3] lg:aspect-square';

/**
 * Services 02–07: image and text alternate sides (02 image right, 03 left, …). Below lg the
 * heading comes first, then the image, then the details.
 */
const EditorialService: React.FC<ServiceProps> = ({ service, index }) => {
  const art = getArtDirection(service);
  const imageRight = index % 2 === 1;
  const textCols = imageRight ? 'lg:col-span-6 lg:col-start-1' : 'lg:col-span-6 lg:col-start-7';
  const imageCols = imageRight ? 'lg:col-span-5 lg:col-start-8' : 'lg:col-span-5 lg:col-start-1';

  return (
    <article
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className={cn(
        'scroll-mt-40 border-b border-cf-line',
        imageRight ? 'bg-cf-bg' : 'bg-cf-raised/50'
      )}
    >
      <div className="cf-container grid gap-y-8 py-14 sm:gap-y-10 sm:py-20 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-7 lg:py-24 xl:gap-x-12">
        <header className={cn('min-w-0 lg:row-start-1', textCols)}>
          <ServiceHeading service={service} index={index} />
        </header>

        <figure className={cn('min-w-0 lg:row-span-2 lg:row-start-1', imageCols)}>
          <ServiceMedia
            service={service}
            index={index}
            art={art}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={cn('rounded-xl lg:sticky lg:top-44', EDITORIAL_FRAME)}
          />
        </figure>

        <div className={cn('min-w-0 lg:row-start-2', textCols)}>
          <p className="text-lg leading-[1.6] text-cf-text [text-wrap:pretty] sm:text-[19px]">
            {service.shortDescription}
          </p>
          <p className="mt-5 max-w-[62ch] text-base leading-[1.75] text-cf-text-2 [text-wrap:pretty] sm:text-[17px]">
            {service.fullDescription}
          </p>

          <FeatureList features={service.features} className="mt-10" />
          <ServiceMetrics service={service} className="mt-10" />

          <div className="mt-9">
            <ServiceCTA service={service} />
          </div>
        </div>
      </div>
    </article>
  );
};

/**
 * One therapy section. Service 01 is the featured layout; the rest alternate sides. The
 * section carries `id={slug}` so /services#<slug> links land on it.
 */
export const ServiceCard: React.FC<ServiceProps> = ({ service, index }) =>
  index === 0 ? (
    <FeaturedService service={service} index={index} />
  ) : (
    <EditorialService service={service} index={index} />
  );
