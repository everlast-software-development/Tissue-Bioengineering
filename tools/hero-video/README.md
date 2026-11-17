# Hero helix video

Source of the looping sculpture clip in the Home hero (`src/pages/Home/HeroVideo.tsx`). The
sculpture is real 3D geometry (`helixGeometry.ts`) rendered offline with Three.js (a
devDependency), so the site itself ships only video files and posters:

- `public/video/hero-helix-desktop.{mp4,webm}` — 1920×2400 (4:5), the side-by-side layout (lg+);
  the plate shows it up to ~1190px tall, so this is 2x there
- `public/video/hero-helix-mobile.{mp4,webm}` — 1280×800 (16:10), a crop of the same footage
  framed for the stacked layout (the helix corner to corner, its lower end in the bottom-left)
- `public/images/hero-helix-poster-{desktop,mobile}.webp` — frame 0, the loading poster
- `public/images/hero-helix-still-{desktop,mobile}.webp` — frame 180 (0-indexed, 6.000 s), shown
  instead of motion under `prefers-reduced-motion` and when playback fails

The loop is 12 s at 30 fps (360 frames). Every motion term in `helixLoopScene.ts` is periodic in
the loop phase (one exact turn about the helix axis plus whole-number sine sways), so frame 360
equals frame 0 and the clip loops without a seam. Nothing is ever mirrored (the helix is
right-handed) and the footage is never re-timed or re-lit: the two framings only differ in
canvas size, crop and resolution.

## Regenerating

1. Render lossless masters (headless Google Chrome, software WebGL; about ten minutes each):

   ```sh
   node tools/hero-video/render-frames.mjs --out /tmp/helix/portrait --w 1920 --h 2400
   node tools/hero-video/render-frames.mjs --out /tmp/helix/landscape --w 2880 --h 1800 --glow 1440
   ```

   The sculpture is fitted by height, so the landscape frame holds the same sculpture at the
   same scale with more background beside it; `--glow 1440` (0.8 × the height) keeps the
   portrait master's background glow radius.

2. Encode (needs ffmpeg/ffprobe with libx264, libvpx-vp9 and libwebp, e.g. the `ffmpeg-static`
   and `ffprobe-static` npm packages: `FFMPEG=… FFPROBE=…`):

   ```sh
   node tools/hero-video/encode.mjs --portrait /tmp/helix/portrait --landscape /tmp/helix/landscape --out /tmp/helix/out
   ```

   Defaults: desktop 1920×2400, mobile crop `780:490:1920:1200` of the landscape master scaled
   to 1280×800, still frame 180, libx264 crf 20 / libvpx-vp9 crf 32. The script prints every
   file's probe and the loop-seam comparison; copy the outputs into `public/video` and
   `public/images`.

`capture.mjs` is the earlier single-step pipeline (in-browser H.264 via WebCodecs, VP8 WebM) and
writes the old 960×1200 / 640×800 names; it is kept for reference only.

Type-check the render page with `npx tsc -p tools/hero-video/tsconfig.json`.
