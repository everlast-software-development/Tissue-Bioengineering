import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { cn } from '@/lib/utils';

type ArrowPillLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  /** `md` 40px (header), `lg` 52px (hero). */
  size?: 'md' | 'lg';
};

/**
 * The Book Consultation look: a light label pill with a cyan arrow disc attached. On hover or
 * keyboard focus the label slowly turns the disc's cyan and the arrow slides out through the disc
 * while a second one slides in after it; in Arabic the arrow points and travels the other way.
 * Styles and motion: `.pill-cta` in src/index.css.
 */
export const ArrowPillLink = React.forwardRef<HTMLAnchorElement, ArrowPillLinkProps>(
  function ArrowPillLink({ size = 'md', className, children, ...props }, ref) {
    return (
      <Link
        ref={ref}
        className={cn('pill-cta cf-focus', size === 'lg' && 'pill-cta--lg', className)}
        {...props}
      >
        <span className="pill-cta__label">{children}</span>
        <span aria-hidden="true" className="pill-cta__icon">
          <span className="pill-cta__arrow pill-cta__arrow--out">
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
          </span>
          <span className="pill-cta__arrow pill-cta__arrow--in">
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
          </span>
        </span>
      </Link>
    );
  }
);
