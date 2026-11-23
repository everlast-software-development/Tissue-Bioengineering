/* global process, console, fetch, setTimeout, WebSocket, Buffer */
// Renders the Hero helix loop (helixLoopScene.ts, a deterministic scene) to lossless RGBA PNG
// frames with headless Google Chrome, as the master for encode-alpha.mjs:
//
//   node tools/hero-video/render-frames.mjs --out <dir> [--w 1920 --h 2400] [--frames 360] [--safe 0.9x0.78]
//
// The frames are the sculpture alone with its real alpha channel (no background). --w/--h set the
// frame size (the sculpture is fitted by height, so a wider frame only adds transparent margin).
// --safe WxH is the fraction of the frame the sculpture fills at rest (default 0.9x0.78).
// Needs Google Chrome at /Applications/Google Chrome.app (or $CHROME); software WebGL, so a
// 1920×2400 master takes about ten minutes.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (n, f) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : f; };
const outDir = opt('out');
if (!outDir) {
  console.error('usage: node tools/hero-video/render-frames.mjs --out <dir> [--w 1920 --h 2400] [--frames 360] [--safe 0.9x0.78]');
  process.exit(2);
}
const WIDTH = Number(opt('w', 1920));
const HEIGHT = Number(opt('h', 2400));
const frames = Number(opt('frames', 360));
const safe = opt('safe');
const vitePort = Number(opt('port', 3201));
const cdpPort = Number(opt('cdp-port', 9378));
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
mkdirSync(outDir, { recursive: true });

const vite = spawn('npx', ['vite', 'tools/hero-video', '--port', String(vitePort), '--strictPort', '--no-open'], { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((res, rej) => {
  vite.stdout.on('data', (d) => { if (String(d).includes('Local:')) res(); });
  vite.on('exit', (code) => rej(new Error(`vite exited with ${code}`)));
});
const browser = spawn(chrome, ['--headless=new', `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'helix-render-'))}`, `--window-size=${WIDTH},${HEIGHT}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank'], { stdio: 'ignore' });
const cleanup = () => { browser.kill(); vite.kill(); };
process.on('SIGINT', () => { cleanup(); process.exit(130); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let page;
  for (let i = 0; i < 50 && !page; i++) {
    try { page = (await (await fetch(`http://127.0.0.1:${cdpPort}/json`)).json()).find((t) => t.type === 'page'); } catch { await sleep(200); }
  }
  if (!page) throw new Error('Chrome did not expose a page target');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    const waiter = msg.id && pending.get(msg.id);
    if (!waiter) return;
    pending.delete(msg.id);
    if (msg.error) waiter.rej(new Error(msg.error.message)); else waiter.res(msg.result);
  };
  const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  const query = `?w=${WIDTH}&h=${HEIGHT}${safe ? `&safe=${safe}` : ''}`;
  await send('Page.navigate', { url: `http://localhost:${vitePort}/${query}` });
  // The first frame (scene set-up and the environment map) can take minutes in software WebGL.
  for (let i = 0; i < 6000; i++) { if (await evaluate('window.__helixReady === true')) break; await sleep(200); }
  if (!(await evaluate('window.__helixReady === true'))) throw new Error('render page did not become ready');
  const started = Date.now();
  for (let i = 0; i < frames; i++) {
    const png = await evaluate(`(window.__helixFrame(${i}, ${frames}), document.querySelector('canvas').toDataURL('image/png'))`);
    writeFileSync(join(outDir, `frame-${String(i).padStart(4, '0')}.png`), Buffer.from(png.split(',')[1], 'base64'));
    if (i % 30 === 0 || i === frames - 1) console.log(`frame ${i + 1}/${frames} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
  }
  ws.close();
} finally {
  cleanup();
}
console.log(`wrote ${frames} frames to ${outDir}`);
