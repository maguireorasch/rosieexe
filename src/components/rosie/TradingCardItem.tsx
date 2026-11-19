import React from 'react';
import type { CardSceneTheme, CollectibleCard } from '../../types/rosie';
import {
  CharacterSprite,
  PixelFlower,
  PixelGamepad,
  PixelHeart,
  PixelHeartOrb,
  PixelStar,
} from './PixelSprites';

interface TradingCardItemProps {
  card: CollectibleCard;
  unlocked: boolean;
  flipped: boolean;
  onFlip: () => void;
  onViewDetails?: () => void;
  compact?: boolean;
}

const SCENE_PALETTE: Record<
  CardSceneTheme,
  {
    skyTop: string;
    skyMid: string;
    skyHorizon: string;
    sun: string;
    city: string;
    sakura: string;
    sakuraLight: string;
    water: string;
    deck: string;
    deckLine: string;
  }
> = {
  'cherry-garden': {
    skyTop: '#C94F86',
    skyMid: '#FF988B',
    skyHorizon: '#FFE99D',
    sun: '#FFF8D6',
    city: '#784E79',
    sakura: '#EC6FA9',
    sakuraLight: '#FFC4DD',
    water: '#5B628F',
    deck: '#9F6248',
    deckLine: '#5E3426',
  },
  'pink-sunset': {
    skyTop: '#B53E78',
    skyMid: '#FF857B',
    skyHorizon: '#FFE393',
    sun: '#FFF6CE',
    city: '#6E3E6F',
    sakura: '#E55A8E',
    sakuraLight: '#FFBBD5',
    water: '#4E507B',
    deck: '#965A40',
    deckLine: '#562D20',
  },
  'lavender-forest': {
    skyTop: '#4A2B63',
    skyMid: '#B87FD4',
    skyHorizon: '#FFD1E8',
    sun: '#FFF5EE',
    city: '#39234D',
    sakura: '#D9C7FF',
    sakuraLight: '#F3EAFF',
    water: '#3E3361',
    deck: '#7D546B',
    deckLine: '#3F2537',
  },
  'pink-castle': {
    skyTop: '#A46EC7',
    skyMid: '#F59CC4',
    skyHorizon: '#FFE5B4',
    sun: '#FFFDF0',
    city: '#7E4D88',
    sakura: '#F7A8C9',
    sakuraLight: '#FFE1EE',
    water: '#635B96',
    deck: '#A46A56',
    deckLine: '#5F382B',
  },
  'starry-night': {
    skyTop: '#241438',
    skyMid: '#783B7A',
    skyHorizon: '#F296B8',
    sun: '#FFF3C4',
    city: '#2F1D48',
    sakura: '#D473A8',
    sakuraLight: '#F7B7DA',
    water: '#2B234A',
    deck: '#7E4F5D',
    deckLine: '#3D232C',
  },
  'flower-field': {
    skyTop: '#D96B9D',
    skyMid: '#FFA996',
    skyHorizon: '#FFF0B3',
    sun: '#FFFFFF',
    city: '#8A5A88',
    sakura: '#F792BE',
    sakuraLight: '#FFD6EA',
    water: '#6D76A3',
    deck: '#A96B4F',
    deckLine: '#633827',
  },
  'candy-world': {
    skyTop: '#D8679A',
    skyMid: '#FFB6A3',
    skyHorizon: '#FFF0C2',
    sun: '#FFFDF2',
    city: '#88588E',
    sakura: '#FF9AC6',
    sakuraLight: '#FFE0EF',
    water: '#6D68A3',
    deck: '#A86E59',
    deckLine: '#633B2E',
  },
  'secret-treasure': {
    skyTop: '#5E1E4A',
    skyMid: '#D84E7B',
    skyHorizon: '#FFE299',
    sun: '#FFF9D6',
    city: '#451839',
    sakura: '#EC6FA9',
    sakuraLight: '#FFD3E7',
    water: '#3D274E',
    deck: '#8F503C',
    deckLine: '#4E261B',
  },
};

