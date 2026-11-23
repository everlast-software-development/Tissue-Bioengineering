import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { createNoise3D } from '@/lib/simplexNoise';

/*
 * Site-wide fluid particle layer (MainLayout): one fixed, viewport-sized, transparent canvas behind
 * every page. Particles live in a viewport-sized field that wraps vertically and is drawn offset by
 * the scroll position at a fraction of the scroll speed (parallax), so the background moves with the
 * page as one continuous surface without the canvas ever being page-sized.
 *
 * Tuning: CSS pixels and milliseconds, so the look is the same at any frame rate and pixel density.
 */
/** One particle per this many CSS px² of viewport, clamped to [MIN_PARTICLES, MAX_PARTICLES]. */
const AREA_PER_PARTICLE = 2800;
const MIN_PARTICLES = 70;
const MAX_PARTICLES = 340;
/** Spatial frequency of the flow field: lower = broader, smoother currents. */
const FIELD_SCALE = 0.0011;
/** How fast the currents themselves shift and turn. */
const FIELD_DRIFT = 0.00006;
/** Time constant (ms) for a particle's velocity to follow the field: higher = more inertia. */
const INERTIA = 900;
/** Soft smear behind each particle: GHOSTS fading copies, each GHOST_GAP seconds of motion back. */
const GHOSTS = 1;
const GHOST_GAP = 0.3;
/** Simulation step (ms): ~30 fps. At under 15 px/s a step is <0.5px, so this looks as smooth as
 *  60 fps at half the cost. While the page scrolls, frames are drawn at the display rate so the
 *  parallax stays smooth. */
const FRAME_MS = 1000 / 30;
/** Particle lifetime range (ms); each fades in and out over its life, so none pop. */
const LIFE_MIN = 7000;
const LIFE_SPAN = 9000;
/** Canvas resolution cap: 2x keeps the small dots crisp and the fill cost low. */
const MAX_DPR = 2;
/**
 * A section that paints its own opaque background at the top of a page (the Home hero, which keeps
 * its own visual). Below it the particles fade in over COVER_FADE px instead of starting at a hard
 * edge, and while it covers the whole screen the layer stops drawing.
 */
const OPAQUE_COVER = '.hero';
const COVER_FADE = 240;

/**
 * Two depth layers. Far: small, slow, deep teal #1A7F8E, barely moving with the scroll. Near:
 * larger, quicker, brand cyan #4FD6E8, moving a little more. `parallax` is the fraction of the
 * page's scroll speed.
 */
const LAYERS = [
  { rgb: '26 127 142', share: 0.55, rMin: 1.0, rSpan: 1.2, speed: 8, alpha: 0.56, parallax: 0.12 },
  { rgb: '79 214 232', share: 0.45, rMin: 1.2, rSpan: 1.6, speed: 14, alpha: 0.385, parallax: 0.3 },
] as const;

/** Soft round sprite per layer: solid core easing to transparent, so particles read as soft
 *  matter rather than hard star points. Drawn at ~2.4× the particle radius. */
