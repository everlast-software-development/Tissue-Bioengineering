import React from 'react';
import { Statistic } from '@/types';
import { Activity, ShieldCheck, Zap, Dna } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Activity,
  ShieldCheck,
  Zap,
  Dna,
};

export const StatisticCard: React.FC<{ statistic: Statistic }> = ({ statistic }) => {
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
