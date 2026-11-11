import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FieldError: React.FC<{ id?: string; message?: string; className?: string }> = ({
  id,
  message,
  className = 'mt-2',
}) => (
  <p id={id} role="alert" className={cn('flex items-center gap-1.5 text-[13px] text-rose-300', className)}>
    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {message}
  </p>
);

interface FormFieldProps {
  label: string;
  /** Id of the control inside; ties the label (and error message) to it. */
  htmlFor: string;
  /** react-hook-form field error; its message is shown under the control. */
  error?: { message?: string };
  className?: string;
  /** "soft" is the Contact form style: `.cf-field` controls with `.cf-field-label` labels. */
  variant?: 'default' | 'soft';
  /** Shows an accent asterisk after the label (the control itself carries `required`). */
  required?: boolean;
  /** Receives the props the control needs for the label/error association. */
  children: (control: {
    id: string;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
  }) => React.ReactNode;
}

/**
 * Label + control + validation message. Controls use the `.cf-input` class (index.css).
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  className,
  variant = 'default',
  required,
  children,
}) => {
  const errorId = `${htmlFor}-error`;
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className={
          variant === 'soft' ? 'cf-field-label' : 'mb-2 block text-[13px] font-medium text-cf-text-2'
        }
      >
        {label}
        {required && (
          <span className="ml-0.5 text-cf-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children({
        id: htmlFor,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && <FieldError id={errorId} message={error.message} />}
    </div>
  );
};
