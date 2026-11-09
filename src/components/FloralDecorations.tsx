import React from 'react';

/**
 * Aesthetic Floral & Journal Decorations inspired directly by the uploaded planner image.
 */

// Discbound Spiral Spine Ring (repeated vertically to give the real physical discbound journal look)
export const DiscboundRings: React.FC<{ count?: number; className?: string }> = ({ count = 8, className = '' }) => {
  return (
    <div className={`flex flex-col justify-around items-center h-full select-none pointer-events-none py-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative flex items-center justify-center my-3 group">
          {/* Paper cutout punch hole left page */}
          <div className="w-2.5 h-4 bg-[#EADFD0] rounded-r-md -mr-1 shadow-inner opacity-80" />
          {/* Black disc ring like in the photo */}
          <div className="w-5 h-8 bg-gradient-to-r from-[#2B2320] via-[#4A3C38] to-[#201917] rounded-full shadow-md z-10 border border-[#1A1412] flex items-center justify-center">
            <div className="w-1.5 h-4 rounded-full bg-[#5E4C47] opacity-60" />
          </div>
          {/* Paper cutout punch hole right page */}
          <div className="w-2.5 h-4 bg-[#EADFD0] rounded-l-md -ml-1 shadow-inner opacity-80" />
        </div>
      ))}
    </div>
  );
};

// Hexagonal Sticker (signature motif from the user's notebook photo)
export const HexagonBadge: React.FC<{
  children?: React.ReactNode;
  variant?: 'pink' | 'sage' | 'grid' | 'cream';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ children, variant = 'pink', className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-base',
  };

  const variantStyles = {
    pink: 'bg-[#FCE4EC] border-2 border-[#F48FB1] text-[#6A2B3C]',
    sage: 'bg-[#E8F0EC] border-2 border-[#A3B899] text-[#2C4A3A]',
    grid: 'bg-[#FFFDF9] bg-grid-paper border-2 border-[#D8C7B5] text-[#5C4537] shadow-sm',
    cream: 'bg-[#FAF6EE] border-2 border-[#E5D7C5] text-[#543E30]',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center font-semibold clip-hexagon transition-transform hover:scale-105 ${sizeClasses[size]} ${variantStyles[variant]} ${className}`}
    >
      <div className="z-10 text-center px-1">{children}</div>
    </div>
  );
};

// Floral Mason Jar (seen on bottom corners of notebook)
export const FlowerMasonJar: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 90 }) => {
  return (
    <div className={`inline-block select-none pointer-events-none ${className}`} style={{ width: size, height: size * 1.3 }}>
      <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Flowers bouquet top */}
        {/* Sage leaves */}
        <path d="M50 45 C40 30 25 35 22 45 C28 48 38 48 50 45 Z" fill="#9FB8A0" opacity="0.9" />
        <path d="M55 45 C70 30 82 38 80 48 C72 50 62 48 55 45 Z" fill="#8EA88F" opacity="0.9" />
        <path d="M50 35 C52 15 62 10 70 18 C65 26 58 30 50 35 Z" fill="#A8C2A9" opacity="0.85" />
        <path d="M45 35 C35 15 25 18 28 28 C34 32 40 32 45 35 Z" fill="#A2BDA4" opacity="0.85" />

        {/* Blush Peony / Flower 1 */}
        <circle cx="38" cy="32" r="14" fill="#F8BBD0" />
        <circle cx="34" cy="28" r="9" fill="#F48FB1" opacity="0.7" />
        <circle cx="38" cy="32" r="4.5" fill="#5C382A" />
        {/* Flower petals details */}
        <circle cx="62" cy="32" r="15" fill="#FDE2BD" />
        <circle cx="66" cy="28" r="9" fill="#F5CBA7" opacity="0.8" />
        <circle cx="62" cy="32" r="5" fill="#4A3428" />

        {/* Center blue/anemone flower like in notebook */}
        <circle cx="50" cy="42" r="16" fill="#B8D8D8" />
        <circle cx="50" cy="42" r="11" fill="#E2F0F0" opacity="0.8" />
        <circle cx="50" cy="42" r="6" fill="#2E4848" />
        <circle cx="50" cy="42" r="2.5" fill="#F8F4ED" />

        {/* Small daisy accents */}
        <circle cx="28" cy="48" r="6" fill="#FFFDF9" />
        <circle cx="28" cy="48" r="2.5" fill="#E5A93C" />
        <circle cx="72" cy="46" r="6" fill="#FFFDF9" />
        <circle cx="72" cy="46" r="2.5" fill="#E5A93C" />

        {/* Mason Jar Neck & Lid */}
        <rect x="36" y="52" width="28" height="6" rx="2" fill="#E0D6C8" stroke="#B8A896" strokeWidth="1.5" />
        <rect x="33" y="58" width="34" height="4" rx="1.5" fill="#C5B6A3" />

        {/* String tag tied around jar */}
        <path d="M34 60 C40 64 60 64 66 60" stroke="#8D6E63" strokeWidth="1.2" fill="none" />
        {/* Kraft tag */}
        <rect x="56" y="62" width="12" height="16" rx="2" fill="#E8D1B5" stroke="#C9B193" strokeWidth="1" transform="rotate(12 56 62)" />
        <circle cx="60" cy="65" r="1.5" fill="#7D6254" />

        {/* Glass Jar Body */}
        <rect x="25" y="62" width="50" height="60" rx="8" fill="white" fillOpacity="0.45" stroke="#B5C9C3" strokeWidth="2" />
        {/* Water line */}
        <path d="M26 88 C38 86 62 86 74 88 L74 114 C74 118 70 121 66 121 L34 121 C30 121 26 118 26 114 Z" fill="#D6E8E3" fillOpacity="0.5" />
        {/* Flower stems in water */}
        <path d="M45 58 L42 98" stroke="#759379" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M52 58 L54 102" stroke="#68846C" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 58 L62 95" stroke="#759379" strokeWidth="2" strokeLinecap="round" />
        {/* Glass reflection highlight */}
        <path d="M30 68 L30 114" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M36 72 L36 94" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
};

