/**
 * The official logo shown in the email header.
 *
 * It travels inside each message as an inline (CID) image rather than a link to a hosted file:
 * Outlook for Windows blocks remote images until the reader allows them, while embedded images
 * show straight away there and in Gmail, Apple Mail and Outlook.com.
 *
 * `assets/tissue-bioengineering-logo-email.png` is a PNG copy of the site's header logo
 * (public/images/tissuebioengineering-header.webp, white artwork on transparency) at twice the
 * display size below, so it stays sharp on high-density screens. The site's WebP is untouched.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeError, log } from '../log.ts';

const FILE = 'tissue-bioengineering-logo-email.png';

export const LOGO = {
  /** Content-ID the HTML refers to as `cid:…`. */
  cid: 'logo@tissuebioengineering.com',
  /** Display size in CSS pixels; same aspect ratio as the original artwork (966 x 289). */
  width: 194,
  height: 58,
  alt: 'Tissue Bioengineering',
} as const;

/** An image embedded in the message and referenced from the HTML by `cid:`. */
export interface InlineImage {
  filename: string;
  content: Buffer;
  contentType: string;
  cid: string;
  contentDisposition: 'inline';
}

/**
 * Next to this module when run as TypeScript; the compiled server (server/dist) does not copy
 * the PNG, so fall back to the source folder relative to the project root (where `npm start`
 * runs, like the static site directory).
 */
const CANDIDATES = [
  fileURLToPath(new URL(`./assets/${FILE}`, import.meta.url)),
  path.resolve(process.cwd(), 'server', 'email', 'assets', FILE),
];

let cached: InlineImage | null | undefined;

/**
 * The logo attachment, read once per process. Null when the file cannot be read: the header
 * then falls back to the text wordmark, so a missing asset never stops a notification.
 */
export function getLogoImage(): InlineImage | null {
  if (cached !== undefined) return cached;
  cached = null;
  const file = CANDIDATES.find((candidate) => existsSync(candidate));
  if (!file) {
    log.warn('Email logo not found; using the text wordmark', { file: FILE });
    return cached;
  }
  try {
    cached = {
      filename: FILE,
      content: readFileSync(file),
      contentType: 'image/png',
      cid: LOGO.cid,
      contentDisposition: 'inline',
    };
  } catch (err) {
    log.warn('Email logo could not be read; using the text wordmark', {
      file,
      ...describeError(err),
    });
  }
  return cached;
}
