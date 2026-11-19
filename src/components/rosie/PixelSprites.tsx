import React from 'react';
import type { CharacterId, CollectibleCard, MonsterId } from '../../types/rosie';

export const PixelHeart: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-5',
  color = '#EC6FA9',
}) => (
  <svg viewBox="0 0 12 11" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
    <rect x="2" y="1" width="3" height="1" fill="#392337" />
    <rect x="7" y="1" width="3" height="1" fill="#392337" />
    <rect x="1" y="2" width="4" height="3" fill={color} />
    <rect x="7" y="2" width="4" height="3" fill={color} />
    <rect x="5" y="3" width="2" height="2" fill={color} />
    <rect x="2" y="5" width="8" height="2" fill={color} />
    <rect x="3" y="7" width="6" height="1" fill={color} />
    <rect x="4" y="8" width="4" height="1" fill={color} />
    <rect x="5" y="9" width="2" height="1" fill={color} />
    <rect x="2" y="2" width="1" height="2" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

export const PixelStar: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-5',
  color = '#FFDCC8',
}) => (
  <svg viewBox="0 0 11 11" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
    <rect x="5" y="0" width="1" height="11" fill={color} />
    <rect x="0" y="4" width="11" height="2" fill={color} />
    <rect x="3" y="2" width="5" height="6" fill={color} />
    <rect x="2" y="6" width="7" height="2" fill={color} />
    <rect x="2" y="9" width="2" height="2" fill={color} />
    <rect x="7" y="9" width="2" height="2" fill={color} />
    <rect x="4" y="3" width="1" height="2" fill="#FFFFFF" opacity="0.85" />
  </svg>
);

export const PixelFlower: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 12 12" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
    <rect x="4" y="1" width="4" height="3" fill="#EC6FA9" />
    <rect x="1" y="4" width="3" height="4" fill="#FFC0D9" />
    <rect x="8" y="4" width="3" height="4" fill="#FFC0D9" />
    <rect x="4" y="8" width="4" height="3" fill="#EC6FA9" />
    <rect x="4" y="4" width="4" height="4" fill="#FFDCC8" />
    <rect x="5" y="5" width="2" height="2" fill="#FFF5EE" />
  </svg>
);

export const PixelHeartOrb: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <circle cx="8" cy="8" r="7" fill="#EC6FA9" stroke="#9E3566" strokeWidth="1.2" />
    <circle cx="6.2" cy="5.5" r="2.2" fill="#FFD6E7" opacity="0.65" />
    <path
      d="M8 12.1C8 12.1 4.1 9.5 4.1 6.7C4.1 5.4 5.1 4.5 6.3 4.5C7.1 4.5 7.7 4.9 8 5.5C8.3 4.9 8.9 4.5 9.7 4.5C10.9 4.5 11.9 5.4 11.9 6.7C11.9 9.5 8 12.1 8 12.1Z"
      fill="#392337"
      stroke="#FFC0D9"
      strokeWidth="0.6"
    />
  </svg>
);

