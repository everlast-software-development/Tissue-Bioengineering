import React from 'react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { useTechnologies } from '@/data/useLocalizedData';
import { useMessages } from '@/i18n/context';
import { TechnologyCard } from './TechnologyCard';
import { technologiesMessages } from './messages';

export const TechnologiesPage: React.FC = () => {
  const t = useMessages(technologiesMessages);
  const technologies = useTechnologies();
  return (
    <PageShell seo={t.seo} cta>
      <PageHero
        breadcrumb={[{ label: t.breadcrumb }]}
        eyebrow={t.eyebrow}
        title={t.title}
        lead={t.lead}
        cells
      >
        {/* Platform index: jumps to each datasheet below */}
        <nav aria-label={t.platformsLabel} className="mt-14 sm:mt-20">
          <ol className="grid border-y border-cf-line md:grid-cols-3">
            {technologies.map((tech, i) => (
              <li
                key={tech.id}
                className={i > 0 ? 'border-t border-cf-line md:border-s md:border-t-0' : ''}
              >
                <a
                  href={`#${tech.id}`}
                  className={`cf-focus group flex h-full flex-col gap-3 py-6 transition-colors md:px-6 lg:px-8 lg:py-8 ${
                    i === 0 ? 'md:ps-0 lg:ps-0' : ''
                  } ${i === technologies.length - 1 ? 'md:pe-0 lg:pe-0' : ''}`}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="cf-mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-xs font-medium text-cf-accent">{tech.badge}</span>
                  </span>
                  <span className="text-lg font-semibold leading-snug tracking-[-0.015em] text-cf-text transition-colors group-hover:text-cf-accent">
                    {tech.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHero>

      <div className="cf-container pb-14 sm:pb-24 lg:pb-32">
        {technologies.map((tech, i) => (
          <TechnologyCard key={tech.id} tech={tech} index={i} total={technologies.length} />
        ))}
      </div>
    </PageShell>
  );
};