const SPRITE = 32;
const SPRITE_SCALE = 2.4;
function makeSprite(rgb: string) {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
  grad.addColorStop(0, `rgb(${rgb} / 1)`);
  grad.addColorStop(0.35, `rgb(${rgb} / 0.9)`);
  grad.addColorStop(0.6, `rgb(${rgb} / 0.35)`);
  grad.addColorStop(1, `rgb(${rgb} / 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, SPRITE, SPRITE);
  return c;
}

/** One shared, seeded field: created once per page load, never per render or mount. */
const noise3D = createNoise3D(11);

interface Particle {
  layer: 0 | 1;
  /** Field position: x across the viewport, y within the vertically wrapping field. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  r: number;
  a: number;
}

/** Flow-field heading at a point: both layers share one field so neighbours drift together. */
const headingAt = (x: number, y: number, z: number) =>
  noise3D(x * FIELD_SCALE, y * FIELD_SCALE, z) * Math.PI * 2;

function spawn(p: Particle, w: number, h: number, initial: boolean, z: number) {
  const L = LAYERS[p.layer];
  p.x = Math.random() * w;
  p.y = Math.random() * h;
  // Born already moving with the current, so new particles never point the wrong way.
  const angle = headingAt(p.x, p.y, z);
  p.vx = Math.cos(angle) * L.speed;
  p.vy = Math.sin(angle) * L.speed;
  p.life = LIFE_MIN + Math.random() * LIFE_SPAN;
  // On first fill, start everywhere in the life cycle so the field isn't in lock-step.
  p.age = initial ? Math.random() * p.life : 0;
  p.r = L.rMin + Math.random() * L.rSpan;
  p.a = 0.45 + Math.random() * 0.55;
  return p;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * The site-wide background layer: two soft fixed cyan glows (index.css, `.cf-site-glow`) and faint
 * flow-field particles drifting like fluid seen under a microscope, behind all page content.
 * Mounted once by MainLayout, so route changes never start another loop.
 *
 * - One requestAnimationFrame loop for the page's lifetime, cancelled on unmount; idle while an
 *   opaque section (the Home hero) covers the screen; the browser pauses it in background tabs.
 * - No React state: the loop writes to the canvas only, so nothing re-renders.
 * - Resizes with the viewport (ResizeObserver) at the device pixel ratio (capped), keeping
 *   particles. It is sized to the large viewport (100lvh), so mobile toolbars never resize it.
 * - prefers-reduced-motion: one static frame, no loop and no parallax (follows the setting live).
 */
export const FluidParticlesBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    /** Last cover edge written to the glow layer (rounded px), so the style changes only when needed. */
    let glowEdge = NaN;
    /** The glow fades in below the opaque cover like the particles (see .cf-site-glow). */
    const setGlowEdge = (edge: number) => {
      const v = Number.isFinite(edge) ? Math.round(edge) : -1e4;
      if (!glow || v === glowEdge) return;
      glowEdge = v;
      glow.style.setProperty('--cover-bottom', `${v}px`);
    };
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sprites = LAYERS.map((L) => makeSprite(L.rgb));
    const particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let time = 0;
    let drawnScroll = -1;
    let coverCheckAt = 0;
    let cover: Element | null = null;
    /** Viewport y of the cover's bottom edge (-Infinity without one): particles fade in below it. */
    let coverBottom = -Infinity;

    const alphaOf = (p: Particle) => LAYERS[p.layer].alpha * p.a * Math.sin((Math.PI * p.age) / p.life);

    const draw = (scroll: number) => {
      drawnScroll = scroll;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const y = mod(p.y - scroll * LAYERS[p.layer].parallax, h);
        const below = (y - coverBottom) / COVER_FADE;
        if (below <= 0) continue; // under the opaque cover: not visible
        const alpha = alphaOf(p) * (below < 1 ? below * below * (3 - 2 * below) : 1);
        if (alpha < 0.01) continue;
        const sprite = sprites[p.layer];
        // A fading, smaller copy back along the motion, then the particle itself on top.
        for (let g = GHOSTS; g >= 0; g--) {
          const k = 1 - g / (GHOSTS + 1);
          const size = p.r * SPRITE_SCALE * 2 * (0.55 + 0.45 * k);
          const t = g * GHOST_GAP;
          ctx.globalAlpha = alpha * (g === 0 ? 1 : 0.32 * k);
          ctx.drawImage(sprite, p.x - p.vx * t - size / 2, y - p.vy * t - size / 2, size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const advance = (dt: number) => {
      time += dt;
      const z = time * FIELD_DRIFT;
      const follow = 1 - Math.exp(-dt / INERTIA);
      const move = dt / 1000;
      for (const p of particles) {
        const speed = LAYERS[p.layer].speed;
        const angle = headingAt(p.x, p.y, z);
        p.vx += (Math.cos(angle) * speed - p.vx) * follow;
        p.vy += (Math.sin(angle) * speed - p.vy) * follow;
        p.x += p.vx * move;
        p.y = mod(p.y + p.vy * move, h); // the field wraps vertically (see draw)
        p.age += dt;
        // Respawn (faded out) at the end of its life or once it drifts off the sides.
        if (p.age >= p.life || p.x < -4 || p.x > w + 4) spawn(p, w, h, false, z);
      }
    };

    /** Where the opaque cover is now; true when it fills the whole screen. */
    const measureCover = () => {
      if (!cover?.isConnected) {
        coverBottom = -Infinity;
        setGlowEdge(coverBottom);
        return false;
      }
      const r = cover.getBoundingClientRect();
      coverBottom = r.bottom;
      setGlowEdge(coverBottom);
      return r.top <= 0 && r.bottom >= window.innerHeight;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // Look the cover up again every 250ms (routes change under this layer); measure it each frame.
      if (now >= coverCheckAt) {
        coverCheckAt = now + 250;
        cover = document.querySelector(OPAQUE_COVER);
      }
      if (measureCover()) {
        if (drawnScroll !== -2) ctx.clearRect(0, 0, w, h);
        drawnScroll = -2; // forces a draw once it uncovers
        last = 0;
        return;
      }
      const scroll = window.scrollY;
      const due = !last || now - last >= FRAME_MS - 2;
      if (due) {
        // Clamp so a background tab or a long frame never makes particles jump.
        advance(last ? Math.min(now - last, 80) : FRAME_MS);
        last = now;
      } else if (scroll === drawnScroll) {
        return; // nothing moved: skip this display frame
      }
      draw(scroll);
    };

    const start = () => {
      if (raf || reduceMotion.matches || !w || !h) return;
      last = 0;
      coverCheckAt = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    /** The reduced-motion frame: particles still and fixed (no parallax); only the fade under the
     *  opaque cover follows the scroll, so it never shows a hard edge. */
    let stillRaf = 0;
    const drawStill = () => {
      stillRaf = 0;
      cover = document.querySelector(OPAQUE_COVER);
      measureCover();
      draw(0);
    };
    const onScroll = () => {
      if (reduceMotion.matches && !stillRaf && document.querySelector(OPAQUE_COVER)) {
        stillRaf = requestAnimationFrame(drawStill);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nw = Math.round(rect.width);
      const nh = Math.round(rect.height);
      if (!nw || !nh) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(nw * dpr);
      canvas.height = Math.round(nh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Keep existing particles where they are relative to the box, then match the count to the area.
      if (w && h) {
        for (const p of particles) {
          p.x *= nw / w;
          p.y *= nh / h;
        }
      }
      w = nw;
      h = nh;
      const target = Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.round((w * h) / AREA_PER_PARTICLE)));
      while (particles.length < target) {
        const layer = Math.random() < LAYERS[0].share ? 0 : 1;
        particles.push(spawn({ layer } as Particle, w, h, true, time * FIELD_DRIFT));
      }
      particles.length = target;

      // Resizing clears the canvas: repaint now, not on the next frame.
      if (reduceMotion.matches) drawStill();
      else draw(window.scrollY);
      start();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stop();
        drawStill();
      } else start();
    };
    reduceMotion.addEventListener('change', onMotionChange);

    return () => {
      stop();
      cancelAnimationFrame(stillRaf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      reduceMotion.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <div className={cn('pointer-events-none', className)} aria-hidden="true">
      <div ref={glowRef} className="cf-site-glow absolute inset-0" />
      <canvas ref={canvasRef} className="cf-fluid-particles absolute inset-0 h-full w-full" />
    </div>
  );
};