export const PixelGamepad: React.FC<{
  className?: string;
  variant?: 'lavender' | 'cream';
}> = ({ className = 'w-11 h-7', variant = 'lavender' }) => {
  const body = variant === 'lavender' ? '#B9BFE3' : '#F4F6FF';
  const shade = variant === 'lavender' ? '#8E96C9' : '#CFD6EE';
  return (
    <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
      {/* Controller Silhouette */}
      <path
        d="M6 3 H22 L25 11 C25.6 13.4 23.9 15.5 21.8 15.5 C20.3 15.5 19.3 14.3 18.4 12.8 H9.6 C8.7 14.3 7.7 15.5 6.2 15.5 C4.1 15.5 2.4 13.4 3 11 Z"
        fill={body}
        stroke="#2B2E4A"
        strokeWidth="1.4"
      />
      <path
        d="M5 10.5 H23 L22 12.5 H6 Z"
        fill={shade}
        opacity="0.7"
      />
      {/* D-Pad */}
      <rect x="6.5" y="5.2" width="1.8" height="4.6" rx="0.4" fill="#393D63" />
      <rect x="5.1" y="6.6" width="4.6" height="1.8" rx="0.4" fill="#393D63" />
      {/* Analog sticks */}
      <circle cx="10.8" cy="10.2" r="1.5" fill="#4A4E78" />
      <circle cx="17.2" cy="10.2" r="1.5" fill="#4A4E78" />
      {/* Action buttons */}
      <circle cx="20.6" cy="5.7" r="0.9" fill="#EC6FA9" />
      <circle cx="22.4" cy="7.4" r="0.9" fill="#E34B6F" />
      <circle cx="20.6" cy="9.1" r="0.9" fill="#6AA8FF" />
      <circle cx="18.8" cy="7.4" r="0.9" fill="#77D49A" />
    </svg>
  );
};

