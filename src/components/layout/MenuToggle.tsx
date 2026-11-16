import React from 'react';
import { cn } from '@/lib/utils';

interface MenuToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Drawn as three lines when false and as a cross when true; the change is animated (src/index.css). */
  open: boolean;
}

/**
 * Icon-only menu button (44px square), shown below lg. Its accessible name is the caller's
 * aria-label; nothing is written beside the icon.
 *
 * Rendered twice at the same screen position: in the header (opens the menu) and inside the site
 * menu above its panel (closes it), both drawn from the same `open` state so the one on top is
 * pixel-identical to the one beneath while the icon folds (see MobileNavDrawer).
 */
export const MenuToggle = React.forwardRef<HTMLButtonElement, MenuToggleProps>(function MenuToggle(
  { open, className, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      data-open={open}
      className={cn(
        'menu-toggle cf-focus relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] border border-cf-line-strong text-cf-text transition-colors duration-150 hover:border-cf-muted',
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="menu-toggle__line" />
      <span aria-hidden="true" className="menu-toggle__line" />
      <span aria-hidden="true" className="menu-toggle__line" />
    </button>
  );
});
