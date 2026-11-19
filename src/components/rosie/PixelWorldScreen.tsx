import React, { useEffect, useState } from 'react';
import type { CharacterId, GameScreen } from '../../types/rosie';
import { chiptune } from '../../lib/chiptuneAudio';
import { CharacterSprite, PixelFlower, PixelHeart, PixelStar } from './PixelSprites';

interface PixelWorldScreenProps {
  selectedCharacter: CharacterId;
  chestOpened: boolean;
  secretUnlocked: boolean;
  onNavigate: (screen: GameScreen) => void;
  onOpenIdCard: () => void;
  onOpenChest: () => void;
  onDiscoverObject: (objectId: string, apGain: number, starGain: number) => void;
}

interface WorldLandmark {
  id: string;
  label: string;
  x: number; // %
  y: number; // %
  color: string;
  actionText: string;
}

const LANDMARKS: WorldLandmark[] = [
  { id: 'mansion', label: 'PINK MANSION', x: 20, y: 24, color: '#C94F86', actionText: 'Monster Battle!' },
  { id: 'cherry', label: 'CHERRY TREE', x: 50, y: 20, color: '#EC6FA9', actionText: 'Card Collection' },
  { id: 'door', label: 'SECRET DOOR', x: 82, y: 24, color: '#392337', actionText: 'Secret Room' },
  { id: 'house', label: 'PINK HOUSE', x: 18, y: 56, color: '#F7A8C9', actionText: 'ID Card' },
  { id: 'pond', label: 'LAVENDER POND', x: 50, y: 54, color: '#D9C7FF', actionText: 'Find Star' },
  { id: 'arcade', label: 'ARCADE MACHINE', x: 82, y: 56, color: '#EC6FA9', actionText: 'Mini-Games' },
  { id: 'mailbox', label: 'PINK MAILBOX', x: 24, y: 80, color: '#C94F86', actionText: 'Special Notes' },
  { id: 'flowers', label: 'FLOWER FIELD', x: 52, y: 82, color: '#FFC0D9', actionText: 'Pick Flower' },
  { id: 'chest', label: 'TREASURE CHEST', x: 80, y: 80, color: '#FFDCC8', actionText: 'Open Chest' },
];

