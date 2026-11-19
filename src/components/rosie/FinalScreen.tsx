import React from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import type { CharacterId } from '../../types/rosie';
import { CharacterSprite, PixelFlower, PixelHeart, PixelStar } from './PixelSprites';

interface FinalScreenProps {
  selectedCharacter: CharacterId;
  adventurePoints: number;
  cardsUnlocked: number;
  onPlayAgain: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  selectedCharacter,
  adventurePoints,
  cardsUnlocked,
  onPlayAgain,
}) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#392337] via-[#C94F86] via-60% to-[#FFDCC8] text-[#FFF5EE]">
      {/* Pixel Sunset, Stars, Falling Cherry Petals & Pixel Fireworks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Twinkling Twilight Stars */}
        {[
          { top: '8%', left: '12%', delay: '0s' },
          { top: '14%', left: '34%', delay: '0.7s' },
          { top: '10%', right: '26%', delay: '0.4s' },
          { top: '19%', right: '11%', delay: '1.1s' },
        ].map((pos, idx) => (
          <div
            key={idx}
            className="animate-star-twinkle absolute"
            style={{ ...pos, animationDelay: pos.delay }}
          >
            <PixelStar className="w-5 h-5" color="#FFF5EE" />
          </div>
        ))}

        {/* Pixel Fireworks */}
        <div className="absolute top-[16%] left-[20%] animate-pulse">
          <div className="grid grid-cols-3 gap-2">
            <PixelStar className="w-3 h-3" color="#FFDCC8" />
            <div />
            <PixelStar className="w-3 h-3" color="#FFC0D9" />
            <div />
            <PixelHeart className="w-4 h-4" color="#EC6FA9" />
            <div />
            <PixelStar className="w-3 h-3" color="#D9C7FF" />
            <div />
            <PixelStar className="w-3 h-3" color="#FFDCC8" />
          </div>
        </div>

        <div className="absolute top-[18%] right-[18%] animate-pulse" style={{ animationDelay: '0.8s' }}>
          <div className="grid grid-cols-3 gap-2">
            <PixelStar className="w-3 h-3" color="#FFC0D9" />
            <div />
            <PixelStar className="w-3 h-3" color="#FFF5EE" />
            <div />
            <PixelStar className="w-4 h-4" color="#FFDCC8" />
            <div />
            <PixelStar className="w-3 h-3" color="#EC6FA9" />
            <div />
            <PixelStar className="w-3 h-3" color="#D9C7FF" />
          </div>
        </div>

        {/* Falling Cherry Blossom Petals */}
        {[
          { left: '8%', dur: '8s', delay: '0s' },
          { left: '22%', dur: '11s', delay: '1.4s' },
          { left: '38%', dur: '9.5s', delay: '2.2s' },
          { left: '54%', dur: '10.5s', delay: '0.8s' },
          { left: '72%', dur: '9s', delay: '1.9s' },
          { left: '88%', dur: '12s', delay: '0.4s' },
        ].map((p, idx) => (
          <div
            key={idx}
            className="animate-float-petal absolute -top-6"
            style={
              {
                left: p.left,
                animationDelay: p.delay,
                '--dur': p.dur,
              } as React.CSSProperties
            }
          >
            <PixelFlower className="w-4 h-4" />
          </div>
        ))}

        {/* Sunset Horizon, Distant Pink Mansion & Cherry Blossom Trees */}
        <svg
          viewBox="0 0 640 220"
          shapeRendering="crispEdges"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 inset-x-0 w-full h-[220px] sm:h-[260px]"
        >
          {/* Setting Pixel Sun */}
          <rect x="268" y="64" width="104" height="72" fill="#FFDCC8" opacity="0.9" />
          <rect x="284" y="48" width="72" height="20" fill="#FFF5EE" opacity="0.9" />

          {/* Distant Pink Mansion Silhouette */}
          <g opacity="0.75">
            <rect x="420" y="76" width="56" height="76" fill="#7A3560" />
            <polygon points="416,78 448,54 480,78" fill="#392337" />
            <rect x="440" y="94" width="16" height="16" fill="#FFDCC8" />
          </g>

          {/* Cherry Blossom Trees */}
          {[32, 118, 520].map((tx, i) => (
            <g key={i}>
              <rect x={tx + 22} y="108" width="12" height="58" fill="#392337" />
              <rect x={tx} y="66" width="56" height="44" fill="#FFC0D9" />
              <rect x={tx + 10} y="50" width="36" height="22" fill="#FFD6E7" />
              <rect x={tx + 8} y="76" width="8" height="8" fill="#EC6FA9" />
              <rect x={tx + 36} y="82" width="8" height="8" fill="#FFF5EE" />
            </g>
          ))}

          {/* Pink Sunset Meadow */}
          <rect x="0" y="156" width="640" height="64" fill="#392337" />
          <rect x="0" y="156" width="640" height="8" fill="#EC6FA9" />
        </svg>
      </div>

      {/* Main Celebration Card */}
      <div className="relative z-10 max-w-2xl w-full mx-auto px-4 my-auto py-10 text-center">
        <div className="pixel-box p-6 sm:p-9 text-[#392337]">
          <div className="flex justify-center gap-2 mb-3">
            <PixelStar className="w-5 h-5" color="#EC6FA9" />
            <PixelHeart className="w-5 h-5" color="#C94F86" />
            <PixelStar className="w-5 h-5" color="#EC6FA9" />
          </div>

          <h1 className="font-pixel-title text-lg sm:text-2xl text-[#C94F86] leading-snug">
            THANKS FOR PLAYING, ROSIE!
          </h1>

          <p className="mt-3 font-pixel-ui text-xs sm:text-sm font-bold text-[#392337]">
            &ldquo;Every great adventure deserves a little celebration.&rdquo;
          </p>

          <p className="mt-4 font-pixel-dialog text-2xl sm:text-3xl leading-snug text-[#392337]">
            Hope this tiny pixel world made you smile, Rosie. Stay awesome and never stop exploring!
          </p>

          {/* Summary Badges */}
          <div className="mt-5 grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="bg-[#FFD6E7] border-3 border-[#392337] py-2.5 px-3">
              <p className="font-pixel-ui text-[10px] font-bold text-[#C94F86]">
                ADVENTURE POINTS
              </p>
              <p className="font-pixel-title text-sm mt-1 tabular-nums">{adventurePoints}</p>
            </div>
            <div className="bg-[#D9C7FF] border-3 border-[#392337] py-2.5 px-3">
              <p className="font-pixel-ui text-[10px] font-bold text-[#392337]">CARDS COLLECTED</p>
              <p className="font-pixel-title text-sm mt-1 tabular-nums">{cardsUnlocked}/8</p>
            </div>
          </div>

          <p className="mt-5 font-pixel-ui text-xs font-bold text-[#C94F86]">
            MADE WITH CARE — JUST FOR HANNALLE DEWYROSE.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('select');
                onPlayAgain();
              }}
              className="pixel-btn bg-[#EC6FA9] hover:bg-[#C94F86] text-[#FFFFFF] px-7 py-3.5 font-pixel-title text-xs sm:text-sm"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      </div>

      {/* Selected Character Standing in Foreground */}
      <div className="relative z-10 pb-6 flex justify-center">
        <div className="animate-pixel-bob flex flex-col items-center">
          <CharacterSprite
            id={selectedCharacter}
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[3px_4px_0_#392337]"
          />
          <span className="mt-1 bg-[#FFF5EE] border-2 border-[#392337] px-2.5 py-0.5 font-pixel-ui text-[10px] font-bold text-[#392337]">
            ROSIE-001 ★
          </span>
        </div>
      </div>
    </div>
  );
};
