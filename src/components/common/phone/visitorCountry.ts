import { useEffect, useState } from 'react';
import { isSupportedCountry, type Country } from 'react-phone-number-input/max';

/**
 * Visitor country for the forms' phone field (<PhoneField>), from an IP lookup.
 *
 * - One request per browser per week: the answer is cached in localStorage, and
 *   concurrent callers share the same in-flight request.
 * - No browser location permission is ever requested.
 * - Never blocks the form: the field starts on the cached or fallback country and
 *   the phone input only switches to the detected country if the visitor has not
 *   picked a country or typed a number yet (react-phone-number-input's own rule for
 *   a `defaultCountry` that changes after mount).
 */

/** Used until detection answers, and if it fails. Egypt is the primary market. */
export const FALLBACK_COUNTRY: Country = 'EG';

/** GeoJS: free, no key, CORS-enabled; returns the ISO 3166-1 alpha-2 code as plain text. */
const LOOKUP_URL = 'https://get.geojs.io/v1/ip/country';
const TIMEOUT_MS = 4000;
const CACHE_KEY = 'tb:visitor-country';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const toCountry = (code: unknown): Country | undefined => {
  if (typeof code !== 'string') return undefined;
  const c = code.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) && isSupportedCountry(c) ? c : undefined;
};

function readCache(): Country | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;
    const { country, at } = JSON.parse(raw) as { country?: unknown; at?: unknown };
    if (typeof at !== 'number' || Date.now() - at > CACHE_TTL_MS) return undefined;
    return toCountry(country);
  } catch {
    return undefined;
  }
}

function writeCache(country: Country) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ country, at: Date.now() }));
  } catch {
    // Storage unavailable (private mode, blocked): detection simply runs again next visit.
  }
}

let pending: Promise<Country | undefined> | undefined;

/** Resolves to the visitor's country, or `undefined` if it can't be determined. Never rejects. */
export function detectVisitorCountry(): Promise<Country | undefined> {
  const cached = readCache();
  if (cached) return Promise.resolve(cached);

  pending ??= (async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(LOOKUP_URL, {
        signal: ctrl.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      if (!res.ok) return undefined;
      const country = toCountry(await res.text());
      if (country) writeCache(country);
      return country;
    } catch {
      return undefined;
    } finally {
      clearTimeout(timer);
    }
  })();

  // A failed lookup isn't retried during this page session.
  return pending;
}

/** The detected country once known; `undefined` while loading or if detection failed. */
export function useVisitorCountry(): Country | undefined {
  const [country, setCountry] = useState<Country | undefined>(readCache);

  useEffect(() => {
    if (country) return;
    let active = true;
    void detectVisitorCountry().then((c) => {
      if (active && c) setCountry(c);
    });
    return () => {
      active = false;
    };
  }, [country]);

  return country;
}
