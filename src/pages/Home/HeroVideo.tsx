/**
 * The helix sculpture clip in the Home hero (Hero.tsx). The clip is rendered offline from real 3D
 * geometry (tools/hero-video) with its own alpha channel: the sculpture alone, no background, so
 * it sits directly on the hero's page colour. Two sizes of the same tightly framed footage (the
 * whole sculpture over the whole loop, ends included): a large one for the side-by-side layout
 * (lg+) and a smaller one for the stacked layout. Never autoplayed by attribute, never mirrored,
 * never re-timed, never replaced by CSS motion.
 *
 * Transparency needs a codec with alpha, and browsers split on which one they decode:
 * - Chrome, Edge, Firefox (and other Blink/Gecko browsers): VP9 with alpha in WebM.
 * - Safari and every iOS browser (WebKit): HEVC with alpha (`hvc1`) in MP4. WebKit ignores the
 *   alpha of a VP9 WebM, so it must never be offered one.
 * Exactly one format is chosen up front (only that file is fetched). A browser with neither, or a
 * clip that fails to load, gets the transparent still frame instead: there is deliberately no
 * opaque fallback, so the sculpture never shows a rectangle.
 *
 * Posters (transparent WebP): the loop's first frame while the clip loads (no jump when playback
 * begins), or the chosen still frame when the user prefers reduced motion (nothing plays then).
 * Sizing and placement: `.hero-media` and `.hero-drift` in src/index.css.
 */
import * as React from 'react';

export interface HeroVideoSources {
  /** VP9 + alpha. */
  webm: string;
  /** HEVC + alpha (hvc1). */
  hevc: string;
  /** First frame of the loop. */
  poster: string;
  /** Reduced-motion frame, and the rendering when transparent playback is unavailable. */
  still: string;
  width: number;
  height: number;
}

const HERO_VIDEO: Record<'desktop' | 'mobile', HeroVideoSources> = {
  desktop: {
    webm: '/video/hero-helix-alpha-desktop.webm',
    hevc: '/video/hero-helix-alpha-desktop.mp4',
    poster: '/images/hero-helix-alpha-poster-desktop.webp',
    still: '/images/hero-helix-alpha-still-desktop.webp',
    width: 1312,
    height: 1600,
  },
  mobile: {
    webm: '/video/hero-helix-alpha-mobile.webm',
    hevc: '/video/hero-helix-alpha-mobile.mp4',
    poster: '/images/hero-helix-alpha-poster-mobile.webp',
    still: '/images/hero-helix-alpha-still-mobile.webp',
    width: 736,
    height: 896,
  },
};

type AlphaFormat = 'webm' | 'hevc' | null;

/** The one transparent format this browser can show, or null for the still frame. */
function detectAlphaFormat(): AlphaFormat {
  if (typeof document === 'undefined') return null;
  const probe = document.createElement('video');
  if (typeof probe.canPlayType !== 'function') return null;
  const ua = navigator.userAgent;
  // WebKit: Safari, and every browser on iOS/iPadOS (their UAs carry CriOS/FxiOS/EdgiOS, never
  // "Chrome/"). Blink browsers say "Chrome/" (or "Chromium/"); Gecko has no "AppleWebKit".
  const webkit = /AppleWebKit\//.test(ua) && !/(Chrome|Chromium)\//.test(ua);
  if (webkit) return probe.canPlayType('video/mp4; codecs="hvc1"') ? 'hevc' : null;
  return probe.canPlayType('video/webm; codecs="vp9"') ? 'webm' : null;
}

export interface HeroVideoProps {
  /** Which size the layout needs: `desktop` from 768px (tablet and side-by-side), `mobile` below. */
  variant: 'desktop' | 'mobile';
  /** Effective play state (motion allowed, and the hero on screen in a visible tab). */
  playing: boolean;
  reducedMotion: boolean;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ variant, playing, reducedMotion }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [format] = React.useState(detectAlphaFormat);
  const [failed, setFailed] = React.useState(false);
  const src = HERO_VIDEO[variant];

  // Play/pause follow the shared state. Autoplay policies need the muted *property* set first.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing, variant, format, failed]);

  // A clip that cannot load falls back to the still. The load can fail before React's own onError
  // is listening (the element is built off-document), so the error state is also read on mount and
  // a native listener covers later failures.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const fail = () => setFailed(true);
    if (video.error) fail();
    video.addEventListener('error', fail);
    return () => video.removeEventListener('error', fail);
  }, [variant, format]);

  if (!format || failed) {
    return (
      <img
        src={src.still}
        alt=""
        width={src.width}
        height={src.height}
        decoding="async"
        draggable={false}
        className="hero-media"
      />
    );
  }

  return (
    <video
      key={variant}
      ref={videoRef}
      className="hero-media"
      src={format === 'hevc' ? src.hevc : src.webm}
      muted
      loop
      playsInline
      preload={reducedMotion ? 'metadata' : 'auto'}
      poster={reducedMotion ? src.still : src.poster}
      width={src.width}
      height={src.height}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    />
  );
};
