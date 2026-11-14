import React from 'react';
import { Statistic } from '@/types';
import { ICONS } from '@/lib/icons';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useMessages } from '@/i18n/context';
import { homeMessages } from './messages';

type StatKey = keyof (typeof homeMessages)['en']['stats']['items'];

/** Figures and icons; each label and description is in ./messages.ts (`stats.items`). */
const statistics: (Omit<Statistic, 'label' | 'description'> & { key: StatKey })[] = [
  { id: '1', key: 'grafts', value: '2,450', unit: '+', iconName: 'Activity' },
  { id: '2', key: 'rejection', value: '99.8', unit: '%', iconName: 'ShieldCheck' },
  { id: '3', key: 'closure', value: '3.5', unit: 'x', iconName: 'Zap' },
  { id: '4', key: 'inks', value: '18', unit: '', iconName: 'Dna' },
];

const StatisticCard: React.FC<{ statistic: Statistic }> = ({ statistic }) => {
  const Icon = ICONS[statistic.iconName];

  return (
    <li className="flex flex-col rounded-xl border border-cf-line-strong bg-cf-panel/80 p-6 backdrop-blur-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        {/* Figure and unit read left-to-right in every language (2,450+, 99.8%, 3.5x). */}
        <div
          dir="ltr"
          className="font-light leading-none tracking-[-0.05em] text-cf-text [font-size:clamp(3rem,2.2rem+2.4vw,3.75rem)]"
        >
          {statistic.value}
          <span className="text-cf-accent">{statistic.unit}</span>
        </div>
        <Icon className="mt-1 h-5 w-5 shrink-0 text-cf-muted" aria-hidden="true" />
      </div>
      <div className="mt-6 border-t border-cf-line pt-5 text-[15px] font-semibold text-cf-text">
        {statistic.label}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-cf-muted">{statistic.description}</p>
    </li>
  );
};

export const StatisticsSection: React.FC = () => {
  const t = useMessages(homeMessages).stats;
  return (
    <section
      className="cf-section relative isolate overflow-hidden bg-cf-bg"
      aria-labelledby="stats-heading"
    >
      <div className="cf-graticule absolute inset-0 -z-10" aria-hidden="true" />

      <div className="cf-container">
        <SectionHeader
          id="stats-heading"
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {statistics.map(({ key, ...stat }) => (
            <StatisticCard key={stat.id} statistic={{ ...stat, ...t.items[key] }} />
          ))}
        </ul>
      </div>
    </section>
  );
};