export const CharacterSprite: React.FC<{
  id: CharacterId | CollectibleCard['spriteKind'];
  className?: string;
}> = ({ id, className = 'w-24 h-24' }) => {
  switch (id) {
    case 'rosie':
      return (
        <svg viewBox="0 0 18 20" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          {/* Dark Pixel Outline Behind Blonde Hair */}
          <rect x="5" y="1" width="8" height="1" fill="#241423" />
          <rect x="4" y="2" width="10" height="1" fill="#241423" />
          <rect x="3" y="3" width="12" height="8" fill="#241423" />
          <rect x="2" y="7" width="14" height="5" fill="#241423" />
          {/* Golden Blonde Hair + Highlights */}
          <rect x="5" y="2" width="8" height="2" fill="#F5BA3B" />
          <rect x="6" y="2" width="5" height="1" fill="#FFE98A" />
          <rect x="4" y="3" width="10" height="3" fill="#FFD55A" />
          <rect x="5" y="3" width="3" height="2" fill="#FFF2A8" />
          <rect x="11" y="4" width="2" height="1" fill="#FFF2A8" />
          {/* Flowing Wavy Blonde Side Locks */}
          <rect x="3" y="4" width="2" height="7" fill="#F5BA3B" />
          <rect x="13" y="4" width="2" height="7" fill="#F5BA3B" />
          <rect x="3" y="8" width="1" height="3" fill="#FFD55A" />
          <rect x="14" y="8" width="1" height="3" fill="#FFD55A" />
          <rect x="4" y="10" width="2" height="2" fill="#FFD55A" />
          <rect x="12" y="10" width="2" height="2" fill="#FFD55A" />
          {/* Cute Pink Hairpin */}
          <rect x="11" y="3" width="2" height="1" fill="#EC6FA9" />
          {/* Face */}
          <rect x="5" y="5" width="8" height="6" fill="#FFE2C6" />
          {/* Green Pixel Eyes (matching reference chibi character) */}
          <rect x="6" y="7" width="1" height="2" fill="#241423" />
          <rect x="6" y="8" width="1" height="1" fill="#469658" />
          <rect x="11" y="7" width="1" height="2" fill="#241423" />
          <rect x="11" y="8" width="1" height="1" fill="#469658" />
          {/* Rosy Cheeks */}
          <rect x="5" y="9" width="1" height="1" fill="#F7A8C9" />
          <rect x="12" y="9" width="1" height="1" fill="#F7A8C9" />
          {/* Pastel Sky-Blue / Pink Adventure Dress */}
          <rect x="5" y="11" width="8" height="2" fill="#241423" />
          <rect x="6" y="11" width="6" height="2" fill="#B6E0FF" />
          <rect x="4" y="13" width="10" height="4" fill="#241423" />
          <rect x="5" y="13" width="8" height="3" fill="#CFEAFF" />
          <rect x="7" y="12" width="4" height="4" fill="#FFFFFF" opacity="0.65" />
          <rect x="6" y="13" width="6" height="1" fill="#EC6FA9" />
          {/* Cute Arms */}
          <rect x="4" y="12" width="1" height="2" fill="#FFE2C6" />
          <rect x="13" y="12" width="1" height="2" fill="#FFE2C6" />
          {/* Shoes */}
          <rect x="6" y="17" width="2" height="2" fill="#241423" />
          <rect x="10" y="17" width="2" height="2" fill="#241423" />
        </svg>
      );

    case 'pixel-cat':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          {/* Ears */}
          <rect x="3" y="2" width="2" height="3" fill="#FFC0D9" />
          <rect x="11" y="2" width="2" height="3" fill="#FFC0D9" />
          <rect x="4" y="3" width="1" height="1" fill="#EC6FA9" />
          <rect x="11" y="3" width="1" height="1" fill="#EC6FA9" />
          {/* Head */}
          <rect x="3" y="4" width="10" height="6" fill="#FFF5EE" />
          <rect x="5" y="6" width="1" height="2" fill="#392337" />
          <rect x="10" y="6" width="1" height="2" fill="#392337" />
          <rect x="7" y="8" width="2" height="1" fill="#EC6FA9" />
          <rect x="4" y="7" width="1" height="1" fill="#F7A8C9" />
          <rect x="11" y="7" width="1" height="1" fill="#F7A8C9" />
          {/* Collar + Bell */}
          <rect x="4" y="10" width="8" height="1" fill="#D9C7FF" />
          <rect x="7" y="10" width="2" height="2" fill="#FFDCC8" />
          {/* Body & Tail */}
          <rect x="4" y="11" width="8" height="4" fill="#FFC0D9" />
          <rect x="12" y="9" width="2" height="4" fill="#F7A8C9" />
          <rect x="13" y="8" width="1" height="2" fill="#FFF5EE" />
          <rect x="5" y="15" width="2" height="1" fill="#392337" />
          <rect x="9" y="15" width="2" height="1" fill="#392337" />
        </svg>
      );

    case 'mystery-girl':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          {/* Plum Beret */}
          <rect x="3" y="1" width="10" height="3" fill="#392337" />
          <rect x="5" y="1" width="4" height="1" fill="#D9C7FF" />
          {/* Blonde-Tinted Bangs & Face */}
          <rect x="3" y="4" width="10" height="5" fill="#F5BA3B" />
          <rect x="4" y="4" width="8" height="5" fill="#FFDCC8" />
          <rect x="5" y="6" width="1" height="2" fill="#392337" />
          <rect x="10" y="6" width="1" height="2" fill="#392337" />
          {/* Adventure Cape & Lantern */}
          <rect x="3" y="9" width="10" height="5" fill="#7D4E8D" />
          <rect x="5" y="9" width="6" height="4" fill="#D9C7FF" />
          <rect x="12" y="10" width="3" height="3" fill="#FFDCC8" />
          <rect x="13" y="11" width="1" height="1" fill="#FFFFFF" />
          <rect x="5" y="14" width="2" height="2" fill="#392337" />
          <rect x="9" y="14" width="2" height="2" fill="#392337" />
        </svg>
      );

    case 'little-ghost':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          {/* Mini Crown */}
          <rect x="6" y="1" width="4" height="2" fill="#FFDCC8" />
          <rect x="6" y="1" width="1" height="1" fill="#EC6FA9" />
          <rect x="9" y="1" width="1" height="1" fill="#EC6FA9" />
          {/* Ghost Body */}
          <rect x="4" y="3" width="8" height="10" fill="#FFF5EE" />
          <rect x="3" y="5" width="10" height="8" fill="#FFF5EE" />
          <rect x="3" y="13" width="2" height="2" fill="#D9C7FF" />
          <rect x="7" y="13" width="2" height="2" fill="#D9C7FF" />
          <rect x="11" y="13" width="2" height="2" fill="#D9C7FF" />
          {/* Eyes & Blush */}
          <rect x="5" y="6" width="2" height="2" fill="#392337" />
          <rect x="9" y="6" width="2" height="2" fill="#392337" />
          <rect x="4" y="8" width="2" height="1" fill="#F7A8C9" />
          <rect x="10" y="8" width="2" height="1" fill="#F7A8C9" />
          <rect x="7" y="9" width="2" height="1" fill="#EC6FA9" />
        </svg>
      );

    case 'star-girl':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          {/* Star Halo */}
          <rect x="7" y="0" width="2" height="2" fill="#FFDCC8" />
          {/* Golden Blonde Hair */}
          <rect x="3" y="2" width="10" height="6" fill="#FFD55A" />
          <rect x="5" y="2" width="5" height="1" fill="#FFF2A8" />
          <rect x="4" y="4" width="8" height="5" fill="#FFF5EE" />
          <rect x="5" y="6" width="1" height="2" fill="#392337" />
          <rect x="10" y="6" width="1" height="2" fill="#392337" />
          <rect x="4" y="7" width="1" height="1" fill="#EC6FA9" />
          <rect x="11" y="7" width="1" height="1" fill="#EC6FA9" />
          {/* Celestial Dress + Wand */}
          <rect x="4" y="9" width="8" height="5" fill="#EC6FA9" />
          <rect x="6" y="10" width="4" height="3" fill="#D9C7FF" />
          <rect x="13" y="6" width="1" height="7" fill="#C94F86" />
          <rect x="12" y="4" width="3" height="3" fill="#FFDCC8" />
          <rect x="5" y="14" width="2" height="2" fill="#392337" />
          <rect x="9" y="14" width="2" height="2" fill="#392337" />
        </svg>
      );

    case 'cherry-blossom':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="7" y="9" width="2" height="6" fill="#7D4E5D" />
          <rect x="3" y="2" width="10" height="8" fill="#FFC0D9" />
          <rect x="2" y="4" width="12" height="5" fill="#F7A8C9" />
          <rect x="5" y="1" width="6" height="3" fill="#FFD6E7" />
          <rect x="5" y="5" width="2" height="2" fill="#FFFFFF" />
          <rect x="9" y="4" width="2" height="2" fill="#EC6FA9" />
          <rect x="7" y="7" width="2" height="2" fill="#FFF5EE" />
        </svg>
      );

    case 'chaos-creature':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="3" y="2" width="2" height="3" fill="#EC6FA9" />
          <rect x="11" y="2" width="2" height="3" fill="#EC6FA9" />
          <rect x="3" y="4" width="10" height="9" fill="#D9C7FF" />
          <rect x="5" y="6" width="2" height="2" fill="#392337" />
          <rect x="9" y="6" width="2" height="2" fill="#392337" />
          <rect x="6" y="10" width="4" height="2" fill="#C94F86" />
          <rect x="4" y="13" width="3" height="2" fill="#392337" />
          <rect x="9" y="13" width="3" height="2" fill="#392337" />
        </svg>
      );

    case 'lucky-star':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="7" y="1" width="2" height="14" fill="#FFDCC8" />
          <rect x="1" y="5" width="14" height="3" fill="#FFDCC8" />
          <rect x="4" y="4" width="8" height="7" fill="#FFF5EE" />
          <rect x="3" y="11" width="3" height="3" fill="#FFDCC8" />
          <rect x="10" y="11" width="3" height="3" fill="#FFDCC8" />
          <rect x="5" y="6" width="2" height="2" fill="#392337" />
          <rect x="9" y="6" width="2" height="2" fill="#392337" />
          <rect x="7" y="8" width="2" height="1" fill="#EC6FA9" />
        </svg>
      );

    case 'secret-adventure':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="2" y="4" width="12" height="9" fill="#C94F86" />
          <rect x="3" y="5" width="10" height="7" fill="#EC6FA9" />
          <rect x="2" y="7" width="12" height="2" fill="#FFDCC8" />
          <rect x="7" y="6" width="2" height="4" fill="#FFF5EE" />
          <rect x="5" y="1" width="2" height="2" fill="#FFDCC8" />
          <rect x="10" y="2" width="2" height="2" fill="#D9C7FF" />
        </svg>
      );
  }
};

