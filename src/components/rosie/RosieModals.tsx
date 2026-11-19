import React, { useState } from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { ACHIEVEMENTS } from '../../lib/rosieData';
import { computePlayerLevel } from '../../lib/rosieStorage';
import type { RosieProgressState, SoundSettings } from '../../types/rosie';
import { PixelHeart, PixelStar } from './PixelSprites';

/* ==================== HOW TO PLAY MODAL ==================== */
export const HowToPlayModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-[#241423]/80 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-box max-w-lg w-full p-5 sm:p-6 text-[#392337]"
      >
        <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
          <h2 className="font-pixel-title text-sm sm:text-base">HOW TO PLAY</h2>
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onClose();
            }}
            className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-2.5 py-1 font-pixel-ui text-xs font-bold"
          >
            X
          </button>
        </div>

        <ul className="mt-4 space-y-2.5 font-pixel-dialog text-2xl leading-snug">
          <li>1. Choose one of 5 cute pixel heroes on Character Select!</li>
          <li>2. Explore the Pink Pixel World with WASD, Arrow Keys, taps, or the D-Pad!</li>
          <li>3. Flip &amp; collect all 8 3D Trading Cards in Rosie&apos;s Card Collection!</li>
          <li>4. Battle 5 monsters, play 4 Arcade Mini-Games &amp; read the Pink Mailbox notes.</li>
          <li>5. Clear 2 Mini-Games + defeat 2 Monsters + collect 3 Cards to unlock the Secret Room!</li>
        </ul>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onClose();
            }}
            className="pixel-btn bg-[#FFC0D9] px-5 py-2 font-pixel-ui text-xs font-bold text-[#392337]"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==================== SETTINGS MODAL ==================== */
