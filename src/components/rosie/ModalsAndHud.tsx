import React from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { ACHIEVEMENTS } from '../../lib/rosieData';
import { computePlayerLevel } from '../../lib/rosieStorage';
import type { GameScreen, RosieProgressState, SoundSettings } from '../../types/rosie';
import { PixelHeart, PixelStar } from './PixelSprites';

interface WorldHudProps {
  progress: RosieProgressState;
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  onOpenIdCard: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
}

export const WorldHud: React.FC<WorldHudProps> = ({
  progress,
  currentScreen,
  onNavigate,
  onOpenIdCard,
  onOpenAchievements,
  onOpenSettings,
}) => {
  const { level } = computePlayerLevel(progress.xp);

  return (
    <header className="sticky top-0 z-40 bg-[#392337] border-b-4 border-[#EC6FA9] px-3 sm:px-6 py-2.5 text-[#FFF5EE]">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('nav');
              onNavigate('world');
            }}
            className="flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <PixelHeart className="w-5 h-5" color="#FFC0D9" />
            <span className="font-pixel-title text-xs sm:text-sm text-[#FFC0D9]">
              ROSIE.EXE
            </span>
          </button>

          <div className="flex items-center gap-3 font-pixel-ui text-[11px] sm:text-xs font-bold tabular-nums">
            <span className="text-[#FFDCC8]">LV.{level}</span>
            <span className="text-[#D9C7FF]">{progress.adventurePoints} AP</span>
            <span className="inline-flex items-center gap-1 text-[#FFC0D9]">
              <PixelStar className="w-3.5 h-3.5" color="#FFDCC8" />
              {progress.collectedStars}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {currentScreen !== 'world' && (
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('nav');
                onNavigate('world');
              }}
              className="pixel-btn bg-[#FFC0D9] px-3 py-1.5 font-pixel-ui text-[11px] font-bold text-[#392337] whitespace-nowrap shrink-0"
            >
              WORLD
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onOpenIdCard();
            }}
            className="pixel-btn bg-[#FFF5EE] px-3 py-1.5 font-pixel-ui text-[11px] font-bold text-[#392337] whitespace-nowrap shrink-0"
          >
            ID CARD
          </button>

          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onOpenAchievements();
            }}
            className="pixel-btn bg-[#D9C7FF] px-3 py-1.5 font-pixel-ui text-[11px] font-bold text-[#392337] whitespace-nowrap shrink-0"
          >
            BADGES ({progress.unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </button>

          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onOpenSettings();
            }}
            className="pixel-btn bg-[#FFDCC8] px-3 py-1.5 font-pixel-ui text-[11px] font-bold text-[#392337] whitespace-nowrap shrink-0"
          >
            SOUND
          </button>

          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('nav');
              onNavigate('opening');
            }}
            className="pixel-btn bg-[#EC6FA9] px-3 py-1.5 font-pixel-ui text-[11px] font-bold text-[#FFFFFF] whitespace-nowrap shrink-0"
          >
            TITLE
          </button>
        </div>
      </div>
    </header>
  );
};

