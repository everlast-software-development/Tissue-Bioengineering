import { z } from 'zod';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input/max';
import { validatePhoneNumberLength } from 'libphonenumber-js/max';
import type { Messages } from '@/i18n/messages/en';

/**
 * Validation and submission helpers for <PhoneField>, shared by every form that uses it.
 * The field's value is E.164 for the selected country (e.g. +201012345678), or '' when empty.
 */

type PhoneMessages = Pick<
  Messages['forms']['validation'],
  'phoneRequired' | 'phoneTooShort' | 'phoneInvalid'
>;

function phoneError(e164: string, messages: PhoneMessages): string | undefined {
  if (isValidPhoneNumber(e164)) return undefined;
  return validatePhoneNumberLength(e164) === 'TOO_SHORT'
    ? messages.phoneTooShort
    : messages.phoneInvalid;
}

/**
 * Required international number, checked against the selected country's real number ranges,
 * with messages in the current locale (`t.forms.validation`).
 */
export const makePhoneSchema = (messages: PhoneMessages) =>
  z
    .string()
    .trim()
    .min(1, messages.phoneRequired)
    .superRefine((v, ctx) => {
      const message = phoneError(v, messages);
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    });

/**
 * Canonical E.164 for the API. The field already emits E.164; normalising once more
 * guarantees only canonical numbers are sent (the schema has already validated it).
 */
export const toE164 = (value: string): string => parsePhoneNumber(value)?.number ?? value;
