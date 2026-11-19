import React, { useState } from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { COLLECTIBLE_CARDS } from '../../lib/rosieData';
import type { CollectibleCard } from '../../types/rosie';
import { TradingCardItem } from './TradingCardItem';
import { PixelHeart, PixelStar } from './PixelSprites';

interface CardCollectionScreenProps {
  discoveredCards: string[];
  onUnlockCard: (cardId: string, apReward?: number) => void;
  onBackToWorld: () => void;
}

export const CardCollectionScreen: React.FC<CardCollectionScreenProps> = ({
  discoveredCards,
  onUnlockCard,
  onBackToWorld,
}) => {
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const [detailCard, setDetailCard] = useState<CollectibleCard | null>(null);
  const [detailFlipped, setDetailFlipped] = useState(false);
  const [packRevealing, setPackRevealing] = useState(false);
  const [newlyUnlockedCard, setNewlyUnlockedCard] = useState<CollectibleCard | null>(null);

  const count = discoveredCards.length;
  const total = COLLECTIBLE_CARDS.length;
  const pct = Math.round((count / total) * 100);

  // Cards 001..007 can be pulled from Mystery Packs; Card 008 is exclusively Secret Room!
  const nextPackCard = COLLECTIBLE_CARDS.find(
    (c) => c.id !== 'card-008' && !discoveredCards.includes(c.id)
  );

  const toggleFlip = (cardId: string) => {
    chiptune.playSfx('flip');
    setFlippedMap((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleOpenPack = () => {
    if (!nextPackCard || packRevealing) return;
    chiptune.playSfx('select');
    setPackRevealing(true);
    window.setTimeout(() => {
      chiptune.playSfx('unlock');
      onUnlockCard(nextPackCard.id, 60);
      setNewlyUnlockedCard(nextPackCard);
      setPackRevealing(false);
    }, 950);
  };

  return (
    <div className="min-h-screen w-full pixel-checker-pink py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Retro Header */}
        <div className="pixel-box p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-pixel-ui text-xs font-bold text-[#C94F86]">
              COLLECT THEM ALL! · CLICK ANY CARD TO FLIP 180°
            </p>
            <h1 className="mt-1 font-pixel-title text-base sm:text-xl text-[#392337]">
              ROSIE&apos;S LITTLE CARD COLLECTION
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {nextPackCard && (
              <button
                type="button"
                onClick={handleOpenPack}
                disabled={packRevealing}
                className="pixel-btn bg-[#EC6FA9] hover:bg-[#C94F86] px-4 py-2.5 font-pixel-ui text-xs font-bold text-[#FFFFFF] whitespace-nowrap shrink-0"
              >
                {packRevealing ? 'OPENING PACK...' : 'OPEN MYSTERY PACK ★'}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('nav');
                onBackToWorld();
              }}
              className="pixel-btn bg-[#FFDCC8] hover:bg-[#FFC0D9] px-4 py-2.5 font-pixel-ui text-xs font-bold text-[#392337] whitespace-nowrap shrink-0"
            >
              &lt; BACK TO WORLD
            </button>
          </div>
        </div>

        {/* Collection Progress Bar */}
        <div className="mt-5 pixel-panel-pink p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PixelStar className="w-6 h-6" color="#FFF5EE" />
            <div>
              <p className="font-pixel-title text-xs sm:text-sm text-[#392337]">
                COLLECTION PROGRESS: {count}/{total}
              </p>
              <p className="font-pixel-dialog text-xl text-[#392337]">
                Unlock cards via Mystery Packs, Monster Battles, Arcade Games &amp; the Secret Room!
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 shrink-0">
            <div className="flex justify-between font-pixel-ui text-xs font-bold text-[#392337] mb-1">
              <span>COMPLETION</span>
              <span className="tabular-nums">{pct}%</span>
            </div>
            <div className="w-full h-5 bg-[#392337] border-2 border-[#392337] p-0.5">
              <div
                className="h-full bg-[#EC6FA9] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Glowing Pink Pack Opening Animation Overlay */}
        {packRevealing && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#241423]/85 p-4">
            <div className="w-48 h-64 bg-gradient-to-b from-[#EC6FA9] to-[#C94F86] border-4 border-[#FFDCC8] shadow-[0_0_45px_#EC6FA9] flex flex-col items-center justify-center animate-bounce p-4 text-center">
              <PixelStar className="w-10 h-10 mb-2" color="#FFF5EE" />
              <p className="font-pixel-title text-xs text-[#FFFFFF]">ROSIE.EXE</p>
              <p className="font-pixel-ui text-[10px] text-[#FFDCC8] mt-1">
                CARD PACK OPENING...
              </p>
            </div>
          </div>
        )}

        {/* 8 Collectible 3D Trading Cards Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {COLLECTIBLE_CARDS.map((card) => {
            const isUnlocked = discoveredCards.includes(card.id);
            return (
              <TradingCardItem
                key={card.id}
                card={card}
                unlocked={isUnlocked}
                flipped={!!flippedMap[card.id]}
                onFlip={() => toggleFlip(card.id)}
                onViewDetails={() => {
                  chiptune.playSfx('click');
                  setDetailFlipped(false);
                  setDetailCard(card);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* NEW CARD UNLOCKED Booster Reveal Modal */}
      {newlyUnlockedCard && (
        <div
          onClick={() => setNewlyUnlockedCard(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#241423]/85 p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="pixel-box max-w-md w-full p-5 sm:p-6 text-center my-auto"
          >
            <div className="flex items-center justify-center gap-2 text-[#C94F86]">
              <PixelHeart className="w-5 h-5" />
              <h2 className="font-pixel-title text-sm sm:text-base text-[#392337]">
                NEW CARD UNLOCKED!
              </h2>
              <PixelHeart className="w-5 h-5" />
            </div>
            <p className="mt-1 font-pixel-ui text-xs text-[#C94F86] font-bold">
              +60 ADVENTURE POINTS!
            </p>
            <div className="mt-4 flex justify-center">
              <TradingCardItem
                card={newlyUnlockedCard}
                unlocked={true}
                flipped={!!flippedMap[newlyUnlockedCard.id]}
                onFlip={() => toggleFlip(newlyUnlockedCard.id)}
                compact
              />
            </div>
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                setNewlyUnlockedCard(null);
              }}
              className="mt-5 pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-6 py-2.5 font-pixel-ui text-xs font-bold"
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}

      {/* VIEW DETAILS Modal */}
      {detailCard && (
        <div
          onClick={() => setDetailCard(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#241423]/85 p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="pixel-box max-w-3xl w-full p-4 sm:p-6 text-[#392337] my-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
              <h2 className="font-pixel-title text-xs sm:text-sm">
                CARD {detailCard.number} — {detailCard.name}
              </h2>
              <button
                type="button"
                onClick={() => setDetailCard(null)}
                className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-3 py-1 font-pixel-ui text-xs"
              >
                X
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 flex justify-center">
                <TradingCardItem
                  card={detailCard}
                  unlocked={true}
                  flipped={detailFlipped}
                  onFlip={() => {
                    chiptune.playSfx('flip');
                    setDetailFlipped((prev) => !prev);
                  }}
                />
              </div>

              <div className="md:col-span-6 space-y-3">
                <div className="bg-[#FFD6E7] border-3 border-[#392337] p-3">
                  <p className="font-pixel-ui text-xs font-bold text-[#C94F86]">
                    {detailCard.rarity} · {detailCard.type}
                  </p>
                  <p className="font-pixel-dialog text-2xl mt-1 leading-snug">
                    {detailCard.bio}
                  </p>
                </div>

                <div className="bg-[#D9C7FF]/70 border-3 border-[#392337] p-3 space-y-1">
                  <p className="font-pixel-ui text-xs font-bold">
                    ABILITY: {detailCard.abilityName}
                  </p>
                  <p className="font-pixel-dialog text-xl leading-tight">
                    {detailCard.abilityDesc}
                  </p>
                </div>

                <div className="bg-[#FFDCC8] border-3 border-[#392337] p-3 space-y-1">
                  <p className="font-pixel-ui text-xs font-bold">
                    SPECIAL MOVE: {detailCard.specialMoveName} ({detailCard.specialMoveDamage})
                  </p>
                  <p className="font-pixel-dialog text-xl">
                    Weakness: {detailCard.weakness} · Resistance: {detailCard.resistance}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      chiptune.playSfx('flip');
                      setDetailFlipped((prev) => !prev);
                    }}
                    className="pixel-btn flex-1 bg-[#EC6FA9] text-[#FFFFFF] px-4 py-2.5 font-pixel-ui text-xs font-bold whitespace-nowrap shrink-0"
                  >
                    FLIP TO {detailFlipped ? 'FRONT' : 'BACK'} ↻
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailCard(null)}
                    className="pixel-btn bg-[#FFF5EE] px-4 py-2.5 font-pixel-ui text-xs font-bold"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
