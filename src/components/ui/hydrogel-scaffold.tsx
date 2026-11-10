import * as React from 'react';

/**
 * Full-bleed "hydrogel composite" tissue scaffold for the Home Hero: a trabecular strut network
 * wound with collagen fibres and seeded with cells, rendered with three.js.
 *
 * The three.js scene is loaded lazily, so it stays out of the main bundle. The canvas never takes
 * pointer events; the scene listens on `trackRef` (the Hero section) instead, so text selection
 * and links work normally. Without WebGL 2 nothing renders and the parent's background shows.
 */
export interface HydrogelScaffoldProps {
  /** Element whose pointer movement drives parallax and the probe (the Hero section). */
  trackRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const HydrogelScaffold: React.FC<HydrogelScaffoldProps> = ({ trackRef, className }) => {
  const boxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = boxRef.current;
    const host = trackRef.current;
    if (!container || !host) return;
    let cancelled = false;
    let handle: { dispose(): void } | null = null;
    import('./hydrogel-scaffold/scene')
      .then(({ createScaffoldScene }) => {
        if (cancelled) return;
        handle = createScaffoldScene({ container, host });
      })
      .catch(() => {
        /* Chunk failed to load: keep the plain background. */
      });
    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, [trackRef]);

  return <div ref={boxRef} className={className} aria-hidden="true" />;
};
