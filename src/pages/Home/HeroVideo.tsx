/**
 * The helix sculpture clip in the Home hero's plate (Hero.tsx). The clip is rendered offline from
 * real 3D geometry (tools/hero-video) and shipped in two framings: a 4:5 portrait encode for the
 * side-by-side layout (lg+) and a 16:10 landscape crop of the same footage for the stacked
 * layout. This component picks one by the layout's breakpoint before anything loads (only that
 * file is fetched; crossing the breakpoint swaps it) and plays or pauses it on request; the play
 * state itself lives in Hero.tsx, shared with the ticker. Never autoplayed by attribute, never
 * mirrored, never replaced by CSS motion.
 *
 * Posters: the loop's first frame while the clip loads (no jump when playback begins), or the
 * chosen still frame when the user prefers reduced motion (nothing plays until they press Play).
 * Positioning and cropping: `.hero-media` in src/index.css.
 */
import * as React from 'react';

export interface HeroVideoSources {
  webm: string;
  mp4: string;
  /** First frame of the loop. */
  poster: string;
  /** Reduced-motion frame (also the alt rendering when playback fails). */
  still: string;
  width: number;
  height: number;
}

const HERO_VIDEO: Record<'desktop' | 'mobile', HeroVideoSources> = {
  desktop: {
    webm: '/video/hero-helix-desktop.webm',
    mp4: '/video/hero-helix-desktop.mp4',
    poster: '/images/hero-helix-poster-desktop.webp',
    still: '/images/hero-helix-still-desktop.webp',
    width: 1920,
    height: 2400,
  },
  mobile: {
    webm: '/video/hero-helix-mobile.webm',
    mp4: '/video/hero-helix-mobile.mp4',
    poster: '/images/hero-helix-poster-mobile.webp',
    still: '/images/hero-helix-still-mobile.webp',
    width: 1280,
    height: 800,
  },
};

export interface HeroVideoProps {
  /** Which framing the layout is showing (lg+ is the side-by-side layout). */
  variant: 'desktop' | 'mobile';
  /** Effective play state (user's choice, and the hero on screen in a visible tab). */
  playing: boolean;
  reducedMotion: boolean;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({ variant, playing, reducedMotion }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
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
  }, [playing, variant]);

  if (failed) {
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
      onError={() => setFailed(true)}
    >
      <source src={src.webm} type="video/webm" />
      <source src={src.mp4} type="video/mp4" onError={() => setFailed(true)} />
    </video>
  );
};
