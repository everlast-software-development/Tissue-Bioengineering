import { useEffect, useRef, useState } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { getApiErrorMessage, getApiFieldErrors, type SubmitResponse } from '@/lib/api';
import { useI18n } from '@/i18n/context';
import type { Messages } from '@/i18n/messages/en';
import type { TurnstileFailure, TurnstileHandle } from './Turnstile';

/**
 * The API (server/) answers in English, and the backend is shared by every language. This maps
 * its visitor-facing messages to the current locale using `forms.serverMessages`; a message with
 * no translation falls back to the locale's generic text (English shows every message exactly as
 * sent).
 */
export function localizeServerMessage(
  message: string,
  forms: Messages['forms'],
  fallback = forms.serverFallback
): string {
  if (Object.hasOwn(forms.serverMessages, message)) return forms.serverMessages[message];
  return fallback ?? message;
}

/** Everything a website form needs to submit, as returned by useFormSubmission. */
export interface FormSubmission {
  /** The <form>'s onSubmit: client validation, then the security check, then the API call. */
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  /** Attach to the form's <Turnstile> (rendered by <FormSubmit>). */
  turnstile: React.RefObject<TurnstileHandle | null>;
  /** True from the press until this attempt has finished (validation, security check, API). */
  isSubmitting: boolean;
  /** The server's confirmation of the last submission; null until one succeeds. */
  result: SubmitResponse | null;
  clearResult: () => void;
  /** The last failure's message as received (English); shown localized by <FormSubmit>. */
  error: string | null;
  /** Why the invisible Turnstile check produced no token for the last attempt. */
  securityFailure: TurnstileFailure | null;
}

/**
 * The submit flow shared by the Contact and Consultation forms:
 * - one submission at a time: a second submit while one is in progress is ignored, and the
 *   button stays busy until the first has finished (react-hook-form's own `isSubmitting` is
 *   cleared by whichever submit call ends first, so it is not enough on its own);
 * - a fresh Turnstile token per attempt (tokens are single-use), obtained invisibly on submit;
 * - `send` resolves only once the server confirms the notification email was accepted; the form
 *   is then cleared and `result` holds the server's reply;
 * - on failure, server-side field errors are shown on their fields and the message in `error`;
 * - after a language switch, fields showing an error are re-validated so the messages follow it.
 */
export function useFormSubmission<T extends FieldValues>(
  form: UseFormReturn<T>,
  send: (values: T, turnstileToken: string) => Promise<SubmitResponse>
): FormSubmission {
  const { t, locale } = useI18n();
  const turnstile = useRef<TurnstileHandle>(null);
  const inFlight = useRef(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [securityFailure, setSecurityFailure] = useState<TurnstileFailure | null>(null);
  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    const invalid = Object.keys(errors) as Path<T>[];
    if (invalid.length) void form.trigger(invalid);
    // Only on a language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setResult(null);
    setError(null);
    setSecurityFailure(null);
    try {
      const check = turnstile.current
        ? await turnstile.current.getToken()
        : ({ ok: false, reason: 'unavailable' } as const);
      if (!check.ok) {
        setSecurityFailure(check.reason);
        return;
      }
      setResult(await send(values, check.token));
      form.reset();
    } catch (err) {
      for (const [field, messages] of Object.entries(getApiFieldErrors(err))) {
        if (field in values) {
          form.setError(field as Path<T>, {
            type: 'server',
            message: localizeServerMessage(messages[0], t.forms, t.forms.serverFieldFallback),
          });
        }
      }
      setError(getApiErrorMessage(err));
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  });

  return {
    onSubmit,
    turnstile,
    isSubmitting: isSubmitting || sending,
    result,
    clearResult: () => setResult(null),
    error,
    securityFailure,
  };
}
