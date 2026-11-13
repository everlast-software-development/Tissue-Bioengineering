/**
 * Design tokens for notification emails. Plain hex values and pixel sizes only: email clients
 * ignore CSS custom properties, and Outlook needs explicit pixel line heights.
 */

export const COLOR = {
  /** Page behind the card. */
  canvas: '#F4F7FA',
  /** The card. */
  surface: '#FFFFFF',
  /** In-card panels (metadata, long text). Lighter than `canvas` so `muted` text keeps 4.5:1. */
  panel: '#F8FAFC',
  /** Reply callout background: a faint tint of the brand cyan. */
  accentTint: '#EEFAFC',
  /** Header band. */
  navy: '#0A1424',
  text: '#172033',
  /** Secondary text on white and `panel`. */
  muted: '#64748B',
  /** Secondary text on `canvas` (the footer), where `muted` falls just short of 4.5:1. */
  mutedOnCanvas: '#5B6B80',
  divider: '#E5EAF0',
  /** Brand cyan. Decoration on light backgrounds (1.7:1 on white), text only on `navy`. */
  accent: '#4FD6E8',
  /** Cyan-family text and links on light backgrounds (5.4:1 on white). */
  accentText: '#0E7490',
  onDark: '#FFFFFF',
  onDarkMuted: '#94A3B8',
} as const;

/** System fonts only. Segoe UI comes first so Outlook on Windows never falls back to Times. */
export const FONT_STACK =
  "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const MONO_STACK = "Consolas, SFMono-Regular, Menlo, Monaco, 'Liberation Mono', monospace";

export const LAYOUT = {
  /** Card width on desktop; the layout is fluid below it. */
  maxWidth: 640,
  /** Horizontal padding inside the card. */
  gutter: 40,
  /** Horizontal padding inside the card at or below `breakpoint`. */
  mobileGutter: 20,
  breakpoint: 600,
} as const;

export interface TextPreset {
  size: number;
  lineHeight: number;
  color: string;
  weight?: 400 | 600 | 700;
  letterSpacing?: string;
  uppercase?: boolean;
  mono?: boolean;
}

/** The type scale. Every piece of text in the email uses one of these. */
export const TYPE = {
  wordmark: {
    size: 13,
    lineHeight: 20,
    color: COLOR.onDark,
    weight: 600,
    letterSpacing: '0.16em',
    uppercase: true,
  },
  headerLabel: {
    size: 11,
    lineHeight: 20,
    color: COLOR.accent,
    weight: 600,
    letterSpacing: '0.14em',
    uppercase: true,
  },
  title: { size: 24, lineHeight: 32, color: COLOR.text, weight: 600 },
  summary: { size: 15, lineHeight: 24, color: COLOR.muted },
  sectionHeading: {
    size: 11,
    lineHeight: 16,
    color: COLOR.muted,
    weight: 600,
    letterSpacing: '0.12em',
    uppercase: true,
  },
  metaLabel: {
    size: 11,
    lineHeight: 16,
    color: COLOR.muted,
    weight: 600,
    letterSpacing: '0.08em',
    uppercase: true,
  },
  metaValue: { size: 14, lineHeight: 20, color: COLOR.text, weight: 600 },
  fieldLabel: { size: 13, lineHeight: 22, color: COLOR.muted },
  fieldValue: { size: 15, lineHeight: 22, color: COLOR.text },
  body: { size: 15, lineHeight: 24, color: COLOR.text },
  detail: { size: 12, lineHeight: 18, color: COLOR.muted },
  replyLabel: {
    size: 11,
    lineHeight: 16,
    color: COLOR.accentText,
    weight: 600,
    letterSpacing: '0.12em',
    uppercase: true,
  },
  replyLead: { size: 15, lineHeight: 22, color: COLOR.text, weight: 600 },
  replyDetail: { size: 13, lineHeight: 20, color: COLOR.muted },
  footerBrand: { size: 12, lineHeight: 18, color: COLOR.text, weight: 600 },
  footer: { size: 12, lineHeight: 18, color: COLOR.mutedOnCanvas },
} as const satisfies Record<string, TextPreset>;