export const PixelWorldScreen: React.FC<PixelWorldScreenProps> = ({
  selectedCharacter,
  chestOpened,
  secretUnlocked,
  onNavigate,
  onOpenIdCard,
  onOpenChest,
  onDiscoverObject,
}) => {
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 50, y: 42 });
  const [worldNotice, setWorldNotice] = useState<string>(
    'Walk around with WASD / Arrow Keys / D-Pad or tap any object in the Pink Pixel World!'
  );

  const movePlayer = (dx: number, dy: number) => {
    setPlayerPos((prev) => ({
      x: Math.max(8, Math.min(92, prev.x + dx)),
      y: Math.max(12, Math.min(88, prev.y + dy)),
    }));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const step = 4.5;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        movePlayer(0, -step);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        movePlayer(0, step);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        movePlayer(-step, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        movePlayer(step, 0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleInteractLandmark = (lm: WorldLandmark) => {
    setPlayerPos({ x: lm.x, y: Math.min(88, lm.y + 8) });
    chiptune.playSfx('click');

    switch (lm.id) {
      case 'mansion':
        onNavigate('battle');
        break;
      case 'cherry':
        onNavigate('cards');
        break;
      case 'mailbox':
        onNavigate('mailbox');
        break;
      case 'arcade':
        onNavigate('arcade');
        break;
      case 'door':
        onNavigate('secret');
        break;
      case 'house':
        onOpenIdCard();
        break;
      case 'chest':
        if (!chestOpened) {
          chiptune.playSfx('treasure');
          onOpenChest();
          setWorldNotice('TREASURE CHEST OPENED! +100 AP, +2 Stars & a Bonus Card Unlocked! ★');
        } else {
          setWorldNotice('You already claimed this pink treasure chest! Check your Card Collection ♡');
        }
        break;
      case 'pond':
        onDiscoverObject('pond', 25, 1);
        setWorldNotice('You tossed a wish into the Lavender Pond! +25 AP & +1 Star! ★');
        break;
      case 'flowers':
        onDiscoverObject('flowers', 20, 1);
        setWorldNotice('A fresh blossom breeze drifts through the Flower Field! +20 AP & +1 Star! ✿');
        break;
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Interactive Pixel Map Arena */}
        <div className="pixel-panel-pink p-3 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h1 className="font-pixel-title text-xs sm:text-base text-[#392337]">
              PINK PIXEL WORLD MAP
            </h1>
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('click');
                onOpenIdCard();
              }}
              className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-ui text-xs font-bold px-3 py-1.5"
            >
              VIEW PLAYER ID CARD
            </button>
          </div>

          {/* Interactive Map Canvas */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setPlayerPos({
                x: Math.max(8, Math.min(92, x)),
                y: Math.max(12, Math.min(88, y)),
              });
            }}
            className="relative w-full h-[380px] sm:h-[440px] bg-gradient-to-b from-[#FFD6E7] via-[#FFC0D9] to-[#F7A8C9] border-4 border-[#392337] overflow-hidden cursor-crosshair select-none"
          >
            {/* Pixel Cobble Paths */}
            <div className="pointer-events-none absolute left-[18%] right-[18%] top-[54%] h-7 bg-[#FFF5EE]/75 border-y-2 border-[#C94F86]/40" />
            <div className="pointer-events-none absolute top-[24%] bottom-[18%] left-[48%] w-8 bg-[#FFF5EE]/75 border-x-2 border-[#C94F86]/40" />

            {/* Decorative Lavender Pond Oval */}
            <div className="pointer-events-none absolute left-[41%] top-[46%] w-[18%] h-16 rounded-full bg-[#D9C7FF] border-4 border-[#392337]" />

            {/* Landmarks */}
            {LANDMARKS.map((lm) => (
              <button
                key={lm.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInteractLandmark(lm);
                }}
                style={{ left: `${lm.x}%`, top: `${lm.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className="px-2.5 py-2 border-3 border-[#392337] shadow-[3px_3px_0_#392337] group-hover:-translate-y-1 transition-transform flex flex-col items-center"
                  style={{ backgroundColor: lm.color }}
                >
                  {lm.id === 'flowers' && <PixelFlower className="w-6 h-6" />}
                  {lm.id === 'pond' && <PixelStar className="w-6 h-6" color="#FFF5EE" />}
                  {lm.id === 'mailbox' && <PixelHeart className="w-5 h-5" color="#FFF5EE" />}
                  {lm.id === 'chest' && (
                    <span className="font-pixel-title text-[10px] text-[#392337]">
                      {chestOpened ? 'OPEN' : '★CHEST'}
                    </span>
                  )}
                  {lm.id === 'door' && (
                    <span className="font-pixel-title text-[10px] text-[#FFDCC8]">
                      {secretUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  )}
                  {!['flowers', 'pond', 'mailbox', 'chest', 'door'].includes(lm.id) && (
                    <span className="font-pixel-title text-[10px] text-[#FFF5EE]">
                      ★
                    </span>
                  )}
                </div>
                <span className="mt-1 bg-[#392337] text-[#FFF5EE] font-pixel-ui text-[9px] px-1.5 py-0.5 whitespace-nowrap">
                  {lm.label}
                </span>
              </button>
            ))}

            {/* Walkable Player Avatar */}
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-150"
              style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
            >
              <div className="animate-pixel-bob">
                <CharacterSprite
                  id={selectedCharacter}
                  className="w-14 h-14 drop-shadow-[2px_3px_0_#392337]"
                />
              </div>
            </div>
          </div>

          {/* Dialogue Notice + Mobile D-Pad */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 pixel-box p-3 min-h-[68px] flex items-center">
              <p className="font-pixel-dialog text-xl sm:text-2xl text-[#392337]">
                {worldNotice}
              </p>
            </div>

            {/* Directional Controls (Great for Mobile & Tablet) */}
            <div className="md:col-span-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => movePlayer(-6, 0)}
                aria-label="Move Left"
                className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-title text-xs px-3 py-2.5"
              >
                ◄
              </button>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => movePlayer(0, -6)}
                  aria-label="Move Up"
                  className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-title text-xs px-3 py-2"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => movePlayer(0, 6)}
                  aria-label="Move Down"
                  className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-title text-xs px-3 py-2"
                >
                  ▼
                </button>
              </div>
              <button
                type="button"
                onClick={() => movePlayer(6, 0)}
                aria-label="Move Right"
                className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-title text-xs px-3 py-2.5"
              >
                ►
              </button>
            </div>
          </div>
        </div>

        {/* Fast Travel Destination Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'CARD COLLECTION', screen: 'cards' as GameScreen, bg: '#EC6FA9', fg: '#FFF5EE' },
            { label: 'PINK MAILBOX', screen: 'mailbox' as GameScreen, bg: '#D9C7FF', fg: '#392337' },
            { label: 'MONSTER BATTLE', screen: 'battle' as GameScreen, bg: '#C94F86', fg: '#FFF5EE' },
            { label: 'PIXEL ARCADE', screen: 'arcade' as GameScreen, bg: '#FFDCC8', fg: '#392337' },
            { label: 'SECRET ROOM', screen: 'secret' as GameScreen, bg: '#392337', fg: '#FFDCC8' },
          ].map((dest) => (
            <button
              key={dest.screen}
              type="button"
              onClick={() => {
                chiptune.playSfx('nav');
                onNavigate(dest.screen);
              }}
              style={{ backgroundColor: dest.bg, color: dest.fg }}
              className="pixel-btn font-pixel-title text-[10px] px-3 py-3.5 text-center"
            >
              {dest.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
