import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useI18n } from '@/i18n/context';
import { cn } from '@/lib/utils';

/**
 * Cloudflare Turnstile for the website forms, run invisibly.
 *
 * The widget is rendered with `execution: 'execute'` and `appearance: 'interaction-only'`, so it
 * shows nothing and takes no space while the form is filled in. On submit the form calls
 * `getToken()`, which runs the challenge in the background and resolves with a fresh token for
 * that attempt (tokens are single-use and expire after 5 minutes; the server verifies each one
 * with the secret key, which never reaches the browser). Only when Cloudflare decides the visitor
 * must confirm they are human does the widget appear, above the submit button, for the duration
 * of that interaction.
 *
 * The site key is public (it only identifies the widget). The script is loaded on first use, so
 * pages without a form never download it.
 */
const TURNSTILE_SITE_KEY: string =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAABFxaQNqPybQwMll';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** How long a background challenge may take before the attempt is given up (interactive ones are not timed here). */
const CHALLENGE_TIMEOUT_MS = 30_000;

interface TurnstileRenderOptions {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  language?: string;
  /** 'execute': the challenge only runs when `turnstile.execute()` is called. */
  execution?: 'render' | 'execute';
  /** 'interaction-only': the widget is only shown when the visitor has to interact with it. */
  appearance?: 'always' | 'execute' | 'interaction-only';
  /** Called with the token the server must verify. */
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  /** Return true to tell Turnstile the error was handled. */
  'error-callback'?: (code: string) => boolean | void;
  'before-interactive-callback'?: () => void;
  'after-interactive-callback'?: () => void;
  'unsupported-callback'?: () => void;
  'response-field'?: boolean;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string | undefined;
  execute: (widgetId: string) => void;
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

/**
 * Why no token could be obtained: 'unavailable' when the Cloudflare script could not be loaded
 * or the browser is not supported (the visitor should check content blockers or email instead);
 * 'failed' when this attempt's challenge errored or timed out (the visitor can simply retry).
 */
export type TurnstileFailure = 'unavailable' | 'failed';

type TurnstileResult = { ok: true; token: string } | { ok: false; reason: TurnstileFailure };

export interface TurnstileHandle {
  /**
   * Runs a fresh challenge and resolves with its single-use token, or with the reason none could
   * be obtained. Never rejects. Call it once per submit attempt, right before the API request.
   */
  getToken: () => Promise<TurnstileResult>;
}

interface TurnstileProps {
  /** Id of the widget container (e.g. "contact-turnstile"); also prefixes its label id. */
  id: string;
  className?: string;
}

interface PendingChallenge {
  settle: (result: TurnstileResult) => void;
  /** Guard for a background challenge that never reports back; cleared once it turns interactive. */
  timer: ReturnType<typeof setTimeout> | null;
}

export const Turnstile = React.forwardRef<TurnstileHandle, TurnstileProps>(
  ({ id, className }, ref) => {
    const { t, locale } = useI18n();
    const container = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    /** Resolves with the widget id once rendered; null until mounted or after a failed load. */
    const widgetReady = useRef<Promise<string> | null>(null);
    /** Bumped whenever the widget is torn down, so a late render for an old one is dropped. */
    const generation = useRef(0);
    const pending = useRef<PendingChallenge | null>(null);
    /** True while Cloudflare shows an interactive challenge: the only time the widget is visible. */
    const [interactive, setInteractive] = useState(false);

    const settle = useCallback((result: TurnstileResult) => {
      const current = pending.current;
      if (!current) return;
      pending.current = null;
      if (current.timer) clearTimeout(current.timer);
      current.settle(result);
    }, []);

    /** Loads the script if needed and renders the (invisible) widget into the container. */
    const mount = useCallback((): Promise<string> => {
      const gen = generation.current;
      const ready = loadTurnstile().then((turnstile) => {
        if (gen !== generation.current || !container.current)
          throw new Error('Turnstile widget gone');
        const rendered = turnstile.render(container.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          size: 'flexible',
          language: locale,
          execution: 'execute',
          appearance: 'interaction-only',
          'response-field': false,
          callback: (token) => settle({ ok: true, token }),
          'error-callback': () => {
            settle({ ok: false, reason: 'failed' });
            return true;
          },
          'timeout-callback': () => settle({ ok: false, reason: 'failed' }),
          'unsupported-callback': () => settle({ ok: false, reason: 'unavailable' }),
          'before-interactive-callback': () => {
            // The visitor may take their time with the checkbox; Turnstile's own timeout applies.
            if (pending.current?.timer) {
              clearTimeout(pending.current.timer);
              pending.current.timer = null;
            }
            setInteractive(true);
          },
          'after-interactive-callback': () => setInteractive(false),
        });
        if (!rendered) throw new Error('Turnstile widget could not be rendered');
        widgetId.current = rendered;
        return rendered;
      });
      // A failed load is retried by the next getToken() (the visitor may have fixed their connection).
      ready.catch(() => {
        if (widgetReady.current === ready) widgetReady.current = null;
      });
      return ready;
    }, [locale, settle]);

    useEffect(() => {
      widgetReady.current = mount();
      return () => {
        generation.current += 1;
        settle({ ok: false, reason: 'failed' });
        setInteractive(false);
        widgetReady.current = null;
        if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      };
    }, [mount, settle]);

    useImperativeHandle(
      ref,
      () => ({
        getToken: async () => {
          // One challenge at a time: a second submit while one runs gets no token of its own.
          if (pending.current) return { ok: false, reason: 'failed' };
          let widget: string;
          try {
            widget = await (widgetReady.current ??= mount());
          } catch {
            return { ok: false, reason: 'unavailable' };
          }
          const turnstile = window.turnstile;
          if (!turnstile) return { ok: false, reason: 'unavailable' };
          return new Promise<TurnstileResult>((resolve) => {
            pending.current = {
              settle: resolve,
              timer: setTimeout(
                () => settle({ ok: false, reason: 'failed' }),
                CHALLENGE_TIMEOUT_MS
              ),
            };
            // Tokens are single-use: clear the previous attempt's state, then run a new challenge.
            turnstile.reset(widget);
            turnstile.execute(widget);
          });
        },
      }),
      [mount, settle]
    );

    const labelId = `${id}-label`;
    return (
      <div className={cn('min-w-0', className)}>
        {/* The container stays mounted (Turnstile renders into it) and is empty, so it has no
            height and adds no spacing, until an interactive challenge is shown. */}
        {interactive && (
          <p key="label" id={labelId} className="cf-field-label">
            {t.forms.securityCheck}
          </p>
        )}
        <div
          key="widget"
          ref={container}
          id={id}
          role={interactive ? 'group' : undefined}
          aria-labelledby={interactive ? labelId : undefined}
          className={cn('w-full', interactive && 'mb-6')}
        />
      </div>
    );
  }
);
Turnstile.displayName = 'Turnstile';
