import React from 'react';
import { cn } from '@/lib/utils';

const VARIANTS = {
  primary: 'cf-btn-primary',
  outline: 'cf-btn-outline-accent',
} as const;

const SIZES = {
  md: '',
  lg: 'min-h-[52px] px-7 text-base',
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  /** Shows a spinner before the label and disables the button. */
  isLoading?: boolean;
}

/**
 * `<button>` in the "Confocal" button styles (see .cf-btn in index.css). Links styled as
 * buttons use the same classes directly on `<Link>`.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => (
  <button
    className={cn(
      'cf-btn disabled:cursor-not-allowed disabled:opacity-60',
      VARIANTS[variant],
      SIZES[size],
      className
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && (
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
        aria-hidden="true"
      />
    )}
    {children}
  </button>
);
