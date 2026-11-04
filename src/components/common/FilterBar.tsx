import React from 'react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  /** Category options; an "All" pill (value 'All') is always rendered first. */
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  allLabel: React.ReactNode;
  /** Extra classes for every pill (e.g. a padding override). */
  pillClassName?: string;
}

/** Centered row of category pills used to filter a card grid. */
export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  value,
  onChange,
  allLabel,
  pillClassName,
}) => {
  const pill = (active: boolean) =>
    cn(
      'px-4 py-2 rounded-2xl text-xs font-bold transition-all',
      pillClassName,
      active
        ? 'bg-navy text-white shadow-soft'
        : 'bg-white border border-border-light text-navy hover:border-navy'
    );

  return (
    <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
      <button onClick={() => onChange('All')} className={pill(value === 'All')}>
        {allLabel}
      </button>
      {options.map((option) => (
        <button key={option} onClick={() => onChange(option)} className={pill(value === option)}>
          {option}
        </button>
      ))}
    </div>
  );
};
