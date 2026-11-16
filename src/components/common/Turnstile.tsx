import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useI18n } from '@/i18n/context';
import { cn } from '@/lib/utils';
import { FieldError } from '@/components/common/FormField';

/**
 * Cloudflare Turnstile widget for the website forms.
 *
 * The site key is public (it only identifies the widget; the secret stays in server/). Each
 * token is single-use and valid for 5 minutes, so the form resets the widget after every
 * submit attempt through the `TurnstileHandle` ref. The script is loaded on first use, so
 * pages without a form never download it.
 */
const TURNSTILE_SITE_KEY: string =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAABFxaQNqPybQwMll';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileRenderOptions {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  language?: string;
  /** Called with the token the server must verify. */
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  /** Return true to tell Turnstile the error was handled (it still retries by itself). */
  'error-callback'?: (code: string) => boolean | void;
  'response-field'?: boolean;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string | undefined;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<TurnstileApi> | null = null;

/** Adds the Turnstile script once and resolves with its API. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (loading) return loading;
  loading = new Promise<TurnstileApi>((resolve, reject) => {
    const fail = () => {
      loading = null;
      reject(new Error('Turnstile script failed to load'));
    };
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : fail());
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return loading;
}

export interface TurnstileHandle {
  /** Clears the current token and asks for a new challenge (tokens are single-use). */
  reset: () => void;
}

interface TurnstileProps {
  /** Receives each fresh token, and null when the token expired or the widget was reset. */
  onToken: (token: string | null) => void;
  /** Shown when the Cloudflare script could not be loaded (ad blocker, offline). */
  unavailableMessage: string;
  invalid?: boolean;
  'aria-describedby'?: string;
  className?: string;
}

export const Turnstile = React.forwardRef<TurnstileHandle, TurnstileProps>(
  ({ onToken, unavailableMessage, invalid, className, ...rest }, ref) => {
    const { locale } = useI18n();
    const container = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const [failed, setFailed] = useState(false);

    // The latest callback, so the widget (rendered once per language) never calls a stale one.
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    useEffect(() => {
      let cancelled = false;
      setFailed(false);
      loadTurnstile()
        .then((turnstile) => {
          if (cancelled || !container.current) return;
          widgetId.current =
            turnstile.render(container.current, {
              sitekey: TURNSTILE_SITE_KEY,
              theme: 'dark',
              size: 'flexible',
              language: locale,
              'response-field': false,
              callback: (token) => onTokenRef.current(token),
              'expired-callback': () => onTokenRef.current(null),
              'timeout-callback': () => onTokenRef.current(null),
              'error-callback': () => {
                onTokenRef.current(null);
                return true;
              },
            }) ?? null;
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) {
          window.turnstile.remove(widgetId.current);
          widgetId.current = null;
          onTokenRef.current(null);
        }
      };
    }, [locale]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        onTokenRef.current(null);
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      },
    }));

    return (
      <div className={cn('min-w-0', className)}>
        {/* 'flexible' fills the container (at least 300px wide, 65px tall). */}
        <div
          ref={container}
          aria-invalid={invalid ? true : undefined}
          className={cn(
            'min-h-[65px] w-full rounded-lg [&>iframe]:rounded-lg',
            invalid && 'ring-1 ring-rose-400/70'
          )}
          {...rest}
        />
        {failed && (
          <p role="alert" className="mt-2 text-[13px] leading-snug text-rose-300">
            {unavailableMessage}
          </p>
        )}
      </div>
    );
  }
);
Turnstile.displayName = 'Turnstile';

interface TurnstileFieldProps {
  /** Prefix for the label / error element ids (e.g. "contact-turnstile"). */
  id: string;
  onToken: (token: string | null) => void;
  /** react-hook-form error for the token field. */
  error?: { message?: string };
  className?: string;
}

/** The widget with the site's field label and validation message, for use inside a form. */
export const TurnstileField = React.forwardRef<TurnstileHandle, TurnstileFieldProps>(
  ({ id, onToken, error, className }, ref) => {
    const { t } = useI18n();
    const labelId = `${id}-label`;
    const errorId = `${id}-error`;
    return (
      <div role="group" aria-labelledby={labelId} className={cn('min-w-0', className)}>
        <p id={labelId} className="cf-field-label">
          {t.forms.securityCheck}
          <span className="ms-0.5 text-cf-accent" aria-hidden="true">
            *
          </span>
        </p>
        <Turnstile
          ref={ref}
          onToken={onToken}
          unavailableMessage={t.forms.securityCheckUnavailable}
          invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        {error && <FieldError id={errorId} message={error.message} />}
      </div>
    );
  }
);
TurnstileField.displayName = 'TurnstileField';
