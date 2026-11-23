/* global process, console */
// Encodes the transparent Hero helix deliverables from an RGBA PNG master (render-frames.mjs):
//
//   node tools/hero-video/encode-alpha.mjs --master <dir> --out <dir> \
//     [--margin 0.012] [--desktop 1312x1600] [--mobile 736x896] [--still 180] \
//     [--vp9crf 36] [--hevc-desktop 2.5M] [--hevc-mobile 1.2M] [--alpha-quality 0.25]
//
// 1. Measures the sculpture's bounding box over every frame of the loop (alpha > 0) and frames it
//    with a small transparent margin (--margin, a fraction of its height), so the page can fit the
//    clip with `object-fit: contain` and show the whole sculpture, both ends included, at every
//    moment of the loop.
// 2. Crops every frame to that box, widened to exactly each output's proportions (so the scale is
//    uniform), and scales it to --desktop / --mobile. Widths that are multiples of 16 keep VP9's
//    alpha plane clean (a 738-wide test left ±1 alpha noise in the transparent area).
// 3. Encodes each size twice, both with a real alpha channel:
//      VP9 + alpha (yuva420p) in WebM, for Blink and Gecko browsers;
//      HEVC + alpha (VideoToolbox, `hvc1`, faststart) in MP4, for Safari / WebKit. Tagged with the
//      sRGB transfer: tagged BT.709, WebKit colour-manages it ~5 luma levels brighter than the
//      master. VideoToolbox on Intel Macs only takes a bitrate (no constant quality).
//    30 fps, 360 frames, no audio. Plus transparent WebP posters (frame 0 and --still).
// 4. Verifies: each WebM decodes to RGBA with transparent corners and an opaque sculpture; the
//    loop seam (frame 359 → 0 against an ordinary 0 → 1 step); probes of every file.
//    (FFmpeg cannot decode HEVC alpha; check the MP4s in WebKit itself.)
//
// Needs an ffmpeg/ffprobe with libvpx-vp9, libwebp and hevc_videotoolbox (macOS), e.g. the
// ffmpeg-static / ffprobe-static npm packages: $FFMPEG / $FFPROBE or on $PATH.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, f) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : f;
};
const master = opt('master');
const out = opt('out');
if (!master || !out) {
  console.error('usage: node tools/hero-video/encode-alpha.mjs --master <dir> --out <dir> [options]');
  process.exit(2);
}
const marginFrac = Number(opt('margin', 0.012));
const sizes = Object.fromEntries(
  [['desktop', '1312x1600'], ['mobile', '736x896']].map(([k, d]) => [k, opt(k, d).split('x').map(Number)])
);
const hevcRate = { desktop: opt('hevc-desktop', '2.5M'), mobile: opt('hevc-mobile', '1.2M') };
const still = Number(opt('still', 180));
const vp9crf = opt('vp9crf', '36');
const alphaQuality = opt('alpha-quality', '0.25');
const GOP = 180;

function findTool(name, env) {
  if (process.env[env]) return process.env[env];
  for (const dir of (process.env.PATH || '').split(':')) {
    if (dir && existsSync(join(dir, name))) return join(dir, name);
  }
  throw new Error(`${name} not found: set $${env} or put it on $PATH`);
}
const FF = findTool('ffmpeg', 'FFMPEG');
const FP = findTool('ffprobe', 'FFPROBE');
mkdirSync(out, { recursive: true });

