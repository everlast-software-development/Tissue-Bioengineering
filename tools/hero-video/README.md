# Hero helix video

Source of the looping sculpture clip in the Home hero (`src/pages/Home/HeroVideo.tsx`). The
sculpture is real 3D geometry (`helixGeometry.ts`) rendered offline with Three.js (a
devDependency), so the site itself ships only video files and posters. The clip is **transparent**:
the WebGL renderer clears to alpha 0, so the frames carry the sculpture's own geometric matte (no
keying), and the hero shows it directly on the page colour.

- `public/video/hero-helix-alpha-desktop.{webm,mp4}` — 1312×1600, used from 768px up
- `public/video/hero-helix-alpha-mobile.{webm,mp4}` — 736×896, phones
  - `.webm`: VP9 with alpha (yuva420p) — Chrome, Edge, Firefox and other Blink/Gecko browsers
  - `.mp4`: HEVC with alpha (`hvc1`, VideoToolbox) — Safari and every iOS browser. WebKit drops the
    alpha of a VP9 WebM (it plays it on black), so HeroVideo.tsx picks the format per engine.
- `public/images/hero-helix-alpha-poster-{desktop,mobile}.webp` — frame 0 with alpha, the loading poster
- `public/images/hero-helix-alpha-still-{desktop,mobile}.webp` — frame 180 (0-indexed, 6.000 s) with
  alpha, shown instead of motion under `prefers-reduced-motion`, and whenever transparent playback
  is unavailable or fails (there is deliberately no opaque fallback)

Both sizes are the same tight frame: the sculpture's bounding box over the whole loop plus a 20px
(master) transparent margin, so `object-fit: contain` always shows the complete sculpture.

The loop is 12 s at 30 fps (360 frames). Every motion term in `helixLoopScene.ts` is periodic in
the loop phase (one exact turn about the helix axis plus whole-number sine sways), so frame 360
equals frame 0 and the clip loops without a seam. Nothing is ever mirrored (the helix is
right-handed) and the footage is never re-timed or re-lit: the framings only differ in canvas
size, crop and resolution.

## Regenerating

1. Render the lossless RGBA master (headless Google Chrome, software WebGL; about five minutes):

   ```sh
   node tools/hero-video/render-frames.mjs --out /tmp/helix/alpha --w 1728 --h 2160 --alpha
   ```

   Same 4:5 frame and safe area as before (identical pose, lighting and motion); `--alpha` drops
   the baked page colour, glow and dither and keeps the canvas's alpha. Fully transparent pixels
   carry the page colour, so chroma subsampling at the matte's edge never bleeds a foreign colour.

2. Encode (needs ffmpeg/ffprobe with libvpx-vp9, libwebp and hevc_videotoolbox, i.e. macOS, e.g.
   the `ffmpeg-static` and `ffprobe-static` npm packages: `FFMPEG=… FFPROBE=…`):

   ```sh
   node tools/hero-video/encode-alpha.mjs --master /tmp/helix/alpha --out /tmp/helix/out
   ```

   It measures the sculpture's union box over all 360 frames, crops each size at its exact
   proportions, encodes VP9+alpha (crf 36) and HEVC+alpha (2.5 / 1.2 Mbit/s, alpha quality 0.25,
   sRGB transfer tag: tagged BT.709, WebKit shows it ~5 luma levels too bright), writes the WebP
   posters, and verifies the WebM alpha (transparent corners, stray alpha, error against the
   master) and the loop seam. FFmpeg cannot decode HEVC alpha: check the MP4s in WebKit. Copy the
   outputs into `public/video` and `public/images`; if the frame changes, update the sizes in
   HeroVideo.tsx and `--hero-clip-ar` in src/index.css.

   Scale and convert in separate filter steps (the script does): swscale's combined
   downscale-and-convert to yuva420p lifts the transparent background to alpha 1/255, which
   browsers composite one level darker than the page, a faint visible rectangle.

The opaque pipeline (`render-frames.mjs` without `--alpha`, then `encode.mjs`) is kept for
reference; `capture.mjs` is the earlier single-step pipeline (in-browser H.264 via WebCodecs).

Type-check the render page with `npx tsc -p tools/hero-video/tsconfig.json`.
