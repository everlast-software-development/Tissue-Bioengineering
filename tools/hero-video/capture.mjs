/* global process, console, fetch, setTimeout, WebSocket, Buffer */
// Renders and encodes the Hero helix loop with headless Google Chrome (software WebGL and
// WebCodecs H.264; no dependencies beyond this repo's Vite and Three.js) and, when an ffmpeg with
// libvpx is available, encodes the WebM variants too.
//
//   node tools/hero-video/capture.mjs --out <dir> [--frames 360] [--fps 30] [--publish]
//
// Writes hero-helix-960x1200.mp4, hero-helix-640x800.mp4, poster.webp, frame-NNNN.jpg and (with
// ffmpeg) hero-helix-960x1200.webm, hero-helix-640x800.webm into <dir>; --publish also copies the
// videos and poster into public/. See README.md.
import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const outDir = opt('out');
if (!outDir) {
  console.error('usage: node tools/hero-video/capture.mjs --out <dir> [--frames 360] [--fps 30] [--publish]');
  process.exit(2);
}
const frames = Number(opt('frames', 360));
const fps = Number(opt('fps', 30));
const publish = args.includes('--publish');
const vitePort = Number(opt('port', 3200));
const cdpPort = Number(opt('cdp-port', 9377));
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const WIDTH = 960;
const HEIGHT = 1200;
/** Output sizes: desktop (from lg) and the lighter file for smaller screens. */
const TARGETS = [
  { name: 'hero-helix-960x1200', width: 960, height: 1200, bitrate: 2_600_000, webmBitrate: '2200k', codecs: ['avc1.640028', 'avc1.4d0028', 'avc1.42e028'] },
  { name: 'hero-helix-640x800', width: 640, height: 800, bitrate: 1_300_000, webmBitrate: '1100k', codecs: ['avc1.64001f', 'avc1.4d001f', 'avc1.42e01f'] },
];
mkdirSync(outDir, { recursive: true });

function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  for (const dir of (process.env.PATH || '').split(':')) {
    if (dir && existsSync(join(dir, 'ffmpeg'))) return join(dir, 'ffmpeg');
  }
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  if (existsSync(cache)) {
    for (const entry of readdirSync(cache).filter((e) => e.startsWith('ffmpeg-')).sort().reverse()) {
      const bin = join(cache, entry, 'ffmpeg-mac');
      if (existsSync(bin)) return bin;
    }
  }
  return null;
}

const vite = spawn('npx', ['vite', 'tools/hero-video', '--port', String(vitePort), '--strictPort', '--no-open'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise((res, rej) => {
  vite.stdout.on('data', (d) => {
    if (String(d).includes('Local:')) res();
  });
  vite.on('exit', (code) => rej(new Error(`vite exited with ${code}`)));
});

const browser = spawn(
  chrome,
  [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${mkdtempSync(join(tmpdir(), 'helix-render-'))}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

const cleanup = () => {
  browser.kill();
  vite.kill();
};
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const save = (file, dataUrl) => writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));

try {
  let page;
  for (let i = 0; i < 50 && !page; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json`)).json();
      page = targets.find((t) => t.type === 'page');
    } catch {
      await sleep(200);
    }
  }
  if (!page) throw new Error('Chrome did not expose a page target');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    const waiter = msg.id && pending.get(msg.id);
    if (!waiter) return;
    pending.delete(msg.id);
    if (msg.error) waiter.rej(new Error(msg.error.message));
    else waiter.res(msg.result);
  };
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      pending.set(++id, { res, rej });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: `http://localhost:${vitePort}/?w=${WIDTH}&h=${HEIGHT}` });
  for (let i = 0; i < 300; i++) {
    if (await evaluate('window.__helixReady === true')) break;
    await sleep(200);
  }
  if (!(await evaluate('window.__helixReady === true'))) throw new Error('render page did not become ready');

  const codecs = await evaluate(`window.__helixBegin(${fps}, ${JSON.stringify(TARGETS.map(({ width, height, bitrate, codecs }) => ({ width, height, bitrate, codecs })))})`);
  console.log(`H.264 codecs: ${codecs.join(', ')}`);

  const started = Date.now();
  for (let i = 0; i < frames; i++) {
    const frame = await evaluate(`window.__helixFrame(${i}, ${frames})`);
    save(join(outDir, `frame-${String(i).padStart(4, '0')}.jpg`), frame.jpeg);
    if (i === 0) save(join(outDir, 'poster.webp'), frame.webp);
    if (i % 30 === 0 || i === frames - 1) {
      console.log(`frame ${i + 1}/${frames} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
    }
  }
  const mp4s = await evaluate('window.__helixFinish()');
  TARGETS.forEach((t, i) => save(join(outDir, `${t.name}.mp4`), mp4s[i]));
  ws.close();
} finally {
  cleanup();
}

const ffmpeg = findFfmpeg();
if (ffmpeg) {
  const jpegs = readdirSync(outDir)
    .filter((f) => /^frame-\d+\.jpg$/.test(f))
    .sort()
    .map((f) => readFileSync(join(outDir, f)));
  for (const t of TARGETS) {
    const outFile = join(outDir, `${t.name}.webm`);
    const scale = t.width === WIDTH ? [] : ['-vf', `scale=${t.width}:${t.height}`];
    await new Promise((res, rej) => {
      const ff = spawn(
        ffmpeg,
        ['-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', 'pipe:0', ...scale,
          '-c:v', 'libvpx', '-b:v', t.webmBitrate, '-crf', '8', '-quality', 'best', '-cpu-used', '0', '-auto-alt-ref', '1',
          '-lag-in-frames', '25', '-g', String(fps * 2), '-pix_fmt', 'yuv420p', '-an', '-y', outFile],
        { stdio: ['pipe', 'inherit', 'inherit'] }
      );
      ff.on('exit', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited with ${code}`))));
      for (const j of jpegs) ff.stdin.write(j);
      ff.stdin.end();
    });
    console.log(`wrote ${outFile}`);
  }
} else {
  console.warn('ffmpeg not found: WebM files not written (set FFMPEG=/path/to/ffmpeg).');
}

if (publish) {
  mkdirSync(join(root, 'public/video'), { recursive: true });
  for (const t of TARGETS) {
    for (const ext of ['mp4', 'webm']) {
      const file = join(outDir, `${t.name}.${ext}`);
      if (existsSync(file)) copyFileSync(file, join(root, 'public/video', `${t.name}.${ext}`));
    }
  }
  copyFileSync(join(outDir, 'poster.webp'), join(root, 'public/images/hero-helix-poster.webp'));
  console.log('published to public/video and public/images');
}
