import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  const alignment = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('flex flex-col mb-12 max-w-3xl mx-auto', alignment[align], className)}>
      {badge && (
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-navy bg-sky border border-steel/20 uppercase mb-3 shadow-xs">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
