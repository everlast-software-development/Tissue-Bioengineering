import React from 'react';
import { ArrowRight, ExternalLink, FileText } from 'lucide-react';
import { useResearchItems } from '@/data/useLocalizedData';
import { ResearchItem } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ResearchStatusBadge } from '@/components/cards/ResearchCard';
import { Ltr } from '@/components/common/Ltr';
import { Link } from '@/i18n/Link';
import { useI18n, useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

/** One publication as a ruled row: metadata column, then title, abstract and authors. */
const ResearchRow: React.FC<{ item: ResearchItem }> = ({ item }) => {
  const { t } = useI18n();
  return (
    <li className="group grid gap-4 border-t border-cf-line py-8 first:border-t-0 sm:py-10 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:gap-12">
      <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-start">
        <span className="rounded-md bg-cf-active px-2.5 py-1 text-xs font-medium text-cf-accent">
          {t.categories.research[item.category]}
        </span>
        <Ltr className="text-xs text-cf-muted">{item.publicationDate}</Ltr>
      </div>

      <div className="min-w-0">
        <h3 className="text-xl font-semibold leading-snug tracking-[-0.015em] text-cf-text sm:text-[22px]">
          {item.title}
        </h3>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-cf-muted">{item.abstract}</p>
        <p className="mt-4 text-[13px] text-cf-muted">
          <strong className="font-medium text-cf-text-2">{t.common.authors}</strong>{' '}
          {item.authors.join(t.common.listSeparator)}
        </p>
      </div>

      <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:justify-between">
        <ResearchStatusBadge status={item.status} />
        {item.doi ? (
          <a
            href={`https://doi.org/${item.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cf-link min-h-11 text-sm"
          >
            DOI <ExternalLink className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
            <span className="sr-only">{t.common.opensInNewTab}</span>
          </a>
        ) : (
          <span className="inline-flex items-center text-xs text-cf-muted">
            <FileText className="me-1 h-3.5 w-3.5" aria-hidden="true" /> {t.common.abstract}
          </span>
        )}
      </div>
    </li>
  );
};

export const ResearchHighlights: React.FC = () => {
  const t = useMessages(homeMessages).research;
  const researchItems = useResearchItems();
  return (
    <section className="cf-section relative bg-cf-bg" aria-labelledby="research-heading">
      <div className="cf-container">
        <SectionHeader
          id="research-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />

        <ul className="border-y border-cf-line">
          {researchItems.slice(0, 3).map((item) => (
            <ResearchRow key={item.id} item={item} />
          ))}
        </ul>

        <div className="mt-10 sm:mt-12">
          <Link to="/research" className="cf-btn cf-btn-outline-accent">
            {t.viewAll}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
