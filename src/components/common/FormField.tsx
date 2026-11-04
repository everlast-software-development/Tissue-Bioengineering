import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Base classes for form controls (inputs, selects, textareas). */
export const controlClass =
  'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm';

/** Control classes for fields that show placeholder text. */
export const textControlClass =
  'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-navy/40 text-sm';

export const FieldError: React.FC<{ message?: string; className?: string }> = ({
  message,
  className = 'mt-1',
}) => (
  <p className={cn('text-status-error flex items-center gap-1 text-xs', className)}>
    <AlertCircle className="h-3.5 w-3.5" /> {message}
  </p>
);

interface FormFieldProps {
  label: string;
  /** react-hook-form field error; its message is shown under the control. */
  error?: { message?: string };
  labelClassName?: string;
  children: React.ReactNode;
}

/** Label + control + validation message. */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  labelClassName = 'mb-1.5',
  children,
}) => (
  <div>
    <label className={cn('block text-xs font-semibold text-text-primary', labelClassName)}>
      {label}
    </label>
    {children}
    {error && <FieldError message={error.message} />}
  </div>
);