const SunsetBoardwalkBackdrop: React.FC<{ theme: CardSceneTheme }> = ({ theme }) => {
  const p = SCENE_PALETTE[theme];
  const gradId = `sky-${theme}`;

  return (
    <svg
      viewBox="0 0 240 138"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop} />
          <stop offset="52%" stopColor={p.skyMid} />
          <stop offset="100%" stopColor={p.skyHorizon} />
        </linearGradient>
      </defs>

      {/* Sunset Sky */}
      <rect width="240" height="92" fill={`url(#${gradId})`} />

      {/* Glowing Sun + Halo */}
      <circle cx="132" cy="48" r="26" fill={p.sun} opacity="0.28" />
      <circle cx="132" cy="48" r="14" fill={p.sun} opacity="0.95" />

      {/* Soft Pink Clouds */}
      <ellipse cx="64" cy="24" rx="28" ry="6" fill={p.sakuraLight} opacity="0.45" />
      <ellipse cx="188" cy="22" rx="24" ry="5" fill={p.sakuraLight} opacity="0.45" />

      {/* Distant City Skyline Silhouette */}
      <g fill={p.city} opacity="0.72">
        <rect x="6" y="48" width="12" height="44" />
        <rect x="20" y="38" width="10" height="54" />
        <rect x="33" y="45" width="14" height="47" />
        <rect x="50" y="54" width="11" height="38" />
        <rect x="64" y="42" width="15" height="50" />
        <rect x="82" y="57" width="12" height="35" />
        <rect x="97" y="49" width="9" height="43" />
        <rect x="160" y="52" width="12" height="40" />
        <rect x="175" y="44" width="14" height="48" />
        <rect x="192" y="56" width="11" height="36" />
        <rect x="206" y="40" width="16" height="52" />
      </g>

      {/* Water Reflection Band */}
      <rect x="0" y="84" width="240" height="54" fill={p.water} />
      <ellipse cx="132" cy="94" rx="32" ry="6" fill={p.sun} opacity="0.45" />
      <rect x="112" y="99" width="42" height="2" fill={p.skyHorizon} opacity="0.6" />
      <rect x="118" y="104" width="30" height="2" fill={p.skyHorizon} opacity="0.45" />

      {/* Railing Along Water */}
      <rect x="0" y="80" width="240" height="2.5" fill="#392337" />
      {[12, 34, 56, 78, 166, 188, 210, 232].map((rx) => (
        <rect key={rx} x={rx} y="78" width="2.5" height="12" fill="#392337" />
      ))}

      {/* Wooden Perspective Boardwalk / Pier */}
      <polygon points="48,138 82,86 158,86 196,138" fill={p.deck} stroke="#392337" strokeWidth="1.5" />
      {[92, 99, 107, 116, 126].map((py, idx) => (
        <line
          key={py}
          x1={80 - idx * 6}
          y1={py}
          x2={160 + idx * 7}
          y2={py}
          stroke={p.deckLine}
          strokeWidth="1.2"
        />
      ))}
      <line x1="104" y1="86" x2="88" y2="138" stroke={p.deckLine} strokeWidth="1" opacity="0.65" />
      <line x1="120" y1="86" x2="120" y2="138" stroke={p.deckLine} strokeWidth="1" opacity="0.65" />
      <line x1="136" y1="86" x2="152" y2="138" stroke={p.deckLine} strokeWidth="1" opacity="0.65" />

      {/* Cute Wooden Park Bench on Left */}
      <g>
        <polygon points="16,102 64,90 66,99 18,112" fill="#7D3E48" stroke="#241423" strokeWidth="1" />
        <polygon points="18,113 68,100 74,104 26,118" fill="#A65864" stroke="#241423" strokeWidth="1" />
        <rect x="24" y="116" width="3" height="10" fill="#241423" />
        <rect x="64" y="103" width="3" height="10" fill="#241423" />
      </g>

      {/* Lush Pink Sakura / Cherry Blossom Trees */}
      {/* Left Background Tree */}
      <rect x="52" y="56" width="5" height="32" fill="#4E2635" />
      <circle cx="52" cy="52" r="15" fill={p.sakura} opacity="0.92" />
      <circle cx="62" cy="48" r="12" fill={p.sakuraLight} opacity="0.88" />
      <circle cx="42" cy="55" r="10" fill={p.sakura} opacity="0.9" />

      {/* Right Foreground Cherry Blossom Canopy */}
      <rect x="212" y="42" width="9" height="58" fill="#4E2635" />
      <circle cx="206" cy="22" r="24" fill={p.sakura} />
      <circle cx="228" cy="30" r="20" fill={p.sakuraLight} />
      <circle cx="192" cy="36" r="15" fill={p.sakuraLight} opacity="0.92" />
      <circle cx="218" cy="14" r="16" fill={p.sakura} />
      <circle cx="232" cy="52" r="14" fill={p.sakura} opacity="0.9" />

      {/* Tiny Sakura Petals in Air */}
      <rect x="88" y="34" width="2" height="2" fill="#FFF5EE" opacity="0.85" />
      <rect x="162" y="32" width="2" height="2" fill={p.sakuraLight} opacity="0.9" />
      <rect x="176" y="64" width="2" height="2" fill="#FFF5EE" opacity="0.85" />
    </svg>
  );
};

