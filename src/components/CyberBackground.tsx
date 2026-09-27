import React from 'react';

/**
 * CyberBackground: Multi-layered tactical HUD background
 * 1. Blueprint Grid (Subtle geometric grid)
 * 2. CRT Scanlines (Slow scanline monitor feel)
 * 3. Static Grain (Turbulence SVG filter)
 * 4. Radial Vignette (Dark edges focusing attention on center)
 */
export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#090d16] select-none">
      {/* Layer 1: Blueprint Engineering Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />
      
      {/* Secondary larger tactical grid coordinates */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '160px 160px',
        }}
      />

      {/* Layer 2: CRT Scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8),
            rgba(0, 0, 0, 0.8) 1px,
            transparent 1px,
            transparent 2px
          )`,
          backgroundSize: '100% 2px',
        }}
      />

      {/* Layer 3: Subtle SVG Noise / Grain */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay">
        <filter id="cyber-noise">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cyber-noise)" />
      </svg>

      {/* Layer 4: Radial HUD Vignette & Subtle Cyber Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, transparent 40%, rgba(9, 13, 22, 0.85) 100%)
          `,
        }}
      />
    </div>
  );
};