export const MonsterSprite: React.FC<{ id: MonsterId; className?: string }> = ({
  id,
  className = 'w-24 h-24',
}) => {
  switch (id) {
    case 'slime-king':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="5" y="1" width="6" height="3" fill="#FFDCC8" />
          <rect x="5" y="1" width="1" height="1" fill="#EC6FA9" />
          <rect x="10" y="1" width="1" height="1" fill="#EC6FA9" />
          <rect x="3" y="5" width="10" height="8" fill="#EC6FA9" />
          <rect x="2" y="7" width="12" height="6" fill="#F7A8C9" />
          <rect x="5" y="8" width="2" height="2" fill="#392337" />
          <rect x="9" y="8" width="2" height="2" fill="#392337" />
          <rect x="7" y="11" width="2" height="1" fill="#392337" />
          <rect x="4" y="6" width="2" height="1" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );
    case 'shadow-bat':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="1" y="4" width="4" height="5" fill="#392337" />
          <rect x="11" y="4" width="4" height="5" fill="#392337" />
          <rect x="5" y="3" width="6" height="8" fill="#573654" />
          <rect x="5" y="2" width="2" height="2" fill="#392337" />
          <rect x="9" y="2" width="2" height="2" fill="#392337" />
          <rect x="6" y="6" width="1" height="2" fill="#EC6FA9" />
          <rect x="9" y="6" width="1" height="2" fill="#EC6FA9" />
          <rect x="7" y="9" width="2" height="1" fill="#FFF5EE" />
        </svg>
      );
    case 'chaos-ghost':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="4" y="2" width="8" height="11" fill="#D9C7FF" />
          <rect x="3" y="5" width="10" height="8" fill="#D9C7FF" />
          <rect x="5" y="6" width="2" height="2" fill="#C94F86" />
          <rect x="9" y="6" width="2" height="2" fill="#C94F86" />
          <rect x="6" y="9" width="4" height="2" fill="#392337" />
          <rect x="3" y="13" width="2" height="2" fill="#EC6FA9" />
          <rect x="7" y="13" width="2" height="2" fill="#EC6FA9" />
          <rect x="11" y="13" width="2" height="2" fill="#EC6FA9" />
        </svg>
      );
    case 'mushroom-monster':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="2" y="2" width="12" height="6" fill="#C94F86" />
          <rect x="4" y="3" width="2" height="2" fill="#FFF5EE" />
          <rect x="10" y="4" width="2" height="2" fill="#FFF5EE" />
          <rect x="7" y="2" width="2" height="2" fill="#FFD6E7" />
          <rect x="4" y="8" width="8" height="6" fill="#FFF5EE" />
          <rect x="5" y="10" width="2" height="2" fill="#392337" />
          <rect x="9" y="10" width="2" height="2" fill="#392337" />
        </svg>
      );
    case 'dark-forest-guardian':
      return (
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={`pixelated ${className}`} aria-hidden="true">
          <rect x="3" y="1" width="10" height="13" fill="#392337" />
          <rect x="2" y="4" width="12" height="6" fill="#573654" />
          <rect x="5" y="5" width="2" height="2" fill="#EC6FA9" />
          <rect x="9" y="5" width="2" height="2" fill="#EC6FA9" />
          <rect x="4" y="2" width="2" height="2" fill="#F7A8C9" />
          <rect x="10" y="2" width="2" height="2" fill="#FFC0D9" />
          <rect x="5" y="10" width="6" height="2" fill="#D9C7FF" />
        </svg>
      );
  }
};
