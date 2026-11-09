import React from 'react';
import { ResearchItem } from '@/types';
import { FileText, ExternalLink } from 'lucide-react';

/** Status colors, matching the Home page's research rows. */
const STATUS_STYLES: Record<ResearchItem['status'], string> = {
  'FDA Approved': 'border-emerald-400/40 text-emerald-300',
  'Clinical Trial': 'border-amber-300/40 text-amber-200',
  Published: 'border-cf-line-strong text-cf-text-2',
  'In Development': 'border-cf-line-strong text-cf-text-2',
};

/** One publication as a ledger entry: date and status column, then the paper. */
export const ResearchCard: React.FC<{ item: ResearchItem }> = ({ item }) => (
  <article
    aria-labelledby={`${item.slug}-title`}
    className="grid gap-5 border-b border-cf-line py-9 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-10 lg:py-11"
  >
    <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-start">
      <time dateTime={item.publicationDate} className="cf-mono text-[13px] text-cf-text-2">
        {item.publicationDate}
      </time>
      <span
        className={`rounded-md border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[item.status]}`}
      >
        {item.status}
      </span>
    </div>

    <div className="min-w-0">
      <p className="text-[13px] font-medium text-cf-accent">{item.category}</p>
      <h2
        id={`${item.slug}-title`}
        className="mt-2 max-w-3xl text-xl font-semibold leading-snug tracking-[-0.02em] text-cf-text sm:text-2xl"
      >
        {item.title}
      </h2>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-cf-muted">{item.abstract}</p>

      <div className="mt-6 flex flex-col gap-3 border-t border-cf-line pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="text-[13px] text-cf-muted">
          <strong className="font-medium text-cf-text-2">Authors:</strong> {item.authors.join(', ')}
        </p>
        {item.doi ? (
          <a
            href={`https://doi.org/${item.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cf-link min-h-11 shrink-0 text-sm"
          >
            DOI <span className="font-geist-mono text-xs font-normal">{item.doi}</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <span className="inline-flex shrink-0 items-center text-xs text-cf-muted">
            <FileText className="mr-1 h-3.5 w-3.5" aria-hidden="true" /> Abstract
          </span>
        )}
      </div>
    </div>
  </article>
);
