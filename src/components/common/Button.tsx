import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

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
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-navy/40 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-navy hover:bg-navy-hover text-white shadow-soft hover:shadow-hover hover:-translate-y-0.5',
    secondary:
      'bg-white hover:bg-slate-50 text-navy border-2 border-navy hover:border-navy-hover shadow-xs hover:-translate-y-0.5',
    outline:
      'border-2 border-steel text-steel hover:bg-sky-light hover:text-navy',
    ghost: 'text-text-secondary hover:text-navy hover:bg-slate-100/80',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
