import React from 'react';
import { StatisticCard } from '@/components/cards/StatisticCard';
import { Statistic } from '@/types';

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

export const StatisticsSection: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#0B1F3A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-sky bg-white/10 border border-white/20 uppercase mb-3 shadow-xs">
            Clinical Milestones
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Validated by Clinical Excellence
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed font-normal">
            Proven autologous cell compliance, zero rejection rates, and accelerated wound recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat) => (
            <StatisticCard key={stat.id} statistic={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};
