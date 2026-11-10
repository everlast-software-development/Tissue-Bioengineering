import * as React from 'react';

/**
 * Animated "bio hologram" for the Home Hero: DNA double helices rising out of a glowing tissue
 * scaffold with cells, drawn as light with WebGL 2 (no library).
 *
 * The renderer is loaded lazily, so it stays out of the main bundle. The canvas never takes pointer
 * events; the renderer listens on `trackRef` (the Hero section), so text selection and links work.
 * Without WebGL 2 nothing renders and the parent's background shows.
 */
export interface BioHologramProps {
  /** Element whose pointer movement drives the tilt and hover glow (the Hero section). */
  trackRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const BioHologram: React.FC<BioHologramProps> = ({ trackRef, className }) => {
  const boxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = boxRef.current;
    const host = trackRef.current;
    if (!container || !host) return;
    let cancelled = false;
    let handle: { dispose(): void } | null = null;
    import('./bio-hologram/renderer')
      .then(({ createBioHologram }) => {
        if (!cancelled) handle = createBioHologram({ container, host });
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
