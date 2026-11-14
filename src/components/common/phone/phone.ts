import { z } from 'zod';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input/max';
import { validatePhoneNumberLength } from 'libphonenumber-js/max';

/**
 * Validation and submission helpers for <PhoneField>, shared by every form that uses it.
 * The field's value is E.164 for the selected country (e.g. +201012345678), or '' when empty.
 */

function phoneError(e164: string): string | undefined {
  if (isValidPhoneNumber(e164)) return undefined;
  return validatePhoneNumberLength(e164) === 'TOO_SHORT'
    ? 'This number is too short for the selected country'
    : 'Please enter a valid phone number for the selected country';
}

/** Required international number, checked against the selected country's real number ranges. */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your phone number')
  .superRefine((v, ctx) => {
    const message = phoneError(v);
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  });

/**
 * Canonical E.164 for the API. The field already emits E.164; normalising once more
 * guarantees only canonical numbers are sent (the schema has already validated it).
 */
export const toE164 = (value: string): string => parsePhoneNumber(value)?.number ?? value;
