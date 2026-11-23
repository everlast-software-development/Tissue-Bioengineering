import React, { useEffect, useState } from 'react';
import PhoneInput, { isSupportedCountry, type Country, type Value } from 'react-phone-number-input/max';
import arLabels from 'react-phone-number-input/locale/ar';
import enLabels from 'react-phone-number-input/locale/en';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/context';
import { LOCALE_META, type Locale } from '@/i18n/config';
import { CountrySelect } from './CountrySelect';

/* ── Visitor country ─────────────────────────────────────────────────────────────────────── */

/**
 * Default country for the phone field, from an IP lookup.
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
const FALLBACK_COUNTRY: Country = 'EG';

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
function detectVisitorCountry(): Promise<Country | undefined> {
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
function useVisitorCountry(): Country | undefined {
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

/* ── Phone field ─────────────────────────────────────────────────────────────────────────── */

/** Country names in the picker, per site locale (the package's own translations). */
const COUNTRY_LABELS: Record<Locale, typeof enLabels> = { en: enLabels, ar: arLabels };

/**
 * International phone input shared by the Contact and Consultation forms: a searchable
 * country picker (flag + calling code) joined to a number input that formats as you type
 * for the selected country. `value` / `onChange` carry the number in E.164
 * (e.g. +201012345678), or '' when empty. Validate with `makePhoneSchema` (./phone.ts).
 *
 * Uses libphonenumber's full ("max") metadata, so validation checks each country's real
 * number ranges, not just the length.
 *
 * The field is always laid out left-to-right (calling code, then number), as international
 * numbers are written in Arabic too; the country list itself follows the page direction.
 */
interface PhoneFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e164: string) => void;
  onBlur: () => void;
  inputRef: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  disabled,
  'aria-invalid': invalid,
  'aria-describedby': describedBy,
}) => {
  const { locale, t } = useI18n();
  // Starts on the cached or fallback country. When detection answers later, PhoneInput
  // switches to it only if the visitor hasn't picked a country or typed a number yet,
  // so a manual choice is never overridden by a late response.
  const defaultCountry = useVisitorCountry() ?? FALLBACK_COUNTRY;

  return (
    <div dir="ltr">
      <PhoneInput
        // Forwarded to the number <input> at runtime (react-hook-form focuses it on error);
        // the package's typings declare the class instance instead.
        ref={inputRef as never}
        id={id}
        name={name}
        value={(value || undefined) as Value | undefined}
        onChange={(v?: Value) => onChange(v ?? '')}
        onBlur={onBlur}
        defaultCountry={defaultCountry}
        countrySelectComponent={CountrySelect}
        labels={COUNTRY_LABELS[locale]}
        locales={LOCALE_META[locale].htmlLang}
        addInternationalOption={false}
        limitMaxLength
        disabled={disabled}
        required
        autoComplete="tel"
        placeholder={t.forms.phonePlaceholder}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        // One field: country code and number share a single frame (.cf-phone in index.css).
        // Unknown props go to the number <input>, so the frame's invalid state is a class.
        className={cn('cf-phone', invalid && 'cf-phone--invalid')}
        numberInputProps={{ className: 'cf-phone-input' }}
      />
    </div>
  );
};
