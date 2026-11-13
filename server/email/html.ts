/** Composes the shared components into the HTML body of a notification. */
import { footer, header, intro, metaPanel, replyCallout, section } from './components.ts';
import { renderDocument } from './layout.ts';
import type { NotificationView } from './types.ts';

/** `withLogo`: the logo is attached to the message as an inline image (see logo.ts). */
export function renderHtml(view: NotificationView, withLogo: boolean): string {
  return renderDocument({
    title: view.title,
    preheader: view.preheader,
    card: [
      header(withLogo),
      intro(view.title, view.summary),
      metaPanel(view.meta),
      ...view.sections.map(section),
      replyCallout(view.replyTo),
    ].join(''),
    below: footer(view),
  });
}
