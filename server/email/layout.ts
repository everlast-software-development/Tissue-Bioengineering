/**
 * The document shell every notification shares: head, responsive rules, inbox preview text and
 * the centred, fluid card (max 640px; a fixed-width "ghost table" keeps Outlook for Windows,
 * which ignores max-width, at the same width).
 */
import { escapeHtml } from './format.ts';
import { COLOR, LAYOUT } from './theme.ts';
import { TABLE } from './components.ts';

/**
 * Responsive overrides. Clients that drop <style> (or media queries) get the desktop layout,
 * which is fluid and still readable on a phone. Kept free of selectors Gmail rejects.
 */
const RESPONSIVE_CSS = `
  body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  a { color: ${COLOR.accentText}; }
  @media only screen and (max-width: ${LAYOUT.breakpoint}px) {
    .tb-outer { padding: 0 !important; }
    .tb-card { border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
    .tb-gutter { padding-left: ${LAYOUT.mobileGutter}px !important; padding-right: ${LAYOUT.mobileGutter}px !important; border-radius: 0 !important; }
    .tb-panel { padding-left: 16px !important; padding-right: 16px !important; }
    .tb-title { font-size: 21px !important; line-height: 28px !important; }
    .tb-stack { display: block !important; width: 100% !important; box-sizing: border-box; }
    .tb-stack-left { text-align: left !important; padding-top: 4px !important; }
    .tb-meta-cell { padding-right: 0 !important; }
    .tb-field-label { padding: 12px 0 2px 0 !important; }
    .tb-field-value { padding: 0 0 12px 0 !important; border-top: 0 !important; }
  }`;

export interface DocumentParts {
  title: string;
  preheader: string;
  /** Card rows (<tr>…</tr>). */
  card: string;
  /** Rows under the card, on the page background (<tr>…</tr>). */
  below: string;
}

/** Hidden inbox preview text, padded so clients don't pull body text into the preview. */
function preheader(text: string): string {
  const filler = '&#8199;&#847;'.repeat(60);
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(text)}${filler}</div>`;
}

export function renderDocument(parts: DocumentParts): string {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(parts.title)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>${RESPONSIVE_CSS}
</style>
</head>
<body style="margin:0;padding:0;background-color:${COLOR.canvas};" bgcolor="${COLOR.canvas}">
${preheader(parts.preheader)}
<table ${TABLE} bgcolor="${COLOR.canvas}" style="background-color:${COLOR.canvas};">
  <tr>
    <td class="tb-outer" align="center" style="padding:32px 16px;">
      <!--[if mso]><table role="presentation" width="${LAYOUT.maxWidth}" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table ${TABLE} align="center" style="max-width:${LAYOUT.maxWidth}px;margin:0 auto;">
        <tr>
          <td>
            <table ${TABLE} class="tb-card" bgcolor="${COLOR.surface}" style="background-color:${COLOR.surface};border:1px solid ${COLOR.divider};border-radius:8px;">${parts.card}
            </table>
          </td>
        </tr>${parts.below}
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td>
  </tr>
</table>
</body>
</html>
`;
}
