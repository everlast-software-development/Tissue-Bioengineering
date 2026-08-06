import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeroVideoBackgroundProps {
  posterUrl?: string;
  videoMp4Url?: string;
  videoWebmUrl?: string;
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({
  posterUrl = '/images/cellular-wound-healing-bg.png',
  videoMp4Url = '/videos/hero-biotech.mp4',
  videoWebmUrl = '/videos/hero-biotech.webm',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .then(() => {
          setVideoLoaded(true);
        })
        .catch(() => {
          setHasError(true);
        });
    }
  }, []);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    setHasError(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0">
      {/* Slow Motion Macro Parallax Background Zoom using Framer Motion */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-full h-full"
      >
        {/* Microscopic Cellular Wound Healing & Skin Regeneration Poster Image */}
        <img
          src={posterUrl}
          alt="Microscopic Skin Cell Regeneration and Extracellular Matrix Synthesis"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !hasError ? 'opacity-0' : 'opacity-100'
          }`}
          loading="eager"
        />

        {/* 4K UHD 60FPS Continuous Loop Scientific Video Player */}
        {!hasError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            poster={posterUrl}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={videoMp4Url} type="video/mp4" />
            {videoWebmUrl && <source src={videoWebmUrl} type="video/webm" />}
            {/* Scientific Biotechnology 3D CGI Motion Graphic CDN Fallback */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-blue-tech-particles-moving-in-space-41559-large.mp4"
              type="video/mp4"
            />
          </video>
        )}
      </motion.div>

      {/* Dark Navy Overlay (rgba(11, 31, 58, 0.65)) preserving text contrast & negative space */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(11, 31, 58, 0.72) 0%, rgba(11, 31, 58, 0.65) 50%, rgba(11, 31, 58, 0.82) 100%)',
        }}
      />
    </div>
  );
};