export const TradingCardItem: React.FC<TradingCardItemProps> = ({
  card,
  unlocked,
  flipped,
  onFlip,
  onViewDetails,
  compact = false,
}) => {
  if (!unlocked) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[285px] aspect-[5/7] bg-[#EC6FA9] border-4 border-[#392337] p-2.5 shadow-[6px_6px_0_#392337] flex flex-col items-center justify-center text-center rounded-xl">
          <div className="w-full h-full border-3 border-dashed border-[#FFF5EE]/80 bg-[#6B2D53] rounded-lg flex flex-col items-center justify-center p-4">
            <span className="font-pixel-title text-4xl text-[#FFC0D9]">?</span>
            <p className="mt-4 font-pixel-title text-[10px] text-[#FFD6E7]">
              CARD {card.number}
            </p>
            <p className="mt-2 font-pixel-ui text-[11px] text-[#D9C7FF]">
              LOCKED
            </p>
            <p className="mt-3 font-rounded text-xs text-[#FFC0D9] leading-snug">
              {card.id === 'card-008'
                ? 'Unlock the Secret Room to reveal this card!'
                : 'Battle monsters, play games, or open the Treasure Chest!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3D Flip Stage */}
      <div
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
        aria-label={`Flip ${card.name} card (${flipped ? 'showing back' : 'showing front'})`}
        className={`group perspective-1400 w-full ${
          compact ? 'max-w-[290px]' : 'max-w-[285px]'
        } aspect-[5/7] cursor-pointer transition-transform duration-200 hover:-translate-y-1.5`}
      >
        <div className={`card-3d-inner ${flipped ? 'is-flipped' : ''}`}>
          {/* FRONT FACE — Pink Pixel TCG Sunset Card */}
          <div className="card-face rounded-xl bg-[#EC6FA9] border-3 border-[#392337] p-[9px] shadow-[6px_6px_0_#392337] flex flex-col overflow-hidden">
            {/* Soft Pink Bokeh & Heart Background */}
            <div
              className="relative flex-1 rounded-md border-2 border-[#C94F86] px-2.5 pt-2 pb-2 flex flex-col justify-between overflow-hidden"
              style={{
                background:
                  'radial-gradient(circle at 22% 72%, rgba(255,255,255,0.65) 0%, transparent 18%), radial-gradient(circle at 82% 80%, rgba(255,255,255,0.55) 0%, transparent 22%), radial-gradient(circle at 50% 62%, rgba(255,192,217,0.85) 0%, transparent 32%), linear-gradient(180deg, #FFF0F7 0%, #FFD0E5 55%, #FFB3D6 100%)',
              }}
            >
              {/* Subtle Floating Bokeh Hearts */}
              <div className="pointer-events-none absolute inset-0 opacity-20 overflow-hidden" aria-hidden="true">
                <div className="absolute bottom-14 left-6"><PixelHeart className="w-8 h-8" color="#FFFFFF" /></div>
                <div className="absolute bottom-20 right-7"><PixelHeart className="w-10 h-10" color="#FFFFFF" /></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2"><PixelHeart className="w-7 h-7" color="#FFFFFF" /></div>
              </div>

              {/* Holographic Rainbow Foil Overlay */}
              <div className="holo-foil pointer-events-none absolute inset-0 opacity-35 group-hover:opacity-65 z-10" />

              {/* Top Header Row: Eyebrow + Big Title + Stat + Crimson Heart Orb */}
              <div className="relative z-20 flex items-center justify-between gap-1.5">
                <div className="min-w-0">
                  <p className="font-rounded text-[8px] font-extrabold tracking-wide text-[#57243A] truncate">
                    ROSIE.EXE · {card.subtitle}
                  </p>
                  <p className="font-rounded text-[15px] leading-tight font-extrabold text-[#1C0B13] truncate">
                    {card.name}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-rounded text-[13px] font-extrabold text-[#1C0B13] tabular-nums">
                    HP {card.hp}
                  </span>
                  <PixelHeartOrb className="w-5 h-5 shrink-0" />
                </div>
              </div>

              {/* Deep Rose Framed Sunset Boardwalk Illustration Window */}
              <div className="relative z-20 mt-1 border-[4px] border-[#C94F86] bg-[#392337] shadow-inner overflow-hidden">
                <div className="relative h-[126px] sm:h-[132px] w-full flex items-end justify-center pb-2.5 overflow-hidden">
                  <SunsetBoardwalkBackdrop theme={card.sceneTheme} />
                  <div className="relative z-10 animate-pixel-bob">
                    <CharacterSprite
                      id={card.spriteKind}
                      className="w-20 h-20 drop-shadow-[1px_2px_0_#241423]"
                    />
                  </div>
                </div>
              </div>

              {/* Centered Pink Caption Ribbon */}
              <div className="relative z-20 mx-3 -mt-0.5 bg-gradient-to-r from-[#C94F86] via-[#EC6FA9] to-[#C94F86] border border-[#9E3566] px-2 py-[2px] text-center shadow-sm">
                <p className="font-rounded italic text-[8.5px] font-bold text-[#FFF5EE] tracking-wide truncate">
                  Card {card.number} · {card.rarity} · {card.type}
                </p>
              </div>

              {/* Ability / Move Section: 2x2 Heart Orbs + Title/Desc + Big Power Number */}
              <div className="relative z-20 mt-1.5 flex items-center gap-2">
                <div className="grid grid-cols-2 gap-0.5 shrink-0">
                  <PixelHeartOrb className="w-4 h-4" />
                  <PixelHeartOrb className="w-4 h-4" />
                  <PixelHeartOrb className="w-4 h-4" />
                  <PixelHeartOrb className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-rounded text-[11px] font-extrabold text-[#1C0B13] leading-tight truncate">
                    {card.specialMoveName}
                  </p>
                  <p className="font-rounded text-[8.5px] font-semibold text-[#392337] leading-[1.2] mt-0.5 line-clamp-3">
                    {card.abilityDesc}
                  </p>
                </div>

                <span className="font-rounded text-[16px] font-extrabold text-[#1C0B13] tabular-nums shrink-0">
                  {card.specialMoveDamage}
                </span>
              </div>

              {/* Thin Divider + 3-Column Bottom Gamepad Bar */}
              <div className="relative z-20 mt-1 pt-1 border-t border-[#392337]/75">
                <div className="grid grid-cols-3 items-center text-center gap-1">
                  <div className="flex flex-col items-center">
                    <span className="font-rounded text-[8px] font-extrabold text-[#1C0B13]">
                      Weakness
                    </span>
                    <PixelGamepad className="w-9 h-6 mt-0.5" variant="lavender" />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-rounded text-[8px] font-extrabold text-[#1C0B13]">
                      resistance
                    </span>
                    <PixelHeartOrb className="w-4 h-4 mt-1" />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-rounded text-[8px] font-extrabold text-[#1C0B13]">
                      ROSIE-001
                    </span>
                    <PixelGamepad className="w-9 h-6 mt-0.5" variant="cream" />
                  </div>
                </div>

                {/* Bottom White Framed Flavor Quote Box */}
                <div className="mt-1 bg-[#FFF8FB] border border-[#392337] px-1.5 py-[3px] text-center">
                  <p className="font-rounded italic text-[7.5px] font-bold text-[#1C0B13] leading-tight line-clamp-2">
                    &ldquo;{card.flavorText}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BACK FACE (Completely Designed in Pink, Never Mirrored!) */}
          <div className="card-face card-face-back rounded-xl bg-[#EC6FA9] border-3 border-[#392337] p-[9px] shadow-[6px_6px_0_#392337] flex flex-col overflow-hidden">
            <div className="relative flex-1 rounded-md bg-gradient-to-b from-[#C94F86] via-[#9E3566] to-[#5E234A] border-2 border-[#FFD6E7] p-3 flex flex-col justify-between text-[#FFF5EE] overflow-hidden">
              {/* Top Corner Decorations & Card Number */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <PixelStar className="w-3.5 h-3.5" color="#FFDCC8" />
                  <span className="font-pixel-ui text-[9px] text-[#FFDCC8]">
                    {card.number}
                  </span>
                </div>
                <span className="font-pixel-ui text-[9px] font-bold bg-[#EC6FA9] text-[#FFF5EE] border border-[#FFD6E7] px-1.5">
                  {card.rarity}
                </span>
              </div>

              {/* Central Circular Pixel Emblem + ROSIE.EXE Logo */}
              <div className="my-2 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 rounded-full border-4 border-[#FFC0D9] bg-[#392337] flex flex-col items-center justify-center shadow-[0_0_0_4px_#EC6FA9]">
                  <div className="absolute -top-2">
                    <PixelFlower className="w-5 h-5" />
                  </div>
                  <PixelHeart className="w-6 h-6" color="#EC6FA9" />
                  <span className="mt-1 font-pixel-title text-[9px] text-[#FFDCC8]">
                    ROSIE.EXE
                  </span>
                  <span className="font-pixel-ui text-[8px] text-[#D9C7FF]">
                    TRADING CARD
                  </span>
                  <div className="absolute -bottom-2">
                    <PixelStar className="w-4 h-4" color="#FFDCC8" />
                  </div>
                </div>
              </div>

              {/* Lore & Special Ability Note */}
              <div className="space-y-1.5 text-center">
                <div className="bg-[#392337]/90 border-2 border-[#FFC0D9] p-2">
                  <p className="font-pixel-ui text-[9px] text-[#FFC0D9] font-bold">
                    {card.name} — {card.subtitle}
                  </p>
                  <p className="mt-1 font-rounded text-[10px] text-[#FFF5EE] leading-snug line-clamp-3">
                    {card.bio}
                  </p>
                </div>

                <div className="bg-[#EC6FA9]/45 border border-[#FFDCC8]/60 px-2 py-1.5">
                  <p className="font-pixel-dialog text-sm text-[#FFDCC8] leading-tight">
                    {card.hiddenMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Controls */}
      {onViewDetails && (
        <div className="mt-3 flex items-center justify-center gap-2 w-full max-w-[285px]">
          <button
            type="button"
            onClick={onFlip}
            className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-ui text-[11px] font-bold px-3 py-1.5 flex-1"
          >
            {flipped ? 'SHOW FRONT' : 'FLIP CARD'}
          </button>
          <button
            type="button"
            onClick={onViewDetails}
            className="pixel-btn bg-[#EC6FA9] text-[#FFF5EE] font-pixel-ui text-[11px] font-bold px-3 py-1.5 flex-1"
          >
            VIEW DETAILS
          </button>
        </div>
      )}
    </div>
  );
};
