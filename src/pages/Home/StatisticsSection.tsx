import React from 'react';
import { Activity, ShieldCheck, Zap, Dna } from 'lucide-react';
import { Statistic } from '@/types';
import { SectionHeader } from './SectionHeader';

const statistics: Statistic[] = [
  {
    id: '1',
    label: 'Successful Bio-Grafts',
    value: '2,450',
    unit: '+',
    description: 'Living tissue matrix grafts implanted across burn, trauma, and ulcer cases.',
    iconName: 'Activity',
  },
  {
    id: '2',
    label: 'Zero Graft Rejection',
    value: '99.8',
    unit: '%',
    description: 'Immune compliance rate achieved via autologous stem cell harvesting.',
    iconName: 'ShieldCheck',
  },
  {
    id: '3',
    label: 'Clinical Closure Speed',
    value: '3.5',
    unit: 'x',
    description: 'Accelerated microvascular formation compared to conventional dressings.',
    iconName: 'Zap',
  },
  {
    id: '4',
    label: 'Patented Bio-Inks',
    value: '18',
    unit: '',
    description: 'Proprietary extracellular formulations protected under international patents.',
    iconName: 'Dna',
  },
];

const iconMap: Record<string, React.ElementType> = {
  Activity,
  ShieldCheck,
  Zap,
  Dna,
};

const StatisticCard: React.FC<{ statistic: Statistic }> = ({ statistic }) => {
  const Icon = iconMap[statistic.iconName] || Activity;

  return (
    <li className="flex flex-col rounded-xl border border-cf-line-strong bg-cf-panel/80 p-6 backdrop-blur-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="font-light leading-none tracking-[-0.05em] text-cf-text [font-size:clamp(3rem,2.2rem+2.4vw,3.75rem)]">
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
  return (
    <section
      className="cf-section relative isolate overflow-hidden bg-cf-bg"
      aria-labelledby="stats-heading"
    >
      <div className="cf-graticule absolute inset-0 -z-10" aria-hidden="true" />

      <div className="cf-container">
        <SectionHeader
          id="stats-heading"
          eyebrow="Clinical Milestones"
          title="Validated by Clinical Excellence"
          subtitle="Proven autologous cell compliance, zero rejection rates, and accelerated wound recovery."
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {statistics.map((stat) => (
            <StatisticCard key={stat.id} statistic={stat} />
          ))}
        </ul>
      </div>
    </section>
  );
};
