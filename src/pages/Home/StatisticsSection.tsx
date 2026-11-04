import React from 'react';
import { Activity, ShieldCheck, Zap, Dna } from 'lucide-react';
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

const iconMap: Record<string, React.ElementType> = {
  Activity,
  ShieldCheck,
  Zap,
  Dna,
};

const StatisticCard: React.FC<{ statistic: Statistic }> = ({ statistic }) => {
  const Icon = iconMap[statistic.iconName] || Activity;

  return (
    <div className="card-navy p-6 text-center border-t-4 border-t-navy hover:border-t-steel bg-white">
      <div className="w-10 h-10 rounded-xl bg-sky border border-steel/20 flex items-center justify-center text-navy mx-auto mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl md:text-4xl font-extrabold text-navy mb-1 tracking-tight">
        {statistic.value}
        <span className="text-steel font-bold">{statistic.unit}</span>
      </div>
      <div className="text-sm font-bold text-navy mb-1.5">{statistic.label}</div>
      <p className="text-xs text-text-secondary leading-relaxed">{statistic.description}</p>
    </div>
  );
};

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
