import React from 'react';
import PhoneInput, { type Value } from 'react-phone-number-input/max';
import arLabels from 'react-phone-number-input/locale/ar';
import enLabels from 'react-phone-number-input/locale/en';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/context';
import { LOCALE_META, type Locale } from '@/i18n/config';
import { CountrySelect } from './CountrySelect';
import { FALLBACK_COUNTRY, useVisitorCountry } from './visitorCountry';

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
