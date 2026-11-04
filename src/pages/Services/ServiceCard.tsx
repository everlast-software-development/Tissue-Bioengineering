import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Activity, ShieldCheck, Sparkles, Zap, Box, Dna } from 'lucide-react';
import { Service } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Flame,
  Activity,
  ShieldCheck,
  Sparkles,
  Zap,
  Box,
  Dna,
};

export const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const Icon = iconMap[service.iconName] || Dna;

  return (
    <div className="card-navy card-navy-hover p-6 flex flex-col justify-between group h-full bg-white">
      <div>
        <div className="relative overflow-hidden rounded-2xl mb-5 h-48">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60" />
          <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-border-light shadow-xs flex items-center justify-center text-navy group-hover:text-steel transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <span className="text-xs font-bold text-navy uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky border border-steel/20 inline-block mb-2">
          {service.category}
        </span>

        <h3 className="text-xl font-bold text-navy group-hover:text-steel transition-colors mt-1">
          {service.title}
        </h3>

        <p className="text-xs md:text-sm text-text-secondary mt-2 line-clamp-3 leading-relaxed">
          {service.shortDescription}
        </p>

        <div className="mt-4 pt-4 border-t border-border-light space-y-1.5">
          {service.features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center text-xs text-text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-steel mr-2 shrink-0" />
              {feat}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">
          Duration: <strong className="text-text-primary">{service.treatmentDuration}</strong>
        </span>
        <Link
          to={`/services#${service.slug}`}
          className="inline-flex items-center text-xs font-bold text-navy group-hover:text-steel transition-colors"
        >
          Explore Therapy <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
