import React from 'react';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';
import { cn } from '@/lib/utils';
import { CellField } from './CellField';

interface Crumb {
  label: string;
  /** Omit for the current page. */
  path?: string;
}

/** Breadcrumb trail, always starting at Home. The last item is the current page. */
const Breadcrumb: React.FC<{ items: Crumb[]; className?: string }> = ({ items, className }) => {
  const { t } = useI18n();
  return (
    <nav aria-label={t.common.breadcrumb} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-cf-muted">
        {[{ label: t.common.breadcrumbHome, path: '/' }, ...items].map((item, i, all) => {
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
};

/**
 * The band behind every inner-page hero, from the very top of the page (behind the transparent
 * header) down through the breadcrumb and title: the ambient light (index.css,
 * `.cf-amb--page-hero`), the Home hero's fine dot texture and the CellField texture, weighted to the
 * right of the copy (left in Arabic). Decorative only. The cells layer has a fixed size, so the
 * pattern is identical on every page at a given width.
 */
const HeroBackdrop: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
    <div className="cf-amb-fill cf-amb--page-hero absolute inset-0" />
    <div className="cf-hero-dots absolute inset-0" />
    <CellField className="cf-hero-cells absolute end-0 top-0 text-cf-accent" />
  </div>
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
  className?: string;
  titleClassName?: string;
  /** Overrides for the title/lead grid (e.g. column template or vertical alignment). */
  gridClassName?: string;
  /** Overrides for the lead column wrapper. */
  leadClassName?: string;
}

/**
 * Inner-page header in the Home "Confocal" style: breadcrumb, eyebrow, display title, lead, over
 * the shared HeroBackdrop band (every inner page gets the same one).
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
  className,
  titleClassName,
  gridClassName,
  leadClassName,
}) => (
  <section
    /* Pulled up under the fixed header (over the layout's spacer, so nothing below moves), with
       the header height added back to the top padding: the band starts at the top of the page,
       behind the header, and the breadcrumb stays where it was. `.cf-page-hero` also tells the
       header to stay transparent over it until the page scrolls (index.css). */
    className={cn(
      'cf-page-hero relative isolate -mt-[var(--site-header-h)] overflow-hidden border-b border-cf-line',
      className
    )}
    aria-labelledby="page-title"
  >
    <HeroBackdrop />

    <div className="cf-container pb-14 pt-[calc(var(--site-header-h)+2rem)] sm:pb-20 sm:pt-[calc(var(--site-header-h)+2.5rem)] lg:pb-24 lg:pt-[calc(var(--site-header-h)+3rem)]">
      <Breadcrumb items={breadcrumb} />

      <div
        className={cn(
          'mt-12 grid gap-8 sm:mt-16 lg:mt-20',
          layout === 'split' &&
            'lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16',
          gridClassName
        )}
      >
        <div className="cf-fade">
          {eyebrow && <p className="cf-eyebrow">{eyebrow}</p>}
          <h1 id="page-title" className={cn('cf-h1 max-w-[16ch]', titleClassName)}>
            {title}
          </h1>
        </div>

        {(lead || aside) && (
          <div className={cn('cf-fade', layout === 'stack' && 'max-w-2xl', leadClassName)}>
            {lead && <p className="cf-lead max-w-xl lg:text-lg">{lead}</p>}
            {aside}
          </div>
        )}
      </div>

      {children}
    </div>
  </section>
);
