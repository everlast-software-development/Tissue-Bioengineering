import React from 'react';

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
 * Decorative cellular texture for the Services hero and closing CTA. Static SVG in
 * `currentColor`; set color, opacity and any mask from the parent.
 */
export const CellField: React.FC<{ className?: string }> = ({ className }) => (
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