export const AchievementsModal: React.FC<{
  open: boolean;
  progress: RosieProgressState;
  onClose: () => void;
}> = ({ open, progress, onClose }) => {
  if (!open) return null;
  const { level, xpInLevel, pct } = computePlayerLevel(progress.xp);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241423]/85 p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-box max-w-xl w-full p-5 sm:p-6 text-[#392337] my-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
          <h2 className="font-pixel-title text-xs sm:text-sm">
            ACHIEVEMENTS &amp; PROGRESSION
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-2.5 py-1 font-pixel-ui text-xs"
          >
            X
          </button>
        </div>

        <div className="mt-4 bg-[#FFD6E7] border-3 border-[#392337] p-3">
          <div className="flex flex-wrap justify-between gap-2 font-pixel-ui text-xs font-bold">
            <span>PLAYER LEVEL {level}</span>
            <span className="tabular-nums">
              {xpInLevel}/100 XP · CARDS {progress.discoveredCards.length}/8
            </span>
          </div>
          <div className="w-full h-4 bg-[#392337] mt-1.5 p-0.5">
            <div className="h-full bg-[#EC6FA9] transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-4 space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`border-3 border-[#392337] p-3 flex items-center justify-between gap-3 ${
                  unlocked ? 'bg-[#FFC0D9]' : 'bg-[#FFF5EE] opacity-80'
                }`}
              >
                <div>
                  <p className="font-pixel-ui text-xs font-bold text-[#392337]">
                    {unlocked ? '★ ' : '□ '}
                    {ach.title}
                  </p>
                  <p className="font-pixel-dialog text-xl leading-tight mt-0.5">
                    {ach.description}
                  </p>
                </div>
                <span className="font-pixel-ui text-[10px] font-bold bg-[#FFF5EE] border-2 border-[#392337] px-2 py-1 shrink-0">
                  {unlocked ? 'UNLOCKED' : `+${ach.apBonus} AP`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const SettingsModal: React.FC<{
  open: boolean;
  sound: SoundSettings;
  onUpdateSound: (next: SoundSettings) => void;
  onResetSave: () => void;
  onClose: () => void;
}> = ({ open, sound, onUpdateSound, onResetSave, onClose }) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241423]/85 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-box max-w-md w-full p-5 sm:p-6 text-[#392337]"
      >
        <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
          <h2 className="font-pixel-title text-xs sm:text-sm">SOUND &amp; SYSTEM SETTINGS</h2>
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-2.5 py-1 font-pixel-ui text-xs"
          >
            X
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between bg-[#FFD6E7] border-3 border-[#392337] p-3">
            <span className="font-pixel-ui text-xs font-bold">8-BIT MUSIC</span>
            <button
              type="button"
              onClick={() => {
                const nextMusic = !sound.musicEnabled;
                const updated = { ...sound, musicEnabled: nextMusic };
                onUpdateSound(updated);
                chiptune.applySettings(updated);
                if (nextMusic) {
                  chiptune.startMusic();
                } else {
                  chiptune.stopMusic();
                }
              }}
              className={`pixel-btn px-4 py-1.5 font-pixel-ui text-xs font-bold ${
                sound.musicEnabled ? 'bg-[#EC6FA9] text-[#FFFFFF]' : 'bg-[#FFF5EE]'
              }`}
            >
              {sound.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#FFD6E7] border-3 border-[#392337] p-3">
            <span className="font-pixel-ui text-xs font-bold">SOUND EFFECTS</span>
            <button
              type="button"
              onClick={() => {
                const nextSfx = !sound.sfxEnabled;
                const updated = { ...sound, sfxEnabled: nextSfx };
                onUpdateSound(updated);
                chiptune.applySettings(updated);
                if (nextSfx) chiptune.playSfx('click');
              }}
              className={`pixel-btn px-4 py-1.5 font-pixel-ui text-xs font-bold ${
                sound.sfxEnabled ? 'bg-[#EC6FA9] text-[#FFFFFF]' : 'bg-[#FFF5EE]'
              }`}
            >
              {sound.sfxEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="bg-[#FFD6E7] border-3 border-[#392337] p-3">
            <div className="flex justify-between font-pixel-ui text-xs font-bold mb-2">
              <span>VOLUME</span>
              <span className="tabular-nums">{Math.round(sound.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={sound.volume}
              onChange={(e) => {
                const updated = { ...sound, volume: Number(e.target.value) };
                onUpdateSound(updated);
                chiptune.applySettings(updated);
              }}
              className="w-full accent-[#EC6FA9] cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t-4 border-[#392337] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                onResetSave();
                onClose();
              }}
              className="pixel-btn bg-[#FFDCC8] px-3 py-2 font-pixel-ui text-[10px] font-bold text-[#392337]"
            >
              RESET SAVE
            </button>

            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                onClose();
              }}
              className="pixel-btn bg-[#EC6FA9] px-5 py-2 font-pixel-ui text-xs font-bold text-[#FFFFFF]"
            >
              DONE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HowToPlayModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241423]/85 p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pixel-box max-w-lg w-full p-5 sm:p-6 text-[#392337] my-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
          <h2 className="font-pixel-title text-xs sm:text-sm">HOW TO PLAY ROSIE.EXE</h2>
          <button
            type="button"
            onClick={onClose}
            className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-2.5 py-1 font-pixel-ui text-xs"
          >
            X
          </button>
        </div>

        <div className="mt-4 space-y-3 font-pixel-dialog text-xl sm:text-2xl leading-snug">
          <div className="bg-[#FFD6E7] border-2 border-[#392337] p-3">
            1. Pick your pixel hero on the Character Select screen &amp; view your ROSIE-001 ID Card.
          </div>
          <div className="bg-[#FFF5EE] border-2 border-[#392337] p-3">
            2. Walk around the Pink Pixel World (WASD / Arrow Keys / Touch D-Pad) or click landmarks!
          </div>
          <div className="bg-[#D9C7FF]/70 border-2 border-[#392337] p-3">
            3. Collect all 8 holographic 3D trading cards &amp; read the 6 envelopes in the Pink Mailbox.
          </div>
          <div className="bg-[#FFDCC8] border-2 border-[#392337] p-3">
            4. Beat 2 monsters, clear 2 arcade mini-games &amp; collect 3 cards to unlock the Secret Room!
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onClose();
            }}
            className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-6 py-2.5 font-pixel-ui text-xs font-bold"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};
