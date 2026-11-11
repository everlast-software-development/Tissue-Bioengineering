import React, { useState } from 'react';
import PhoneInput, { type Country, type Value } from 'react-phone-number-input/max';
import { getExampleNumber } from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';
import { cn } from '@/lib/utils';
import { CountrySelect } from './CountrySelect';
import { FALLBACK_COUNTRY, useVisitorCountry } from './visitorCountry';

/**
 * International phone input for the Contact form: country picker (flag + calling code,
 * searchable) in its own box, and a number input that formats as you type for the selected country.
 * `value` / `onChange` carry the number in E.164 (e.g. +201012345678), or '' when empty.
 *
 * Uses libphonenumber's full ("max") metadata, so validation checks each country's real
 * number ranges, not just the length.
 */
interface PhoneFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e164: string) => void;
  onBlur: () => void;
  inputRef: React.Ref<HTMLInputElement>;
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
  'aria-invalid': invalid,
  'aria-describedby': describedBy,
}) => {
  // Starts on the fallback; once detection answers, PhoneInput switches to that country
  // only if the visitor hasn't chosen a country or typed a number yet.
  const defaultCountry = useVisitorCountry() ?? FALLBACK_COUNTRY;
  const [country, setCountry] = useState<Country | undefined>(defaultCountry);

  const example = country ? getExampleNumber(country, examples)?.formatNational() : undefined;

  return (
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
      onCountryChange={setCountry}
      countrySelectComponent={CountrySelect}
      addInternationalOption={false}
      limitMaxLength
      required
      autoComplete="tel"
      placeholder={example}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      // Two separate boxes, country code and number, side by side.
      className="relative flex w-full gap-2.5"
      numberInputProps={{
        className: cn('cf-field min-w-0 flex-1 tabular-nums', invalid && 'border-rose-400/70'),
      }}
    />
  );
};
