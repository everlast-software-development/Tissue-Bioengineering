import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/** `<button>` in the "Confocal" button styles (see .cf-btn in index.css). */
export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'cf-btn-primary',
    secondary: 'cf-btn-light',
    outline: 'cf-btn-outline-accent',
    ghost: 'text-cf-text-2 hover:bg-white/[0.04] hover:text-cf-text',
  };

  const sizes = {
    sm: 'min-h-10 px-4 text-sm',
    md: '',
    lg: 'min-h-[52px] px-7 text-base',
  };

  return (
    <button
      className={cn(
        'cf-btn disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
