import React, { useState } from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { COLLECTIBLE_CARDS } from '../../lib/rosieData';
import { canUnlockSecretRoom } from '../../lib/rosieStorage';
import type { RosieProgressState } from '../../types/rosie';
import { TradingCardItem } from './TradingCardItem';
import { PixelHeart, PixelStar } from './PixelSprites';

interface SecretRoomScreenProps {
  progress: RosieProgressState;
  onUnlockChest: () => void;
  onGoToFinal: () => void;
  onBackToWorld: () => void;
}

const SECRET_CHEST_MESSAGE =
  "Congratulations, Rosie! You explored the Pink Pixel World, played the games, defeated the monsters, and unlocked every secret.\n\nThis tiny digital universe was created just as a fun gift for an awesome friend. Keep being cheerful, curious, and unapologetically yourself!\n\n— Made with care for Hannalle Dewyrose (ROSIE-001)";

export const SecretRoomScreen: React.FC<SecretRoomScreenProps> = ({
  progress,
  onUnlockChest,
  onGoToFinal,
  onBackToWorld,
}) => {
  const [chestOpenedView, setChestOpenedView] = useState(progress.chestOpened);
  const [cardFlipped, setCardFlipped] = useState(false);

  const gamesDone = progress.completedMiniGames.length;
  const monstersDone = progress.defeatedMonsters.length;
  const cardsDone = progress.discoveredCards.length;

  const isUnlocked = progress.secretRoomUnlocked || canUnlockSecretRoom(progress);
  const secretCard = COLLECTIBLE_CARDS.find((c) => c.id === 'card-008')!;

  const handleOpenChest = () => {
    chiptune.playSfx('treasure');
    onUnlockChest();
    setChestOpenedView(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#392337] via-[#7A3560] to-[#C94F86] py-8 px-4 sm:px-6 text-[#FFF5EE]">
      <div className="max-w-4xl mx-auto">
        <div className="pixel-box p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[#392337]">
          <div>
            <p className="font-pixel-ui text-xs font-bold text-[#C94F86]">
              MYSTERIOUS PINK DOOR
            </p>
            <h1 className="mt-1 font-pixel-title text-base sm:text-xl">
              THE SECRET ROOM
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('nav');
              onBackToWorld();
            }}
            className="pixel-btn bg-[#FFDCC8] px-4 py-2.5 font-pixel-ui text-xs font-bold whitespace-nowrap shrink-0"
          >
            &lt; BACK TO WORLD
          </button>
        </div>

        {!isUnlocked ? (
          /* Locked Door Screen */
          <div className="mt-8 pixel-panel-dark p-6 sm:p-8 text-center">
            <div className="mx-auto w-36 h-48 bg-[#C94F86] border-4 border-[#FFDCC8] shadow-[6px_6px_0px_#241423] flex flex-col items-center justify-center relative">
              <div className="w-10 h-14 bg-[#392337] border-2 border-[#FFDCC8] flex flex-col items-center justify-center animate-pulse">
                <div className="w-4 h-4 rounded-full bg-[#EC6FA9]" />
                <div className="w-2 h-4 bg-[#EC6FA9] -mt-1" />
              </div>
              <span className="mt-3 font-pixel-ui text-[10px] text-[#FFDCC8]">LOCKED</span>
            </div>

            <h2 className="mt-6 font-pixel-title text-sm sm:text-base text-[#FFC0D9]">
              COMPLETE THESE QUESTS TO UNLOCK THE DOOR
            </h2>

            <div className="mt-6 max-w-md mx-auto space-y-3 text-left">
              {[
                { label: 'Complete 2 Mini-Games in Arcade', cur: gamesDone, req: 2 },
                { label: 'Defeat 2 Monsters in Battle Arena', cur: monstersDone, req: 2 },
                { label: 'Collect at least 3 Trading Cards', cur: cardsDone, req: 3 },
              ].map((req) => {
                const met = req.cur >= req.req;
                return (
                  <div
                    key={req.label}
                    className={`border-3 border-[#FFD6E7] px-4 py-3 flex items-center justify-between gap-3 ${
                      met ? 'bg-[#EC6FA9] text-[#FFFFFF]' : 'bg-[#241423] text-[#FFD6E7]'
                    }`}
                  >
                    <span className="font-pixel-dialog text-2xl">{req.label}</span>
                    <span className="font-pixel-ui text-xs font-bold tabular-nums shrink-0">
                      {Math.min(req.cur, req.req)}/{req.req} {met ? '✓' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Unlocked Glowing Pink Treasure Room */
          <div className="mt-8 pixel-panel-pink p-6 sm:p-8 text-center text-[#392337] relative overflow-hidden">
            <div className="flex justify-center gap-4 mb-4">
              <PixelStar className="w-6 h-6 animate-star-twinkle" color="#EC6FA9" />
              <PixelHeart className="w-6 h-6 animate-pixel-bob" />
              <PixelStar className="w-6 h-6 animate-star-twinkle" color="#FFDCC8" />
            </div>

            <h2 className="font-pixel-title text-base sm:text-xl text-[#C94F86]">
              DOOR UNLOCKED! WELCOME TO THE TREASURE ROOM
            </h2>
            <p className="mt-2 font-pixel-dialog text-2xl">
              Tap the glowing treasure chest to reveal the final hidden card &amp; message!
            </p>

            {/* Glowing Pixel Treasure Chest Button */}
            <button
              type="button"
              onClick={handleOpenChest}
              className="mt-6 mx-auto flex flex-col items-center group"
            >
              <div className="w-44 h-32 bg-gradient-to-b from-[#EC6FA9] to-[#C94F86] border-4 border-[#392337] shadow-[0_0_30px_#EC6FA9,6px_6px_0px_#392337] flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-3 bg-[#392337]" />
                <div className="w-8 h-8 bg-[#FFDCC8] border-3 border-[#392337] -mt-4" />
                <span className="mt-2 font-pixel-ui text-xs font-bold text-[#FFFFFF]">
                  {progress.chestOpened ? 'CHEST OPENED ✓' : 'OPEN CHEST!'}
                </span>
              </div>
            </button>

            {chestOpenedView && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
                <div className="md:col-span-5 flex justify-center">
                  <TradingCardItem
                    card={secretCard}
                    unlocked={true}
                    flipped={cardFlipped}
                    onFlip={() => {
                      chiptune.playSfx('flip');
                      setCardFlipped((prev) => !prev);
                    }}
                    compact
                  />
                </div>

                <div className="md:col-span-7 pixel-box p-5 sm:p-6 space-y-4">
                  <h3 className="font-pixel-title text-xs sm:text-sm text-[#C94F86]">
                    CARD 008 UNLOCKED: THE SECRET ADVENTURE!
                  </h3>
                  <div className="font-pixel-dialog text-2xl leading-snug text-[#392337] whitespace-pre-line">
                    {SECRET_CHEST_MESSAGE}
                  </div>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        chiptune.playSfx('flip');
                        setCardFlipped((prev) => !prev);
                      }}
                      className="pixel-btn bg-[#D9C7FF] text-[#392337] px-4 py-3 font-pixel-ui text-xs font-bold whitespace-nowrap shrink-0"
                    >
                      FLIP CARD ↻
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        chiptune.playSfx('victory');
                        onGoToFinal();
                      }}
                      className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-6 py-3 font-pixel-title text-xs whitespace-nowrap shrink-0"
                    >
                      GO TO FINAL CELEBRATION ★
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
