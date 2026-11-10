import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** Short label above the heading (the section's existing badge text). */
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Heading id, for aria-labelledby on the section. */
  id?: string;
  /** `split`: heading left, subtitle right (from lg). `stack`: subtitle under the heading. */
  layout?: 'split' | 'stack';
  className?: string;
}

/** Section heading for the Home page "Confocal" design: left-aligned, tight display type. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  id,
  layout = 'split',
  className,
}) => (
  <div
    className={cn(
      'mb-10 grid content-start gap-5 sm:mb-14',
      layout === 'split' &&
        'lg:mb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16',
      className
    )}
  >
    <div>
      {eyebrow && <p className="cf-eyebrow">{eyebrow}</p>}
      <h2 id={id} className="cf-h2 max-w-[18ch]">
        {title}
      </h2>
    </div>
    {subtitle && <p className="cf-lead max-w-xl lg:pb-1">{subtitle}</p>}
  </div>
);
