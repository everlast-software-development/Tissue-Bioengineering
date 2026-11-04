import React from 'react';

interface HeroVideoBackgroundProps {
  posterUrl?: string;
  videoMp4Url?: string;
  videoWebmUrl?: string;
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({
  videoMp4Url = '/videos/dna-video.mp4',
}) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src={videoMp4Url}
        style={{ transform: 'translateZ(0)' }}
      />
      <div className="absolute inset-0 z-10 bg-black/30 pointer-events-none" />
    </div>
  );
};
