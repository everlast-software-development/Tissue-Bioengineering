/* global process, console */
// Encodes the Hero helix deliverables from lossless PNG masters (render-frames.mjs):
//
//   node tools/hero-video/encode.mjs --portrait <dir> --landscape <dir> --out <dir> \
//     [--still 180] [--desktop 1920x2400] [--mobile 1280x800] [--crop 780:490:1920:1200] \
//     [--x264crf 20] [--vp9crf 32] [--only desktop|mobile]
//
// Desktop: the 4:5 portrait master scaled to --desktop. Mobile: --crop (x:y:w:h) of the landscape
// master scaled to --mobile. Each becomes H.264 (High, yuv420p, BT.709 limited range, closed
// GOPs, keyframe at 0, faststart) and VP9 WebM, no audio, 30 fps, 360 frames, plus WebP/JPEG
// posters (frame 0: loading poster; --still: the reduced-motion frame). Then the loop seam is
// measured (frame 359 vs 0, with frame 0 vs 1 as the reference step) for every master and encode.
// Needs an ffmpeg/ffprobe with libx264, libvpx-vp9 and libwebp: $FFMPEG/$FFPROBE or on $PATH
// (for instance the ffmpeg-static and ffprobe-static npm packages).
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, f) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : f;
};
const portrait = opt('portrait');
const landscape = opt('landscape');
const out = opt('out');
if (!out || (!portrait && !landscape)) {
  console.error('usage: node tools/hero-video/encode.mjs --portrait <dir> --landscape <dir> --out <dir> [options]');
  process.exit(2);
}
const which = opt('only', 'both');
const still = Number(opt('still', 180));
const [dw, dh] = opt('desktop', '1920x2400').split('x').map(Number);
const [mw, mh] = opt('mobile', '1280x800').split('x').map(Number);
const [cx, cy, cw, ch] = opt('crop', '780:490:1920:1200').split(':').map(Number);
const x264crf = opt('x264crf', '20');
const vp9crf = opt('vp9crf', '32');
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
const probe = (f) =>
  execFileSync(FP, [
    '-v', 'error', '-count_frames', '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,profile,width,height,r_frame_rate,nb_read_frames,duration,pix_fmt,color_range,color_space,color_primaries,color_transfer',
    '-show_entries', 'format=size,bit_rate,nb_streams', '-of', 'default=nw=1', f,
  ]).toString().replace(/\n/g, ' ');
const input = (dir) => ['-framerate', '30', '-i', join(dir, 'frame-%04d.png')];
const colour = ['-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv'];
/* RGB masters to BT.709 limited-range 4:2:0 (swscale would otherwise use BT.601 for the matrix). */
const toYuv = (vf) => `${vf},scale=out_color_matrix=bt709:out_range=tv,format=yuv420p`;

function encode(name, dir, vf) {
  const mp4 = join(out, `${name}.mp4`);
  const webm = join(out, `${name}.webm`);
  console.log(`\n== ${name}: H.264 (libx264 crf ${x264crf}, preset slower, gop ${GOP} closed)`);
  run([
    ...input(dir), '-vf', toYuv(vf), '-c:v', 'libx264', '-preset', 'slower', '-crf', x264crf, '-profile:v', 'high', '-level', '4.1',
    '-g', String(GOP), '-keyint_min', String(GOP), '-sc_threshold', '0', '-x264-params', 'open-gop=0', '-bf', '2',
    ...colour, '-movflags', '+faststart', '-an', '-r', '30', mp4,
  ]);
  console.log(probe(mp4));
  console.log(`== ${name}: VP9 (libvpx-vp9 crf ${vp9crf}, good/cpu-used 1, gop ${GOP})`);
  run([
    ...input(dir), '-vf', toYuv(vf), '-c:v', 'libvpx-vp9', '-crf', vp9crf, '-b:v', '0', '-deadline', 'good', '-cpu-used', '1', '-row-mt', '1',
    '-g', String(GOP), '-keyint_min', String(GOP), ...colour, '-an', '-r', '30', webm,
  ]);
  console.log(probe(webm));
  return { mp4, webm };
}

function images(name, dir, vf) {
  for (const [label, frame] of [['poster', 0], ['still', still]]) {
    const src = join(dir, `frame-${String(frame).padStart(4, '0')}.png`);
    const webp = join(out, `hero-helix-${label}-${name}.webp`);
    const jpg = join(out, `hero-helix-${label}-${name}.jpg`);
    run(['-i', src, '-vf', vf, '-c:v', 'libwebp', '-quality', '82', '-compression_level', '6', webp]);
    run(['-i', src, '-vf', vf, '-q:v', '3', jpg]);
    console.log(`${label}-${name}: webp ${statSync(webp).size} bytes, jpg ${statSync(jpg).size} bytes (frame ${frame})`);
  }
}

function seam(label, decodeArgs) {
  const grab = (i, f) => run([...decodeArgs, '-vf', `select=eq(n\\,${i})`, '-frames:v', '1', '-vsync', '0', f]);
  const f0 = join(out, '_f0.png');
  const f359 = join(out, '_f359.png');
  const f1 = join(out, '_f1.png');
  grab(0, f0);
  grab(359, f359);
  grab(1, f1);
  const cmp = (x, y) => {
    const r = spawnSync(FF, ['-hide_banner', '-i', x, '-i', y, '-lavfi', 'ssim;[0:v][1:v]psnr', '-f', 'null', '-'], { encoding: 'utf8' });
    const s = r.stderr + r.stdout;
    return `SSIM ${s.match(/All:([\d.]+)/)?.[1]} PSNR ${s.match(/average:([\d.]+|inf)/)?.[1]} dB`;
  };
  console.log(`loop ${label.padEnd(18)} last→first ${cmp(f359, f0)} | adjacent 0→1 ${cmp(f0, f1)}`);
}

const dvf = `scale=${dw}:${dh}:flags=lanczos`;
const mvf = `crop=${cw}:${ch}:${cx}:${cy},scale=${mw}:${mh}:flags=lanczos`;
const checks = [];
if (which !== 'mobile') {
  const d = encode('hero-helix-desktop', portrait, dvf);
  images('desktop', portrait, dvf);
  checks.push(['portrait master', input(portrait)], ['desktop mp4', ['-i', d.mp4]], ['desktop webm', ['-i', d.webm]]);
}
if (which !== 'desktop') {
  const m = encode('hero-helix-mobile', landscape, mvf);
  images('mobile', landscape, mvf);
  checks.push(['landscape master', input(landscape)], ['mobile mp4', ['-i', m.mp4]], ['mobile webm', ['-i', m.webm]]);
}
console.log('\n== loop seam (frame 359 → frame 0 should match an ordinary one-frame step)');
for (const [l, a] of checks) seam(l, a);
console.log('done');
