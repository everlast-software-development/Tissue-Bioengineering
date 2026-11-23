import React from 'react';
import { Calendar, PhoneCall } from 'lucide-react';
import { SITE_METADATA } from '@/lib/site';
import { Ltr } from '@/components/common/Ltr';
import { Link } from '@/i18n/Link';
import { useI18n } from '@/i18n/context';

/* ── Cellular texture ─────────────────────────────────────────────────────── */

const WIDTH = 1200;
const HEIGHT = 800;
const COLS = 11;
const ROWS = 8;

/** Small seeded generator so the field is identical on every render and build. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface Cell {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
  nx: number;
  ny: number;
  nr: number;
  opacity: number;
}

/** A loose epithelial-like sheet: offset rows of irregular cells, each with a nucleus. */
const CELLS: Cell[] = (() => {
  const rand = seeded(7);
  const pitchX = WIDTH / COLS;
  const pitchY = HEIGHT / ROWS;
  const cells: Cell[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      cells.push({
        cx: (col + 0.5 + (row % 2) * 0.5) * pitchX + (rand() - 0.5) * 26,
        cy: (row + 0.5) * pitchY + (rand() - 0.5) * 22,
        rx: 36 + rand() * 14,
        ry: 30 + rand() * 12,
        rotate: rand() * 180,
        nx: (rand() - 0.5) * 14,
        ny: (rand() - 0.5) * 10,
        nr: 7 + rand() * 5,
        opacity: 0.35 + rand() * 0.65,
      });
    }
  }
  return cells;
})();

/**
 * Decorative cellular texture behind the closing CTA. Static SVG in `currentColor`; color,
 * opacity and mask come from the parent (`.svc-cells-cta` in index.css).
 */
const CellField: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="none" stroke="currentColor" strokeWidth={1}>
      {CELLS.map((c, i) => (
        <g key={i} opacity={c.opacity} transform={`rotate(${c.rotate.toFixed(1)} ${c.cx.toFixed(1)} ${c.cy.toFixed(1)})`}>
          <ellipse
            cx={c.cx.toFixed(1)}
            cy={c.cy.toFixed(1)}
            rx={c.rx.toFixed(1)}
            ry={c.ry.toFixed(1)}
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={(c.cx + c.nx).toFixed(1)}
            cy={(c.cy + c.ny).toFixed(1)}
            r={c.nr.toFixed(1)}
            fill="currentColor"
            fillOpacity={0.35}
            stroke="none"
          />
        </g>
      ))}
    </g>
  </svg>
);

/** Splits off the last word so it can be kept on one line ("Bio-Grafting" never breaks at its hyphen). */
const splitLastWord = (text: string): [string, string] => {
  const i = text.lastIndexOf(' ');
  return i === -1 ? ['', text] : [text.slice(0, i + 1), text.slice(i + 1)];
};

/**
 * Closing consultation band for the Services page. Same copy and destinations as the shared
 * CTASection (components/common/CTASection.tsx, both read `cta` from the dictionaries). It has
 * its own layout so it can close the page with the hero's cellular texture instead of a photo
 * (the shared band's SEM image is already shown by service 03 on this page).
 */
export const ServicesClosingCTA: React.FC = () => {
  const { t } = useI18n();
  const [accentStart, accentEnd] = splitLastWord(t.cta.titleAccent);
  return (
    <section className="py-14 sm:py-24 lg:py-28" aria-labelledby="cta-heading">
      <div className="cf-container">
        <div className="relative isolate overflow-hidden rounded-2xl border border-cf-line-strong bg-cf-raised">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="svc-glow-cta absolute inset-0" />
            <CellField className="svc-cells-cta absolute inset-0 h-full w-full text-cf-accent" />
          </div>

          <div className="grid gap-10 p-7 sm:p-12 lg:grid-cols-12 lg:items-end lg:gap-16 lg:p-16">
            <div className="lg:col-span-7">
              <p className="cf-eyebrow">{t.cta.eyebrow}</p>
              <h2 id="cta-heading" className="cf-h2 max-w-[17ch]">
                {t.cta.titleBefore}
                <span className="svc-gradient-text">
                  {accentStart}
                  <span className="whitespace-nowrap">{accentEnd}</span>
                </span>
                {t.cta.titleAfter}
              </h2>
              <p className="cf-lead mt-6 max-w-xl">{t.cta.lead}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:flex-col lg:border-s lg:border-cf-line lg:ps-12">
              <Link to="/consultation" className="cf-btn cf-btn-primary min-h-[52px]">
                <Calendar className="h-5 w-5" aria-hidden="true" />
                {t.common.bookConsultationNow}
              </Link>
              <a
                href={`tel:${SITE_METADATA.contact.phone}`}
                className="cf-btn min-h-[52px] border border-cf-line-strong bg-cf-bg/40 py-2 text-cf-text hover:border-cf-accent hover:text-cf-accent"
              >
                <PhoneCall className="h-5 w-5 shrink-0 text-cf-accent" aria-hidden="true" />
                <span className="flex flex-wrap justify-center gap-x-1.5">
                  <span>{t.common.callHotline}</span>
                  <Ltr className="whitespace-nowrap">{SITE_METADATA.contact.phone}</Ltr>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
