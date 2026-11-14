import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FieldError: React.FC<{ id?: string; message?: string; className?: string }> = ({
  id,
  message,
  className = 'mt-2',
}) => (
  <p id={id} role="alert" className={cn('flex items-start gap-1.5 text-[13px] leading-snug text-rose-300', className)}>
    <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {message}
  </p>
);

/** Form-level result banner (submission succeeded / failed), shown above the submit button. */
export const FormAlert: React.FC<{ tone: 'success' | 'error'; children: React.ReactNode }> = ({
  tone,
  children,
}) => {
  const Icon = tone === 'success' ? CheckCircle : AlertCircle;
  return (
    <div
      role={tone === 'success' ? 'status' : 'alert'}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 text-sm font-medium leading-relaxed',
        tone === 'success'
          ? 'border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-200'
          : 'border-rose-400/30 bg-rose-500/[0.06] text-rose-200'
      )}
    >
      <Icon
        className={cn('mt-0.5 h-4 w-4 shrink-0', tone === 'success' ? 'text-emerald-300' : 'text-rose-300')}
        aria-hidden="true"
      />
      <span>{children}</span>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  /** Id of the control inside; ties the label (and hint / error message) to it. */
  htmlFor: string;
  /** Short guidance shown under the label and read with the control. */
  hint?: string;
  /** react-hook-form field error; its message is shown under the control. */
  error?: { message?: string };
  className?: string;
  /** Shows an accent asterisk after the label (the control itself carries `required`). */
  required?: boolean;
  /** Receives the props the control needs for the label/hint/error association. */
  children: (control: {
    id: string;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
  }) => React.ReactNode;
}

/**
 * Label + control + validation message for every website form. Controls use the
 * `.cf-field` class, or <PhoneField> for phone numbers (see index.css).
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  hint,
  error,
  className,
  required,
  children,
}) => {
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={htmlFor} className="cf-field-label">
        {label}
        {required && (
          <span className="ms-0.5 text-cf-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="-mt-1 mb-2.5 text-[13px] leading-snug text-cf-muted">
          {hint}
        </p>
      )}
      {children({
        id: htmlFor,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {error && <FieldError id={errorId} message={error.message} />}
    </div>
  );
};
