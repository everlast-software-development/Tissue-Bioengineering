import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, FileText } from 'lucide-react';
import { researchItems } from '@/data/research';
import { ResearchItem } from '@/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ResearchStatusBadge } from '@/components/cards/ResearchCard';

/** One publication as a ruled row: metadata column, then title, abstract and authors. */
const ResearchRow: React.FC<{ item: ResearchItem }> = ({ item }) => (
  <li className="group grid gap-4 border-t border-cf-line py-8 first:border-t-0 sm:py-10 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:gap-12">
    <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-start">
      <span className="rounded-md bg-cf-active px-2.5 py-1 text-xs font-medium text-cf-accent">
        {item.category}
      </span>
      <span className="text-xs text-cf-muted">{item.publicationDate}</span>
    </div>

    <div className="min-w-0">
      <h3 className="text-xl font-semibold leading-snug tracking-[-0.015em] text-cf-text sm:text-[22px]">
        {item.title}
      </h3>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-cf-muted">{item.abstract}</p>
      <p className="mt-4 text-[13px] text-cf-muted">
        <strong className="font-medium text-cf-text-2">Authors:</strong> {item.authors.join(', ')}
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
          DOI <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <span className="inline-flex items-center text-xs text-cf-muted">
          <FileText className="mr-1 h-3.5 w-3.5" aria-hidden="true" /> Abstract
        </span>
      )}
    </div>
  </li>
);

export const ResearchHighlights: React.FC = () => {
  return (
    <section className="cf-section relative bg-cf-bg" aria-labelledby="research-heading">
      <div className="cf-container">
        <SectionHeader
          id="research-heading"
          eyebrow="Scientific Frontier"
          title="Research & Clinical Innovations"
          subtitle="Pioneering peer-reviewed discoveries across 3D Bioprinting, iPSC Stem Cells, Gene Editing, and Organ-on-Chip technology."
        />

        <ul className="border-y border-cf-line">
          {researchItems.slice(0, 3).map((item) => (
            <ResearchRow key={item.id} item={item} />
          ))}
        </ul>

        <div className="mt-10 sm:mt-12">
          <Link to="/research" className="cf-btn cf-btn-outline-accent">
            View All 8 Research Domains
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
