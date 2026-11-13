/**
 * HTML building blocks for notification emails.
 *
 * Email-client rules followed throughout: layout is tables only (role="presentation"), every
 * style that matters is inline, sizes are pixels with `mso-line-height-rule:exactly` for Outlook,
 * background colours are repeated as `bgcolor`, and no flexbox, grid, CSS variables or web fonts.
 * Classes prefixed `tb-` are only hooks for the responsive rules in layout.ts; without them the
 * email still reads correctly.
 *
 * Every function that takes visitor text escapes it itself, so callers pass raw strings.
 */
import { BRAND, disclaimer, HEADER_LABEL, noEmailFallback, replyLead } from './copy.ts';
import {
  displayValue,
  escapeHtml,
  escapeMultiline,
  mailtoHref,
  NOT_PROVIDED,
  telHref,
} from './format.ts';
import { COLOR, FONT_STACK, LAYOUT, MONO_STACK, TYPE, type TextPreset } from './theme.ts';
import type { EmailField, EmailSection, MetaItem, NotificationView } from './types.ts';

/** Attributes for every layout table. */
export const TABLE = 'role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"';

/** Lets long unbroken values (addresses, URLs, pasted strings) wrap instead of widening the card. */
const WRAP = 'word-wrap:break-word;overflow-wrap:anywhere;word-break:break-word;';

/** Inline style for a type preset. */
export function textStyle(preset: TextPreset, extra = ''): string {
  return [
    'margin:0',
    `font-family:${preset.mono ? MONO_STACK : FONT_STACK}`,
    `font-size:${preset.size}px`,
    `line-height:${preset.lineHeight}px`,
    'mso-line-height-rule:exactly',
    `font-weight:${preset.weight ?? 400}`,
    `color:${preset.color}`,
    preset.letterSpacing ? `letter-spacing:${preset.letterSpacing}` : '',
    preset.uppercase ? 'text-transform:uppercase' : '',
  ]
    .filter(Boolean)
    .join(';')
    .concat(';', extra);
}

function link(href: string, label: string, preset: TextPreset): string {
  return `<a href="${escapeHtml(href)}" style="${textStyle({ ...preset, color: COLOR.accentText }, `text-decoration:none;${WRAP}`)}">${escapeHtml(label)}</a>`;
}

/** One full-width row of the card with the standard side gutters. */
function cardRow(content: string, padTop: number, padBottom = 0): string {
  return `
<tr>
  <td class="tb-gutter" style="padding:${padTop}px ${LAYOUT.gutter}px ${padBottom}px ${LAYOUT.gutter}px;">${content}
  </td>
</tr>`;
}

// ---------------------------------------------------------------------------------------------
// Header, intro, footer
// ---------------------------------------------------------------------------------------------

export function header(): string {
  return `
<tr>
  <td class="tb-gutter" bgcolor="${COLOR.navy}" style="background-color:${COLOR.navy};padding:26px ${LAYOUT.gutter}px;border-radius:8px 8px 0 0;">
    <table ${TABLE}>
      <tr>
        <td class="tb-stack" valign="middle" style="vertical-align:middle;">
          <p style="${textStyle(TYPE.wordmark)}">${escapeHtml(BRAND)}</p>
        </td>
        <td class="tb-stack tb-stack-left" align="right" valign="middle" style="vertical-align:middle;text-align:right;">
          <p style="${textStyle(TYPE.headerLabel)}">${HEADER_LABEL}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>
<tr>
  <td height="2" bgcolor="${COLOR.accent}" style="background-color:${COLOR.accent};height:2px;font-size:2px;line-height:2px;mso-line-height-rule:exactly;">&nbsp;</td>
</tr>`;
}

export function intro(title: string, summary: string): string {
  return cardRow(
    `
    <h1 class="tb-title" style="${textStyle(TYPE.title)}">${escapeHtml(title)}</h1>
    <p style="${textStyle(TYPE.summary, 'padding-top:8px;')}">${escapeHtml(summary)}</p>`,
    36
  );
}

export function footer(view: NotificationView): string {
  return `
<tr>
  <td class="tb-gutter" style="padding:24px ${LAYOUT.gutter}px 8px ${LAYOUT.gutter}px;">
    <p style="${textStyle(TYPE.footerBrand)}">${escapeHtml(BRAND)}</p>
    <p style="${textStyle(TYPE.footer, 'padding-top:4px;')}">${escapeHtml(disclaimer(view.formName))}</p>
    <p style="${textStyle(TYPE.footer, 'padding-top:8px;')}">Reference ${escapeHtml(view.reference)}</p>
  </td>
</tr>`;
}

// ---------------------------------------------------------------------------------------------
// Submission metadata
// ---------------------------------------------------------------------------------------------

function metaCell(item: MetaItem, padRight: boolean): string {
  const value = textStyle(item.mono ? { ...TYPE.metaValue, mono: true } : TYPE.metaValue, WRAP);
  const detail = item.detail
    ? `<p style="${textStyle(TYPE.detail, `padding-top:2px;${WRAP}`)}">${escapeHtml(item.detail)}</p>`
    : '';
  return `
          <td class="tb-stack tb-meta-cell" width="50%" valign="top" style="vertical-align:top;padding:0 ${padRight ? 16 : 0}px 18px 0;">
            <p style="${textStyle(TYPE.metaLabel, 'padding-bottom:4px;')}">${escapeHtml(item.label)}</p>
            <p style="${value}">${escapeHtml(item.value)}</p>${detail}
          </td>`;
}

