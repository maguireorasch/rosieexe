import React from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { computePlayerLevel } from '../../lib/rosieStorage';
import type { GameScreen, RosieProgressState } from '../../types/rosie';
import { CharacterSprite, PixelHeart, PixelStar } from './PixelSprites';

interface GameHudProps {
  progress: RosieProgressState;
  currentScreen: GameScreen;
  achievementToast: string | null;
  onNavigate: (screen: GameScreen) => void;
  onOpenIdCard: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  progress,
  currentScreen,
  achievementToast,
  onNavigate,
  onOpenIdCard,
  onOpenAchievements,
  onOpenSettings,
}) => {
  const { level } = computePlayerLevel(progress.xp);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#392337] border-b-4 border-[#EC6FA9] text-[#FFF5EE] px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Brand + Avatar + Level + Stats */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('nav');
                onNavigate('world');
              }}
              className="flex items-center gap-2 bg-[#EC6FA9] border-2 border-[#FFF5EE] px-2.5 py-1 hover:bg-[#F7A8C9] transition-colors shrink-0"
              title="Back to Pink Pixel World"
            >
              <CharacterSprite id={progress.selectedCharacter} className="w-6 h-6" />
              <span className="font-pixel-title text-[10px] text-[#392337]">ROSIE.EXE</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-pixel-ui text-[10px] sm:text-xs font-bold">
              <span className="bg-[#543451] border border-[#F7A8C9] px-2 py-0.5 text-[#FFDCC8] tabular-nums">
                LV {level}
              </span>
              <span className="bg-[#543451] border border-[#F7A8C9] px-2 py-0.5 text-[#FFC0D9] tabular-nums">
                {progress.adventurePoints} AP
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-[#543451] border border-[#F7A8C9] px-2 py-0.5 text-[#FFDCC8] tabular-nums">
                <PixelStar className="w-3.5 h-3.5" color="#FFDCC8" />
                {progress.collectedStars}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 bg-[#543451] border border-[#F7A8C9] px-2 py-0.5 text-[#FFF5EE] tabular-nums">
                <PixelHeart className="w-3.5 h-3.5" color="#EC6FA9" />
                {progress.discoveredCards.length}/8
              </span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {currentScreen !== 'world' && (
              <button
                type="button"
                onClick={() => {
                  chiptune.playSfx('nav');
                  onNavigate('world');
                }}
                className="pixel-btn bg-[#FFC0D9] text-[#392337] font-pixel-ui text-[10px] font-bold px-2.5 py-1.5 whitespace-nowrap shrink-0"
              >
                MAP
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                onOpenIdCard();
              }}
              className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-ui text-[10px] font-bold px-2.5 py-1.5 whitespace-nowrap shrink-0"
            >
              ID CARD
            </button>
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                onOpenAchievements();
              }}
              className="pixel-btn bg-[#FFDCC8] text-[#392337] font-pixel-ui text-[10px] font-bold px-2.5 py-1.5 whitespace-nowrap shrink-0"
            >
              BADGES ({progress.unlockedAchievements.length}/6)
            </button>
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                onOpenSettings();
              }}
              className="pixel-btn bg-[#D9C7FF] text-[#392337] font-pixel-ui text-[10px] font-bold px-2.5 py-1.5 whitespace-nowrap shrink-0"
            >
              ⚙
            </button>
          </div>
        </div>
      </header>

      {/* Achievement Unlocked Retro Toast */}
      {achievementToast && (
        <div className="fixed bottom-4 right-4 z-[85] pixel-panel-dark px-4 py-3 flex items-center gap-3 animate-bounce max-w-xs">
          <PixelStar className="w-6 h-6 shrink-0" color="#FFDCC8" />
          <div>
            <p className="font-pixel-ui text-[10px] font-bold text-[#EC6FA9]">
              ACHIEVEMENT UNLOCKED!
            </p>
            <p className="font-pixel-title text-[10px] text-[#FFF5EE] mt-0.5">
              {achievementToast}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