const run = (a) => execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: ['ignore', 'inherit', 'inherit'] });
const raw = (a, max = 1 << 30) => execFileSync(FF, ['-hide_banner', '-loglevel', 'error', ...a, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], { maxBuffer: max });
const frameFile = (i) => join(master, `frame-${String(i).padStart(4, '0')}.png`);
const frames = readdirSync(master).filter((f) => /^frame-\d{4}\.png$/.test(f)).length;
if (frames !== 360) throw new Error(`expected 360 master frames, found ${frames}`);
const dims = execFileSync(FP, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', frameFile(0)]).toString().trim().split(',').map(Number);
const [MW, MH] = dims;

// 1. Union of the sculpture's alpha over the loop.
console.log(`== measuring the sculpture over ${frames} frames of ${MW}x${MH}`);
let x0 = MW, y0 = MH, x1 = -1, y1 = -1;
for (let i = 0; i < frames; i++) {
  const px = raw(['-i', frameFile(i)]);
  for (let y = 0; y < MH; y++) {
    const row = y * MW * 4;
    for (let x = 0; x < MW; x++) {
      if (px[row + x * 4 + 3] === 0) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
const bw = x1 - x0 + 1;
const bh = y1 - y0 + 1;
console.log(`union x ${x0}–${x1}, y ${y0}–${y1} (${bw}×${bh}, aspect ${(bw / bh).toFixed(4)})`);
const m = Math.round(bh * marginFrac);
/** The crop for an output of w×h: the union plus the margin, widened (or heightened) to w:h. */
function cropFor(w, h) {
  let ch = bh + 2 * m;
  let cw = Math.round((ch * w) / h);
  if (cw < bw + 2 * m) {
    cw = bw + 2 * m;
    ch = Math.round((cw * h) / w);
  }
  const cx = Math.round(x0 - (cw - bw) / 2);
  const cy = Math.round(y0 - (ch - bh) / 2);
  if (cx < 0 || cy < 0 || cx + cw > MW || cy + ch > MH) throw new Error(`crop ${cw}x${ch}+${cx}+${cy} leaves the ${MW}x${MH} master`);
  const frac = { x0: (x0 - cx) / cw, y0: (y0 - cy) / ch, x1: (x1 + 1 - cx) / cw, y1: (y1 + 1 - cy) / ch };
  console.log(`crop for ${w}×${h}: ${cw}×${ch} at ${cx},${cy} (margin ${m}px); sculpture box in the frame ${JSON.stringify(Object.fromEntries(Object.entries(frac).map(([k, v]) => [k, +v.toFixed(4)])))}`);
  return `crop=${cw}:${ch}:${cx}:${cy}`;
}

const input = ['-framerate', '30', '-i', join(master, 'frame-%04d.png')];
const probe = (f) =>
  execFileSync(FP, [
    '-v', 'error', '-count_frames', '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,codec_tag_string,profile,width,height,r_frame_rate,nb_read_frames,pix_fmt:stream_tags=alpha_mode',
    '-show_entries', 'format=duration,size,bit_rate', '-of', 'default=nw=1', f,
  ]).toString().replace(/\n/g, ' ');

const results = {};
for (const [name, [w, h]] of Object.entries(sizes)) {
  // Scale in RGBA, then convert in a separate step: swscale's combined downscale-and-convert to
  // yuva420p lifts the transparent background to alpha 1/255, which browsers composite one level
  // darker than the page (a faint rectangle). Split, the background stays at exactly 0.
  const vf = `${cropFor(w, h)},scale=${w}:${h}:flags=lanczos,format=rgba`;
  const webm = join(out, `hero-helix-alpha-${name}.webm`);
  const mp4 = join(out, `hero-helix-alpha-${name}.mp4`);
  console.log(`\n== ${name} ${w}×${h}: VP9 + alpha (crf ${vp9crf})`);
  run([
    ...input, '-vf', `${vf},format=yuva420p`, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-crf', vp9crf, '-b:v', '0',
    '-deadline', 'good', '-cpu-used', '1', '-row-mt', '1', '-g', String(GOP), '-keyint_min', String(GOP),
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-metadata:s:v:0', 'alpha_mode=1', '-an', '-r', '30', webm,
  ]);
  console.log(probe(webm));
  console.log(`== ${name} ${w}×${h}: HEVC + alpha (VideoToolbox, ${hevcRate[name]}, alpha quality ${alphaQuality})`);
  run([
    ...input, '-vf', `${vf},format=bgra`, '-c:v', 'hevc_videotoolbox', '-allow_sw', '1', '-alpha_quality', alphaQuality,
    '-b:v', hevcRate[name], '-g', String(GOP), '-tag:v', 'hvc1',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'iec61966-2-1',
    '-movflags', '+faststart', '-an', '-r', '30', mp4,
  ]);
  console.log(probe(mp4));
  for (const [label, frame] of [['poster', 0], ['still', still]]) {
    const webp = join(out, `hero-helix-alpha-${label}-${name}.webp`);
    run(['-i', frameFile(frame), '-vf', `${vf},format=yuva420p`, '-c:v', 'libwebp', '-quality', '86', '-alpha_quality', '100', '-compression_level', '6', webp]);
    console.log(`${label}-${name}: ${statSync(webp).size} bytes (frame ${frame}, ${w}×${h} with alpha)`);
  }
  results[name] = { w, h, vf, webm, mp4 };
}

// 4. Alpha verification of the WebM decode (libvpx-vp9 decodes the alpha plane) and loop seam.
const tmp = join(out, '_verify');
mkdirSync(tmp, { recursive: true });
const cmp = (a, b) => {
  const r = spawnSync(FF, ['-hide_banner', '-i', a, '-i', b, '-lavfi', 'ssim;[0:v][1:v]psnr', '-f', 'null', '-'], { encoding: 'utf8' });
  const s = r.stderr + r.stdout;
  return `SSIM ${s.match(/All:([\d.]+)/)?.[1]} PSNR ${s.match(/average:([\d.]+|inf)/)?.[1]} dB`;
};
for (const [name, { w, h, vf, webm }] of Object.entries(results)) {
  console.log(`\n== verify ${name}`);
  for (const n of [0, still]) {
    const px = raw(['-c:v', 'libvpx-vp9', '-i', webm, '-vf', `select=eq(n\\,${n})`, '-frames:v', '1', '-vsync', '0']);
    const ref = raw(['-i', frameFile(n), '-vf', vf]);
    let clear = 0, opaque = 0, partial = 0, maxErr = 0, sumErr = 0;
    for (let i = 3; i < px.length; i += 4) {
      const a = px[i];
      if (a === 0) clear++;
      else if (a === 255) opaque++;
      else partial++;
      const e = Math.abs(a - ref[i]);
      sumErr += e;
      if (e > maxErr) maxErr = e;
    }
    const corner = [px[3], px[(w - 1) * 4 + 3], px[((h - 1) * w) * 4 + 3], px[((h - 1) * w + w - 1) * 4 + 3]];
    // Stray alpha: decoded alpha > 0 more than 3 px from any sculpture pixel of the master.
    const R = 3;
    const near = new Uint8Array(w * h);
    const rowMax = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let v = 0;
      for (let d = -R; d <= R && !v; d++) { const xx = x + d; if (xx >= 0 && xx < w && ref[(y * w + xx) * 4 + 3] > 0) v = 1; }
      rowMax[y * w + x] = v;
    }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let v = 0;
      for (let d = -R; d <= R && !v; d++) { const yy = y + d; if (yy >= 0 && yy < h && rowMax[yy * w + x]) v = 1; }
      near[y * w + x] = v;
    }
    let stray = 0;
    for (let i = 0; i < w * h; i++) if (!near[i] && px[i * 4 + 3] > 0) stray++;
    console.log(`webm frame ${n}: alpha clear ${(clear / (w * h) * 100).toFixed(1)}% opaque ${(opaque / (w * h) * 100).toFixed(1)}% partial ${(partial / (w * h) * 100).toFixed(1)}% | corners ${corner.join(',')} | stray alpha > 3px from the sculpture: ${stray} px | alpha vs master: mean abs ${(sumErr / (w * h)).toFixed(3)}, max ${maxErr}`);
  }
  const grab = (src, n, f, dec = []) => run([...dec, ...src, '-vf', `select=eq(n\\,${n})`, '-frames:v', '1', '-vsync', '0', f]);
  for (const [label, src, dec] of [['webm', ['-i', webm], ['-c:v', 'libvpx-vp9']], ['master', ['-framerate', '30', '-i', join(master, 'frame-%04d.png'), '-vf', vf], []]]) {
    const f0 = join(tmp, `${name}-${label}-0.png`), f1 = join(tmp, `${name}-${label}-1.png`), f359 = join(tmp, `${name}-${label}-359.png`);
    if (label === 'master') {
      run(['-i', frameFile(0), '-vf', vf, f0]);
      run(['-i', frameFile(1), '-vf', vf, f1]);
      run(['-i', frameFile(359), '-vf', vf, f359]);
    } else {
      grab(src, 0, f0, dec);
      grab(src, 1, f1, dec);
      grab(src, 359, f359, dec);
    }
    console.log(`loop ${label.padEnd(6)} last→first ${cmp(f359, f0)} | adjacent 0→1 ${cmp(f0, f1)}`);
  }
}
rmSync(tmp, { recursive: true, force: true });
for (const f of readdirSync(out).filter((f) => f.startsWith('hero-helix-alpha-'))) console.log(`${f.padEnd(40)} ${statSync(join(out, f)).size} bytes`);
console.log('done');
