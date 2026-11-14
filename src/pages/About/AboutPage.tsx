import React from 'react';
import { Dna, Award } from 'lucide-react';
import { PageShell } from '@/components/common/PageShell';
import { PageHero } from '@/components/common/PageHero';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useMessages } from '@/i18n/context';
import { aboutMessages } from './messages';

/** "Dr. Elena Rostova, PhD" -> "ER": drops the leading title and trailing credentials. */
const getInitials = (name: string) =>
  name
    .split(',')[0]
    .replace(/^(Dr|Prof)\.\s+/, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('');

const FACTS = [
  { key: 'cleanrooms', icon: Dna },
  { key: 'patents', icon: Award },
] as const;

/*
 * Only authentic, approved headshots belong in `img`; until one is supplied, the roster shows
 * initials. `englishName` sets the monogram (Latin initials in every language); the displayed
 * name, role and bio come from ./messages.ts.
 */
const LEADERSHIP: { key: 'thorne' | 'rostova' | 'chen'; englishName: string; img?: string }[] = [
  { key: 'thorne', englishName: 'Dr. Aris Thorne, MD, PhD' },
  { key: 'rostova', englishName: 'Dr. Elena Rostova, PhD' },
  { key: 'chen', englishName: 'Dr. Michael Chen, MD' },
];

export const AboutPage: React.FC = () => {
  const t = useMessages(aboutMessages);
  return (
    <PageShell seo={t.seo} cta>
      <PageHero
        breadcrumb={[{ label: t.breadcrumb }]}
        eyebrow={t.eyebrow}
        title={
          <>
            {t.titleBefore}
            <span className="text-cf-accent">{t.titleAccent}</span>
          </>
        }
        titleClassName="max-w-[17ch]"
        cells
        lead={t.lead}
      >
        <figure className="mt-14 overflow-hidden rounded-xl border border-cf-line bg-cf-panel sm:mt-20">
          <img
            src="/images/cell-culture-biosafety-cabinet.webp"
            alt={t.heroImageAlt}
            width={1600}
            height={1066}
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/8] lg:aspect-[21/9]"
          />
        </figure>
      </PageHero>

      {/* Benchtop & bedside: essay column with the two facility facts */}
      <section className="cf-section border-b border-cf-line bg-cf-raised" aria-labelledby="bridge-heading">
        <div className="cf-container grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <h2 id="bridge-heading" className="cf-h2 max-w-[14ch]">
            {t.bridgeTitle}
          </h2>

          <div>
            <p className="text-lg leading-relaxed text-cf-text-2 sm:text-xl sm:leading-relaxed">
              {t.bridgeBody}
            </p>

            <dl className="mt-12 grid border-y border-cf-line sm:grid-cols-2">
              {FACTS.map(({ key, icon: Icon }, i) => (
                <div
                  key={key}
                  className={`flex items-start gap-5 py-8 ${
                    i === 0 ? 'border-b border-cf-line sm:border-b-0 sm:border-e sm:pe-8' : 'sm:ps-8'
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cf-accent/40 text-cf-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col-reverse">
                    <dt className="mt-2 text-sm text-cf-muted">{t.facts[key].label}</dt>
                    <dd className="text-[28px] font-light leading-none tracking-[-0.04em] text-cf-text sm:text-[34px]">
                      {t.facts[key].value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Leadership roster: ruled columns, initials monograms */}
      <section className="cf-section" aria-labelledby="leadership-heading">
        <div className="cf-container">
          <SectionHeader
            id="leadership-heading"
            eyebrow={t.leadership.eyebrow}
            title={t.leadership.title}
            subtitle={t.leadership.subtitle}
          />

          <ul className="grid border-t border-cf-line md:grid-cols-3">
            {LEADERSHIP.map((member, i) => {
              const text = t.leaders[member.key];
              return (
                <li
                  key={member.key}
                  className={`border-cf-line py-10 md:px-8 md:first:ps-0 md:last:pe-0 lg:px-10 ${
                    i > 0 ? 'border-t md:border-s md:border-t-0' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {member.img ? (
                      <img
                        src={member.img}
                        alt={text.name}
                        loading="lazy"
                        decoding="async"
                        className="h-16 w-16 rounded-lg border border-cf-line-strong object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-16 w-16 items-center justify-center rounded-lg border border-cf-line-strong bg-cf-panel text-lg text-cf-accent"
                      >
                        {getInitials(member.englishName)}
                      </span>
                    )}
                    <span className="cf-mono" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.015em] text-cf-text">
                    {text.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-cf-accent">{text.role}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-cf-muted">{text.bio}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </PageShell>
  );
};
