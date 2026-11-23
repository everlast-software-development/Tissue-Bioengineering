/**
 * Render page for the Hero helix video (served by `vite tools/hero-video`, driven by
 * render-frames.mjs).
 *
 * Each `window.__helixFrame(i, n)` call draws loop frame i of n onto the page's canvas: the
 * sculpture alone with the WebGL canvas's own alpha (what the site ships, via encode-alpha.mjs).
 * Fully transparent pixels carry the page colour, so 4:2:0 chroma at the matte's edge never
 * bleeds a foreign colour into the sculpture's outline. `safe=WxH` overrides the safe area (the
 * fraction of the frame the sculpture fills at rest).
 */
import { createLoopScene } from './helixLoopScene';

/* Site page colour (tailwind.config.js, `cf.bg`). */
const PAGE_BG_RGB = [0x06, 0x0a, 0x10];

declare global {
  interface Window {
    __helixReady?: boolean;
    __helixFrame?: (index: number, total: number) => void;
  }
}

const params = new URLSearchParams(location.search);
const width = Number(params.get('w')) || 960;
const height = Number(params.get('h')) || 1200;
const [safeWidth, safeHeight] = (params.get('safe') || '0.9x0.78').split('x').map(Number);

const gl = document.createElement('canvas');
gl.width = width;
gl.height = height;
const out = document.createElement('canvas');
out.width = width;
out.height = height;
out.style.cssText = 'display:block;max-width:100vw;max-height:100vh';
document.body.append(out);
const ctx = out.getContext('2d') as CanvasRenderingContext2D | null;
if (!ctx) throw new Error('2D canvas unavailable');
const c2d: CanvasRenderingContext2D = ctx;

const scene = createLoopScene({ canvas: gl, width, height, safeWidth, safeHeight });

function drawFrame(index: number, total: number): void {
  scene.renderPhase((((index % total) + total) % total) / total);
  c2d.clearRect(0, 0, width, height);
  c2d.drawImage(gl, 0, 0);
  const image = c2d.getImageData(0, 0, width, height);
  const px = image.data;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) {
      px[i] = PAGE_BG_RGB[0];
      px[i + 1] = PAGE_BG_RGB[1];
      px[i + 2] = PAGE_BG_RGB[2];
    }
  }
  c2d.putImageData(image, 0, 0);
}

window.__helixFrame = drawFrame;

drawFrame(0, 1);
window.__helixReady = true;
