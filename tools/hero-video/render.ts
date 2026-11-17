/**
 * Render page for the Hero helix video (served by `vite tools/hero-video`, driven by capture.mjs).
 *
 * Each `window.__helixFrame(i, n)` call draws loop frame i of n: by default the sculpture over the
 * site's page colour and a soft cyan glow (an opaque frame); with `alpha=1` the sculpture alone with
 * the WebGL canvas's own alpha (what the site ships, via encode-alpha.mjs). The frame is returned as a JPEG data URL (for the
 * WebM encode in ffmpeg) and fed to one WebCodecs H.264 encoder per output size; `__helixFinish`
 * muxes those into MP4 files (mp4.ts).
 */
import { createLoopScene } from './helixLoopScene';
import { muxMp4, type Mp4Sample } from './mp4';

/* Site palette (tailwind.config.js, `cf`). */
const PAGE_BG = '#060A10';
const PAGE_BG_RGB = [0x06, 0x0a, 0x10];

export interface EncodeTarget {
  width: number;
  height: number;
  /** Target bitrate in bits per second. */
  bitrate: number;
  /** Candidate codec strings, first supported wins. */
  codecs: string[];
}

interface Target extends EncodeTarget {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  encoder: VideoEncoder;
  codec: string;
  samples: Mp4Sample[];
  avcC?: Uint8Array;
  error?: string;
}

declare global {
  interface Window {
    __helixReady?: boolean;
    __helixBegin?: (fps: number, targets: EncodeTarget[]) => Promise<string[]>;
    __helixFrame?: (index: number, total: number) => { jpeg: string; webp: string };
    __helixFinish?: () => Promise<string[]>;
  }
}

const params = new URLSearchParams(location.search);
const width = Number(params.get('w')) || 960;
const height = Number(params.get('h')) || 1200;
/* Height of the frame whose glow radius to reproduce (render-frames.mjs --glow): a
   landscape master then carries the same background light as the portrait one. */
const glowHeight = Number(params.get('glow')) || Math.min(width, height);
/* `alpha=1` (render-frames.mjs --alpha): the sculpture alone on a transparent frame, straight from
   the WebGL canvas's own alpha (no page colour, glow or dither), for the transparent encodes.
   Fully transparent pixels carry the page colour, so 4:2:0 chroma at the matte's edge never
   bleeds a foreign colour into the sculpture's outline. `safe=WxH` overrides the safe area. */
const alpha = params.get('alpha') === '1';
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

// Restrained light behind the sculpture, matching the glow the live scene used.
const glow = c2d.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, glowHeight * 0.46);
glow.addColorStop(0, 'rgba(79, 214, 232, 0.14)');
glow.addColorStop(0.55, 'rgba(26, 127, 142, 0.05)');
glow.addColorStop(1, 'rgba(26, 127, 142, 0)');

// A fixed ±1-level dither pattern breaks the 8-bit banding of the glow on the dark background
// without adding temporal noise (the same pattern every frame compresses well).
const dither = new Int8Array(width * height);
{
  let seed = 1234567;
  for (let i = 0; i < dither.length; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    dither[i] = (seed >>> 30) - 1; // -1, 0, 0, 1
  }
}

let fps = 30;
let targets: Target[] = [];

function drawFrame(index: number, total: number): void {
  scene.renderPhase((((index % total) + total) % total) / total);
  if (alpha) {
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
    return;
  }
  c2d.fillStyle = PAGE_BG;
  c2d.fillRect(0, 0, width, height);
  c2d.fillStyle = glow;
  c2d.fillRect(0, 0, width, height);
  const image = c2d.getImageData(0, 0, width, height);
  const px = image.data;
  for (let i = 0, j = 0; i < px.length; i += 4, j++) {
    const d = dither[j];
    px[i] += d;
    px[i + 1] += d;
    px[i + 2] += d;
  }
  c2d.putImageData(image, 0, 0);
  c2d.drawImage(gl, 0, 0);
}

async function pickCodec(t: EncodeTarget): Promise<string> {
  for (const codec of t.codecs) {
    const { supported } = await VideoEncoder.isConfigSupported({
      codec,
      width: t.width,
      height: t.height,
      bitrate: t.bitrate,
      framerate: fps,
      avc: { format: 'avc' },
      hardwareAcceleration: 'prefer-software',
    });
    if (supported) return codec;
  }
  throw new Error(`no supported H.264 codec for ${t.width}x${t.height} among ${t.codecs.join(', ')}`);
}

window.__helixBegin = async (framesPerSecond, wanted) => {
  fps = framesPerSecond;
  targets = [];
  for (const t of wanted) {
    const codec = await pickCodec(t);
    const canvas = document.createElement('canvas');
    canvas.width = t.width;
    canvas.height = t.height;
    const c2d = canvas.getContext('2d');
    if (!c2d) throw new Error('2D canvas unavailable');
    c2d.imageSmoothingQuality = 'high';
    const target: Target = { ...t, canvas, ctx: c2d, codec, samples: [], encoder: null as unknown as VideoEncoder };
    target.encoder = new VideoEncoder({
      output: (chunk, metadata) => {
        const description = metadata?.decoderConfig?.description;
        if (description && !target.avcC) {
          target.avcC = ArrayBuffer.isView(description)
            ? new Uint8Array(description.buffer, description.byteOffset, description.byteLength).slice()
            : new Uint8Array(description as ArrayBuffer).slice();
        }
        const data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);
        target.samples.push({ data, keyFrame: chunk.type === 'key', timestamp: chunk.timestamp });
      },
      error: (e) => {
        target.error = String(e);
      },
    });
    target.encoder.configure({
      codec,
      width: t.width,
      height: t.height,
      bitrate: t.bitrate,
      framerate: fps,
      avc: { format: 'avc' },
      hardwareAcceleration: 'prefer-software',
      latencyMode: 'quality',
    });
    targets.push(target);
  }
  return targets.map((t) => t.codec);
};

window.__helixFrame = (index, total) => {
  drawFrame(index, total);
  const frameUs = 1e6 / fps;
  for (const t of targets) {
    const source = t.width === width && t.height === height ? out : t.canvas;
    if (source !== out) t.ctx.drawImage(out, 0, 0, t.width, t.height);
    const frame = new VideoFrame(source, { timestamp: Math.round(index * frameUs), duration: Math.round(frameUs) });
    t.encoder.encode(frame, { keyFrame: index % (fps * 2) === 0 });
    frame.close();
  }
  return {
    jpeg: out.toDataURL('image/jpeg', 1),
    webp: index === 0 ? out.toDataURL('image/webp', 0.9) : '',
  };
};

const toDataUrl = (bytes: Uint8Array) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(new Blob([bytes as BlobPart], { type: 'video/mp4' }));
  });

window.__helixFinish = async () => {
  const files: string[] = [];
  for (const t of targets) {
    await t.encoder.flush();
    t.encoder.close();
    if (t.error) throw new Error(`encoder failed for ${t.width}x${t.height}: ${t.error}`);
    if (!t.avcC) throw new Error(`no decoder configuration for ${t.width}x${t.height}`);
    files.push(await toDataUrl(muxMp4({ width: t.width, height: t.height, fps, samples: t.samples, avcC: t.avcC })));
  }
  targets = [];
  return files;
};

drawFrame(0, 1);
window.__helixReady = true;