/** Compact two-column grid of submission metadata (one column on narrow screens). */
export function metaPanel(items: MetaItem[]): string {
  const rows: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const right = items[i + 1];
    rows.push(`
        <tr>${metaCell(items[i], true)}${right ? metaCell(right, false) : '<td class="tb-stack" width="50%">&nbsp;</td>'}
        </tr>`);
  }
  return cardRow(
    `
    <table ${TABLE} bgcolor="${COLOR.panel}" style="background-color:${COLOR.panel};">
      <tr>
        <td class="tb-panel" style="padding:20px 24px 2px 24px;">
          <table ${TABLE} style="table-layout:fixed;">${rows.join('')}
          </table>
        </td>
      </tr>
    </table>`,
    28
  );
}

// ---------------------------------------------------------------------------------------------
// Submitted details
// ---------------------------------------------------------------------------------------------

function sectionHeading(text: string): string {
  return `<p style="${textStyle(TYPE.sectionHeading, 'padding-bottom:12px;')}">${escapeHtml(text)}</p>`;
}

function fieldValueHtml(field: EmailField): string {
  const shown = displayValue(field);
  const preset = field.value ? TYPE.fieldValue : { ...TYPE.fieldValue, color: COLOR.muted };
  const href =
    field.value && field.format === 'email'
      ? mailtoHref(field.value)
      : field.value && field.format === 'phone'
        ? telHref(field.value)
        : null;
  const primary = href
    ? link(href, shown.primary, preset)
    : `<span style="${WRAP}">${escapeHtml(shown.primary)}</span>`;
  const detail = shown.detail
    ? `<br><span style="${textStyle(TYPE.detail)}">${escapeHtml(shown.detail)}</span>`
    : '';
  return `<p style="${textStyle(preset, WRAP)}">${primary}${detail}</p>`;
}

function fieldRow(field: EmailField): string {
  const rule = `border-top:1px solid ${COLOR.divider};`;
  return `
      <tr>
        <td class="tb-stack tb-field-label" width="36%" valign="top" style="vertical-align:top;padding:13px 16px 13px 0;${rule}">
          <p style="${textStyle(TYPE.fieldLabel)}">${escapeHtml(field.label)}</p>
        </td>
        <td class="tb-stack tb-field-value" valign="top" style="vertical-align:top;padding:13px 0;${rule}">
          ${fieldValueHtml(field)}
        </td>
      </tr>`;
}

function fieldsSection(heading: string, fields: EmailField[]): string {
  return cardRow(
    `
    ${sectionHeading(heading)}
    <table ${TABLE} style="table-layout:fixed;border-bottom:1px solid ${COLOR.divider};">${fields.map(fieldRow).join('')}
    </table>`,
    32
  );
}

/** Free-text answer in its own block, line breaks preserved, with a cyan rule on the left. */
function longTextSection(label: string, value: string): string {
  const body = value
    ? `<p style="${textStyle(TYPE.body, WRAP)}">${escapeMultiline(value)}</p>`
    : `<p style="${textStyle({ ...TYPE.body, color: COLOR.muted })}">${NOT_PROVIDED}</p>`;
  return cardRow(
    `
    ${sectionHeading(label)}
    <table ${TABLE} style="table-layout:fixed;">
      <tr>
        <td class="tb-panel" bgcolor="${COLOR.panel}" style="background-color:${COLOR.panel};border-left:3px solid ${COLOR.accent};padding:20px 24px;">
          ${body}
        </td>
      </tr>
    </table>`,
    32
  );
}

export function section(s: EmailSection): string {
  return s.kind === 'fields'
    ? fieldsSection(s.heading, s.fields)
    : longTextSection(s.label, s.value);
}

// ---------------------------------------------------------------------------------------------
// Reply callout
// ---------------------------------------------------------------------------------------------

/** States who a reply reaches. Mirrors the Reply-To header set by the sender. */
export function replyCallout(replyTo: NotificationView['replyTo']): string {
  let detail: string;
  if (replyTo.email) {
    const href = mailtoHref(replyTo.email);
    const address = href
      ? link(href, replyTo.email, TYPE.replyDetail)
      : `<span style="${WRAP}">${escapeHtml(replyTo.email)}</span>`;
    detail = `Your reply goes to ${address}.`;
  } else {
    detail = escapeHtml(noEmailFallback(replyTo.phone));
  }
  return cardRow(
    `
    <table ${TABLE} bgcolor="${COLOR.accentTint}" style="background-color:${COLOR.accentTint};">
      <tr>
        <td class="tb-panel" style="padding:20px 24px;">
          <p style="${textStyle(TYPE.replyLabel, 'padding-bottom:6px;')}">Reply</p>
          <p style="${textStyle(TYPE.replyLead, WRAP)}">${escapeHtml(replyLead(replyTo))}</p>
          <p style="${textStyle(TYPE.replyDetail, `padding-top:4px;${WRAP}`)}">${detail}</p>
        </td>
      </tr>
    </table>`,
    32,
    40
  );
}
