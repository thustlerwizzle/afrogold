import React from 'react';

type AnimatedLogoProps = {
  size?: number;
};

// Animated Web3-style logo: rotating hex with pulsating glow and a gold orbit
const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 44 }) => {
  const s = Math.max(32, size);
  return (
    <div className="afg-logo afg-color-cycle" style={{ width: s, height: s }} aria-label="AfroGold Logo">
      <svg viewBox="0 0 120 120" width={s} height={s}>
        <defs>
          <linearGradient id="afgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6"/>
            <stop offset="50%" stopColor="#0EA5E9"/>
            <stop offset="100%" stopColor="#22C55E"/>
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A"/>
            <stop offset="50%" stopColor="#F59E0B"/>
            <stop offset="100%" stopColor="#FDE68A"/>
          </linearGradient>
          <filter id="afgGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="afg-rotor" filter="url(#afgGlow)">
          <polygon points="60,6 110,36 110,84 60,114 10,84 10,36" fill="none" stroke="url(#afgGrad)" strokeWidth="6" />
        </g>
        <g className="afg-core">
          <circle cx="60" cy="60" r="20" fill="url(#afgGrad)" opacity="0.9" />
          <rect x="46" y="58" width="28" height="4" rx="2" fill="#0f172a" opacity="0.9" />
          <rect x="46" y="66" width="28" height="4" rx="2" fill="#0f172a" opacity="0.9" />
        </g>

        {/* Digital gold orbit */}
        <g className="afg-orbit">
          <circle cx="60" cy="60" r="38" fill="none" stroke="url(#goldGrad)" strokeWidth="2" opacity="0.6" />
          <g className="afg-orbit-dot">
            <circle cx="60" cy="22" r="3.5" fill="#FDE68A" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedLogo;


