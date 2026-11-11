import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Crumb {
  label: string;
  /** Omit for the current page. */
  path?: string;
}

/** Breadcrumb trail, always starting at Home. The last item is the current page. */
const Breadcrumb: React.FC<{ items: Crumb[]; className?: string }> = ({
  items,
  className,
}) => (
  <nav aria-label="Breadcrumb" className={className}>
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-cf-muted">
      {[{ label: 'Home', path: '/' }, ...items].map((item, i, all) => {
        const last = i === all.length - 1;
        return (
          <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-2">
            {item.path && !last ? (
              <Link
                to={item.path}
                className="cf-focus inline-flex min-h-8 items-center rounded-sm transition-colors hover:text-cf-accent"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current={last ? 'page' : undefined} className="truncate text-cf-text-2">
                {item.label}
              </span>
            )}
            {!last && (
              <span aria-hidden="true" className="text-cf-line-strong">
                /
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

interface PageHeroProps {
  breadcrumb: Crumb[];
  /** Short label above the title (the page's existing badge text). */
  eyebrow?: React.ReactNode;
  /** The page's h1. */
  title: React.ReactNode;
  /** Intro paragraph. In `split` it sits in the right column, in `stack` under the title. */
  lead?: React.ReactNode;
  /** `split`: title left, lead (and aside) right from lg. `stack`: one column. */
  layout?: 'split' | 'stack';
  /** Extra content in the lead column (split) or under the lead (stack). */
  aside?: React.ReactNode;
  /** Full-width content under the title block, inside the container (indices, media, meta). */
  children?: React.ReactNode;
  /** Microscope-reticle grid behind the hero. */
  graticule?: boolean;
  className?: string;
  titleClassName?: string;
}

/**
 * Inner-page header in the Home "Confocal" style: breadcrumb, eyebrow, display title, lead.
 * Pages vary it with `layout`, `aside` and `children` so each keeps its own character.
 */
export const PageHero: React.FC<PageHeroProps> = ({
  breadcrumb,
  eyebrow,
  title,
  lead,
  layout = 'split',
  aside,
  children,
  graticule = false,
  className,
  titleClassName,
}) => (
  <section
    className={cn('relative isolate overflow-hidden border-b border-cf-line', className)}
    aria-labelledby="page-title"
  >
    {graticule && <div className="cf-graticule absolute inset-0 -z-10" aria-hidden="true" />}

    <div className="cf-container pb-14 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
      <Breadcrumb items={breadcrumb} />

      <div
        className={cn(
          'mt-12 grid gap-8 sm:mt-16 lg:mt-20',
          layout === 'split' &&
            'lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16'
        )}
      >
        <div className="cf-fade">
          {eyebrow && <p className="cf-eyebrow">{eyebrow}</p>}
          <h1 id="page-title" className={cn('cf-h1 max-w-[16ch]', titleClassName)}>
            {title}
          </h1>
        </div>

        {(lead || aside) && (
          <div className={cn('cf-fade', layout === 'stack' && 'max-w-2xl')}>
            {lead && <p className="cf-lead max-w-xl lg:text-lg">{lead}</p>}
            {aside}
          </div>
        )}
      </div>

      {children}
    </div>
  </section>
);