interface SettingsModalProps {
  open: boolean;
  sound: SoundSettings;
  onUpdateSound: (next: SoundSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  sound,
  onUpdateSound,
  onResetProgress,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-[#241423]/80 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-box max-w-md w-full p-5 sm:p-6 text-[#392337]"
      >
        <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
          <h2 className="font-pixel-title text-sm sm:text-base">GAME SETTINGS</h2>
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onClose();
            }}
            className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-2.5 py-1 font-pixel-ui text-xs font-bold"
          >
            X
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Music Toggle */}
          <div className="flex items-center justify-between bg-[#FFD6E7] border-3 border-[#392337] px-3.5 py-3">
            <div>
              <p className="font-pixel-ui text-xs font-bold">8-BIT CHIPTUNE MUSIC</p>
              <p className="font-rounded text-xs text-[#5E354E]">Cozy pixel background loop</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextEnabled = !sound.musicEnabled;
                onUpdateSound({ ...sound, musicEnabled: nextEnabled });
                if (nextEnabled) {
                  chiptune.startMusic();
                } else {
                  chiptune.stopMusic();
                }
                chiptune.playSfx('click');
              }}
              className={`pixel-btn px-4 py-1.5 font-pixel-ui text-xs font-bold ${
                sound.musicEnabled
                  ? 'bg-[#EC6FA9] text-[#FFFFFF]'
                  : 'bg-[#FFF5EE] text-[#392337]'
              }`}
            >
              {sound.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* SFX Toggle */}
          <div className="flex items-center justify-between bg-[#FFD6E7] border-3 border-[#392337] px-3.5 py-3">
            <div>
              <p className="font-pixel-ui text-xs font-bold">SOUND EFFECTS (SFX)</p>
              <p className="font-rounded text-xs text-[#5E354E]">Clicks, card flips &amp; battles</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextSfx = !sound.sfxEnabled;
                onUpdateSound({ ...sound, sfxEnabled: nextSfx });
                if (nextSfx) {
                  window.setTimeout(() => chiptune.playSfx('select'), 20);
                }
              }}
              className={`pixel-btn px-4 py-1.5 font-pixel-ui text-xs font-bold ${
                sound.sfxEnabled
                  ? 'bg-[#EC6FA9] text-[#FFFFFF]'
                  : 'bg-[#FFF5EE] text-[#392337]'
              }`}
            >
              {sound.sfxEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Master Volume Slider */}
          <div className="bg-[#FFD6E7] border-3 border-[#392337] px-3.5 py-3">
            <div className="flex justify-between font-pixel-ui text-xs font-bold mb-2">
              <span>MASTER VOLUME</span>
              <span className="tabular-nums">{Math.round(sound.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={sound.volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                onUpdateSound({ ...sound, volume: v });
              }}
              className="w-full accent-[#EC6FA9] cursor-pointer"
            />
          </div>

          {/* Reset Save Progress */}
          <div className="pt-2 border-t-2 border-dashed border-[#C94F86]">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  chiptune.playSfx('click');
                  setConfirmReset(true);
                }}
                className="pixel-btn w-full bg-[#FFF5EE] hover:bg-[#FFDCC8] px-4 py-2.5 font-pixel-ui text-xs font-bold text-[#C94F86]"
              >
                RESET SAVED PROGRESS
              </button>
            ) : (
              <div className="bg-[#392337] text-[#FFF5EE] p-3 border-3 border-[#EC6FA9] space-y-2.5 text-center">
                <p className="font-pixel-ui text-[11px]">Reset all cards, XP &amp; badges?</p>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      chiptune.playSfx('attack');
                      onResetProgress();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-4 py-1.5 font-pixel-ui text-xs font-bold"
                  >
                    YES, RESET
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="pixel-btn bg-[#FFF5EE] text-[#392337] px-4 py-1.5 font-pixel-ui text-xs font-bold"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==================== ACHIEVEMENTS MODAL ==================== */
interface AchievementsModalProps {
  open: boolean;
  progress: RosieProgressState;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  open,
  progress,
  onClose,
}) => {
  if (!open) return null;

  const { level, xpInLevel, xpForNext, pct } = computePlayerLevel(progress.xp);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-[#241423]/80 p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-box max-w-2xl w-full p-5 sm:p-6 text-[#392337] my-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
          <div className="flex items-center gap-2">
            <PixelStar className="w-5 h-5" color="#EC6FA9" />
            <h2 className="font-pixel-title text-xs sm:text-base">
              PLAYER PROGRESS &amp; ACHIEVEMENTS
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onClose();
            }}
            className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-2.5 py-1 font-pixel-ui text-xs font-bold"
          >
            X
          </button>
        </div>

        {/* Player Stats Summary */}
        <div className="mt-4 bg-[#FFD6E7] border-3 border-[#392337] p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-pixel-title text-xs text-[#C94F86]">
              LEVEL {level} EXPLORER
            </span>
            <span className="font-pixel-ui text-xs font-bold tabular-nums">
              {progress.adventurePoints} AP · ★ {progress.collectedStars} STARS · CARDS{' '}
              {progress.discoveredCards.length}/8
            </span>
          </div>

          <div>
            <div className="flex justify-between font-pixel-ui text-[10px] font-bold mb-1">
              <span>XP TO NEXT LEVEL</span>
              <span className="tabular-nums">
                {xpInLevel}/{xpForNext} XP
              </span>
            </div>
            <div className="w-full h-4 bg-[#392337] p-0.5">
              <div
                className="h-full bg-[#EC6FA9] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 6 Achievement Badges */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`border-3 border-[#392337] p-3 flex items-start gap-3 ${
                  unlocked ? 'bg-[#FFF5EE]' : 'bg-[#EEDAE4] opacity-75'
                }`}
              >
                <div
                  className={`p-2 border-2 border-[#392337] shrink-0 ${
                    unlocked ? 'bg-[#EC6FA9]' : 'bg-[#392337]'
                  }`}
                >
                  {unlocked ? (
                    <PixelHeart className="w-4 h-4" color="#FFF5EE" />
                  ) : (
                    <PixelStar className="w-4 h-4" color="#FFC0D9" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-pixel-ui text-xs font-bold text-[#392337] truncate">
                      {ach.title}
                    </p>
                    <span className="font-pixel-ui text-[10px] font-bold text-[#C94F86] shrink-0">
                      +{ach.apBonus}AP
                    </span>
                  </div>
                  <p className="mt-1 font-pixel-dialog text-lg leading-tight text-[#5E354E]">
                    {ach.description}
                  </p>
                  <p className="mt-1 font-pixel-ui text-[9px] font-bold text-[#C94F86]">
                    {unlocked ? '✓ UNLOCKED' : 'LOCKED'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
