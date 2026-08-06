import React from 'react';
import { Technology } from '@/types';
import { Printer, Cpu, Layers } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Printer,
  Cpu,
  Layers,
};

export const TechnologyCard: React.FC<{ tech: Technology }> = ({ tech }) => {
  const Icon = iconMap[tech.iconName] || Cpu;

  return (
    <div className="card-navy card-navy-hover p-6 flex flex-col justify-between group bg-white">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-sky border border-steel/20 flex items-center justify-center text-navy group-hover:text-steel transition-colors">
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-50 text-navy border border-border-light">
            {tech.badge}
          </span>
        </div>

        <h3 className="text-xl font-bold text-navy group-hover:text-steel transition-colors">
          {tech.title}
        </h3>
        <p className="text-xs font-semibold text-steel mt-1">{tech.tagline}</p>

        <p className="text-xs text-text-secondary mt-3 leading-relaxed">{tech.description}</p>

        <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-border-light space-y-1.5 text-xs">
          {Object.entries(tech.specifications).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="text-text-muted font-medium">{key}:</span>
              <span className="text-text-primary font-bold">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border-light">
        <span className="text-xs font-semibold text-text-muted block mb-2">Key Applications:</span>
        <div className="flex flex-wrap gap-1.5">
          {tech.applications.map((app, i) => (
            <span
              key={i}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-text-secondary font-medium"
            >
              {app}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