// Floral Sprig Cluster (for corner flourishes)
export const FloralSprigCorner: React.FC<{ className?: string; flipped?: boolean }> = ({ className = '', flipped = false }) => {
  return (
    <div className={`select-none pointer-events-none inline-block ${flipped ? 'transform -scale-x-100' : ''} ${className}`}>
      <svg width="120" height="70" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Leaf vines */}
        <path d="M5 60 C35 55 70 45 110 15" stroke="#A3B899" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaves */}
        <path d="M25 55 C22 45 32 40 38 46 C34 52 28 55 25 55 Z" fill="#8DA382" />
        <path d="M50 48 C48 38 58 32 64 38 C60 45 54 48 50 48 Z" fill="#9FB895" />
        <path d="M75 35 C72 25 84 20 89 27 C85 33 80 36 75 35 Z" fill="#8DA382" />
        <path d="M98 22 C96 12 106 8 112 15 C108 20 102 22 98 22 Z" fill="#B3C8AB" />
        {/* Delicate Flower 1 */}
        <circle cx="42" cy="40" r="9" fill="#F8BBD0" />
        <circle cx="42" cy="40" r="3" fill="#693744" />
        {/* Delicate Flower 2 */}
        <circle cx="85" cy="20" r="8" fill="#FCE4EC" />
        <circle cx="85" cy="20" r="2.5" fill="#D87093" />
        {/* Daisy bud */}
        <circle cx="65" cy="28" r="6" fill="#FFFDF9" />
        <circle cx="65" cy="28" r="2.5" fill="#E8B86D" />
      </svg>
    </div>
  );
};

// Washi Tape Banner (like "Get it done" or floral tape in the photo)
export const WashiTape: React.FC<{
  text?: string;
  variant?: 'floral' | 'sage' | 'peach' | 'dots' | 'grid';
  className?: string;
  rotate?: string;
}> = ({ text, variant = 'floral', className = '', rotate = 'rotate-0' }) => {
  const styles = {
    floral: 'bg-gradient-to-r from-[#FDE2E4] via-[#FFF1E6] to-[#FDE2E4] border-y border-[#F4ACB7]/50 text-[#6B3A44]',
    sage: 'bg-[#E2EBE0] border-y border-[#A3B899]/60 text-[#2D4537]',
    peach: 'bg-[#FFE5D9] border-y border-[#F4A261]/40 text-[#5C382A]',
    dots: 'bg-[#F0EFEB] bg-dot-paper border-y border-[#D6CCC2] text-[#4A3B32]',
    grid: 'bg-[#FFFDF9] bg-grid-paper border-y border-[#D8C7B5] text-[#543E30]',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center px-4 py-1 text-sm font-handwriting text-lg font-bold shadow-sm tracking-wide transform ${rotate} ${styles[variant]} ${className}`}
      style={{
        clipPath: 'polygon(2% 0%, 98% 2%, 100% 50%, 98% 98%, 2% 100%, 0% 50%)',
      }}
    >
      {text && <span className="drop-shadow-xs">{text}</span>}
    </div>
  );
};

// Ribbon Page Marker / Bookmark Flag
export const RibbonFlag: React.FC<{ color?: string; className?: string }> = ({ color = '#A3B899', className = '' }) => {
  return (
    <div
      className={`w-4 h-7 inline-block shadow-sm ${className}`}
      style={{
        backgroundColor: color,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 75%, 0% 100%)',
      }}
    />
  );
};

// Sleep Mask Doodle ("I'm already tired tomorrow" sticker in photo)
export const SleepMaskSticker: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-3 bg-[#FAF2EB] border border-[#E0D0C0] rounded-xl shadow-xs text-center ${className}`}>
      <div className="font-handwriting text-[#6B5344] text-base leading-tight font-bold mb-1.5">
        &ldquo;I&apos;m already tired tomorrow&rdquo;
      </div>
      <div className="flex justify-center">
        <svg width="48" height="24" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Eyemask body */}
          <path
            d="M5 15 C5 8 12 5 22 5 C28 5 30 10 30 10 C30 10 32 5 38 5 C48 5 55 8 55 15 C55 22 47 25 38 25 C32 25 30 18 30 18 C30 18 28 25 22 25 C13 25 5 22 5 15 Z"
            fill="#B8D8D8"
            stroke="#7AA6A6"
            strokeWidth="1.5"
          />
          {/* Closed eyelashes left */}
          <path d="M16 14 C18 16 22 16 24 14" stroke="#466464" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M17 15 L16 18" stroke="#466464" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M20 16 L20 19" stroke="#466464" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M23 15 L24 18" stroke="#466464" strokeWidth="1.2" strokeLinecap="round" />
          {/* Closed eyelashes right */}
          <path d="M36 14 C38 16 42 16 44 14" stroke="#466464" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M37 15 L36 18" stroke="#466464" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M40 16 L40 19" stroke="#466464" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M43 15 L44 18" stroke="#466464" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
