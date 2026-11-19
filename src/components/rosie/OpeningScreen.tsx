import React from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { CHARACTERS } from '../../lib/rosieData';
import { CharacterSprite, PixelHeart, PixelStar } from './PixelSprites';

interface OpeningScreenProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  onStartGame,
  onOpenHowToPlay,
  onOpenSettings,
}) => {
  const handleStart = () => {
    chiptune.playSfx('select');
    chiptune.startMusic();
    onStartGame();
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#392337] via-[#7A3560] to-[#C94F86] text-[#FFF5EE]">
      {/* Purple-Pink Night Sky: Twinkling Stars, Clouds, Mansion & Adventure Van */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[
          { top: '8%', left: '10%', delay: '0s' },
          { top: '14%', left: '28%', delay: '0.8s' },
          { top: '10%', right: '26%', delay: '0.4s' },
          { top: '18%', right: '11%', delay: '1.2s' },
          { top: '28%', left: '16%', delay: '1.5s' },
          { top: '30%', right: '18%', delay: '0.6s' },
        ].map((pos, idx) => (
          <div
            key={idx}
            className="animate-star-twinkle absolute"
            style={{ ...pos, animationDelay: pos.delay }}
          >
            <PixelStar className="w-5 h-5" color={idx % 2 === 0 ? '#FFF5EE' : '#FFD6E7'} />
          </div>
        ))}

        {/* Pixel Clouds */}
        <svg
          viewBox="0 0 80 28"
          shapeRendering="crispEdges"
          className="animate-cloud-slide absolute top-12 left-[6%] w-36 opacity-65"
        >
          <rect x="16" y="4" width="36" height="8" fill="#D9C7FF" />
          <rect x="8" y="10" width="56" height="10" fill="#D9C7FF" />
          <rect x="4" y="16" width="68" height="6" fill="#FFC0D9" />
        </svg>

        <svg
          viewBox="0 0 80 28"
          shapeRendering="crispEdges"
          className="animate-cloud-slide absolute top-20 right-[8%] w-40 opacity-60"
          style={{ animationDelay: '2.5s' }}
        >
          <rect x="14" y="6" width="40" height="8" fill="#FFC0D9" />
          <rect x="6" y="12" width="60" height="10" fill="#D9C7FF" />
        </svg>

        {/* Haunted Pink Mansion + Forest Silhouettes + Adventure Van */}
        <svg
          viewBox="0 0 640 240"
          shapeRendering="crispEdges"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 inset-x-0 w-full h-[270px] sm:h-[320px]"
        >
          <rect x="0" y="150" width="640" height="90" fill="#2A1728" />
          {[28, 76, 540, 588].map((tx, i) => (
            <g key={i}>
              <rect x={tx + 12} y="128" width="12" height="52" fill="#241423" />
              <rect x={tx} y="96" width="36" height="36" fill="#392337" />
              <rect x={tx + 6} y="76" width="24" height="24" fill="#543451" />
            </g>
          ))}

          {/* Haunted Pink Mansion */}
          <g>
            <rect x="276" y="34" width="88" height="130" fill="#C94F86" />
            <polygon points="270,38 320,8 370,38" fill="#392337" />
            <rect x="210" y="76" width="70" height="88" fill="#EC6FA9" />
            <rect x="360" y="76" width="70" height="88" fill="#EC6FA9" />
            <polygon points="204,78 245,50 284,78" fill="#392337" />
            <polygon points="356,78 395,50 436,78" fill="#392337" />
            <rect x="308" y="54" width="24" height="24" fill="#FFDCC8" />
            <rect x="232" y="96" width="22" height="22" fill="#FFDCC8" />
            <rect x="386" y="96" width="22" height="22" fill="#FFF5EE" />
            <rect x="304" y="122" width="32" height="42" fill="#392337" />
            <rect x="314" y="132" width="12" height="14" fill="#EC6FA9" />
          </g>

          <rect x="0" y="176" width="640" height="64" fill="#543451" />
          <rect x="0" y="176" width="640" height="8" fill="#EC6FA9" opacity="0.45" />

          {/* Adventure Van */}
          <g transform="translate(115, 134)">
            <rect x="0" y="8" width="68" height="32" fill="#FFDCC8" />
            <rect x="0" y="24" width="68" height="16" fill="#EC6FA9" />
            <rect x="8" y="12" width="18" height="12" fill="#D9C7FF" />
            <rect x="32" y="12" width="22" height="12" fill="#D9C7FF" />
            <rect x="10" y="38" width="14" height="10" fill="#392337" />
            <rect x="44" y="38" width="14" height="10" fill="#392337" />
          </g>

          {/* Cute Pixel Monster Silhouette */}
          <g transform="translate(474, 150)">
            <rect x="0" y="6" width="28" height="18" fill="#EC6FA9" />
            <rect x="6" y="12" width="4" height="4" fill="#392337" />
            <rect x="18" y="12" width="4" height="4" fill="#392337" />
          </g>
        </svg>
      </div>

      {/* Top Edition Strip */}
      <div className="relative z-10 pt-5 px-4 flex items-center justify-between max-w-5xl w-full mx-auto">
        <span className="font-pixel-ui text-[10px] sm:text-xs text-[#FFD6E7] bg-[#392337] border-2 border-[#EC6FA9] px-3 py-1">
          SPECIAL EDITION — VERSION 1.0
        </span>
        <div className="flex items-center gap-1.5">
          <PixelHeart className="w-5 h-5" />
          <span className="font-pixel-ui text-xs text-[#FFF5EE]">ROSIE.EXE</span>
        </div>
      </div>

      {/* Main Title & Action Menu */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 my-auto py-8">
        <div className="pixel-panel-dark px-6 py-6 sm:px-10 sm:py-8 max-w-2xl w-full bg-[#392337]/95">
          <p className="font-pixel-ui text-xs sm:text-sm text-[#D9C7FF] tracking-widest">
            WELCOME TO ROSIE.EXE
          </p>

          <h1 className="mt-4 font-pixel-title text-3xl sm:text-5xl text-[#FFC0D9] drop-shadow-[4px_4px_0px_#C94F86] leading-tight">
            ROSIE
          </h1>
          <h2 className="mt-2 font-pixel-title text-base sm:text-2xl text-[#FFF5EE] leading-snug">
            AND THE PIXEL MYSTERY?
          </h2>

          <p className="mt-4 font-pixel-dialog text-2xl sm:text-3xl text-[#FFDCC8]">
            &ldquo;THE ADVENTURE BEGINS HERE!&rdquo;
          </p>

          <p className="mt-4 font-pixel-ui text-xs text-[#EC6FA9] animate-blink">
            ▼ PRESS START ▼
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleStart}
              className="pixel-btn bg-[#EC6FA9] hover:bg-[#F7A8C9] px-7 py-3.5 font-pixel-title text-xs sm:text-sm text-[#FFFFFF] whitespace-nowrap shrink-0"
            >
              START GAME
            </button>

            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                onOpenHowToPlay();
              }}
              className="pixel-btn bg-[#FFF5EE] hover:bg-[#FFD6E7] px-5 py-3 font-pixel-ui text-xs font-bold text-[#392337] whitespace-nowrap shrink-0"
            >
              HOW TO PLAY
            </button>

            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                onOpenSettings();
              }}
              className="pixel-btn bg-[#D9C7FF] hover:bg-[#FFDCC8] px-5 py-3 font-pixel-ui text-xs font-bold text-[#392337] whitespace-nowrap shrink-0"
            >
              SETTINGS
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 5 Tiny Pixel Characters */}
      <div className="relative z-10 pb-5 px-4 flex items-end justify-center gap-4 sm:gap-8">
        {CHARACTERS.map((char, idx) => (
          <div
            key={char.id}
            className="animate-pixel-bob flex flex-col items-center"
            style={{ animationDelay: `${idx * 0.18}s` }}
          >
            <CharacterSprite id={char.id} className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
        ))}
      </div>
    </div>
  );
};
