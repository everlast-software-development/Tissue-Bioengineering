import React, { useState } from 'react';
import PhoneInput, { type Country, type Value } from 'react-phone-number-input/max';
import { getExampleNumber } from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';
import { cn } from '@/lib/utils';
import { CountrySelect } from './CountrySelect';
import { FALLBACK_COUNTRY, useVisitorCountry } from './visitorCountry';

/**
 * International phone input for the Contact form: country picker (flag + calling code,
 * searchable) and a number input that formats as you type for the selected country.
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
      className={cn(
        'relative flex w-full rounded-lg border bg-cf-bg text-[15px] text-cf-text transition-colors duration-200 motion-reduce:transition-none',
        'has-[.PhoneInputInput:focus]:ring-2',
        invalid
          ? 'border-rose-400/70 has-[.PhoneInputInput:focus]:border-rose-300 has-[.PhoneInputInput:focus]:ring-rose-400/20'
          : 'border-cf-line-strong hover:border-[#33455e] has-[.PhoneInputInput:focus]:border-cf-accent has-[.PhoneInputInput:focus]:ring-cf-accent/25'
      )}
      numberInputProps={{
        className:
          'min-w-0 flex-1 rounded-r-[7px] bg-transparent py-3 pl-2.5 pr-3.5 tabular-nums text-cf-text [color-scheme:dark] placeholder:text-cf-muted/70 focus:outline-none',
      }}
    />
  );
};
