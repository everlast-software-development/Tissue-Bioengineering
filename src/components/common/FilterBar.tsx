import React from 'react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  /** Category options; an "All" option (value 'All') is always rendered first. */
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  allLabel: React.ReactNode;
  /** Number of items per option (and for 'All'), shown in mono beside the label. */
  counts?: Record<string, number>;
  /** Accessible name of the group. */
  label: string;
  /**
   * `row`: one hairline-ruled strip of tabs (scrolls sideways when it doesn't fit).
   * `rail`: a vertical list from lg (a scrolling strip below lg).
   */
  layout?: 'row' | 'rail';
  className?: string;
}

/** Category filter in the "Confocal" style. Buttons with aria-pressed; filtering stays in the page. */
export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  value,
  onChange,
  allLabel,
  counts,
  label,
  layout = 'row',
  className,
}) => {
  const rail = layout === 'rail';
  const items: { key: string; label: React.ReactNode }[] = [
    { key: 'All', label: allLabel },
    ...options.map((o) => ({ key: o, label: o })),
  ];

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'cf-no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8',
        rail
          ? 'lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0'
          : 'lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0',
        className
      )}
    >
      {items.map(({ key, label: text }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={cn(
              'cf-focus flex min-h-11 shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-lg border px-4 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none',
              active
                ? 'border-cf-accent/50 bg-cf-active text-cf-accent'
                : 'border-cf-line-strong text-cf-text-2 hover:border-cf-accent/40 hover:text-cf-text',
              rail &&
                'lg:min-h-12 lg:w-full lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-t lg:bg-transparent lg:px-0 lg:first:border-t-0',
              rail && active && 'lg:border-cf-line lg:bg-transparent',
              rail && !active && 'lg:border-cf-line lg:hover:border-cf-line'
            )}
          >
            <span className={cn(rail && 'lg:flex lg:items-center lg:gap-3')}>
              {rail && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden h-1.5 w-1.5 rounded-full lg:inline-block',
                    active ? 'bg-cf-accent' : 'bg-cf-line-strong'
                  )}
                />
              )}
              {text}
            </span>
            {counts && counts[key] !== undefined && (
              <span className={cn('cf-mono', active && 'text-cf-accent')}>
                {String(counts[key]).padStart(2, '0')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
