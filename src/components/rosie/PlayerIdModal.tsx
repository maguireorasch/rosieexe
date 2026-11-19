import React, { useState } from 'react';
import type { CharacterId } from '../../types/rosie';
import { chiptune } from '../../lib/chiptuneAudio';
import { CharacterSprite, PixelHeart, PixelStar } from './PixelSprites';

interface PlayerIdModalProps {
  open: boolean;
  selectedCharacter: CharacterId;
  onClose: () => void;
}

export const PlayerIdModal: React.FC<PlayerIdModalProps> = ({
  open,
  selectedCharacter,
  onClose,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!open) return null;

  const handleDownloadPng = () => {
    chiptune.playSfx('unlock');
    const canvas = document.createElement('canvas');
    canvas.width = 920;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Outer Dark Plum Pixel Frame
    ctx.fillStyle = '#392337';
    ctx.fillRect(0, 0, 920, 560);

    // Pink Window Interior
    ctx.fillStyle = '#FFC0D9';
    ctx.fillRect(10, 10, 900, 540);

    // Title Bar
    ctx.fillStyle = '#EC6FA9';
    ctx.fillRect(18, 18, 884, 52);
    ctx.fillStyle = '#392337';
    ctx.fillRect(18, 70, 884, 6);

    ctx.fillStyle = '#FFF5EE';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('ROSIE.EXE // PLAYER IDENTIFICATION CARD', 36, 52);

    // Cream Body Card
    ctx.fillStyle = '#FFF5EE';
    ctx.fillRect(34, 96, 852, 430);
    ctx.strokeStyle = '#392337';
    ctx.lineWidth = 6;
    ctx.strokeRect(34, 96, 852, 430);

    // Portrait Frame Left
    ctx.fillStyle = '#FFD6E7';
    ctx.fillRect(58, 122, 230, 260);
    ctx.strokeRect(58, 122, 230, 260);

    // Simple Crisp Pixel Portrait Emblem inside Canvas (Blonde Rosie)
    const px = 115;
    const py = 175;
    const s = 8;
    const drawPx = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(px + x * s, py + y * s, w * s, h * s);
    };
    drawPx(3, 1, 10, 10, '#241423');
    drawPx(4, 1, 8, 2, '#F5BA3B');
    drawPx(3, 2, 10, 4, '#FFD55A');
    drawPx(5, 2, 5, 1, '#FFF2A8');
    drawPx(2, 4, 2, 6, '#F5BA3B');
    drawPx(12, 4, 2, 6, '#F5BA3B');
    drawPx(10, 2, 2, 1, '#EC6FA9');
    drawPx(4, 4, 8, 5, '#FFE2C6');
    drawPx(5, 6, 1, 2, '#469658');
    drawPx(10, 6, 1, 2, '#469658');
    drawPx(4, 9, 8, 5, '#B6E0FF');
    drawPx(5, 10, 6, 3, '#CFEAFF');

    // ID Badge Strip Below Portrait
    ctx.fillStyle = '#392337';
    ctx.fillRect(58, 396, 230, 44);
    ctx.fillStyle = '#FFDCC8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('ID: ROSIE-001', 96, 425);

    // Right Info Panel
    const lines: Array<[string, string]> = [
      ['NAME:', 'HANNALLE DEWYROSE'],
      ['NICKNAME:', 'ROSIE'],
      ['CLASS:', 'SPECIAL ADVENTURER'],
      ['RANK:', 'LEGENDARY'],
      ['STATUS:', 'ONE OF A KIND'],
      ['ROLE:', 'MAIN CHARACTER'],
      ['SKILL:', 'MAKING EVERY ADVENTURE MORE FUN'],
    ];

    let yCursor = 148;
    lines.forEach(([k, v]) => {
      ctx.fillStyle = '#C94F86';
      ctx.font = 'bold 17px monospace';
      ctx.fillText(k, 318, yCursor);
      ctx.fillStyle = '#392337';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(v, 435, yCursor);
      yCursor += 38;
    });

    // Bottom Personalized Quote
    ctx.fillStyle = '#FFD6E7';
    ctx.fillRect(318, 412, 540, 88);
    ctx.strokeStyle = '#392337';
    ctx.lineWidth = 3;
    ctx.strokeRect(318, 412, 540, 88);

    ctx.fillStyle = '#392337';
    ctx.font = '15px sans-serif';
    ctx.fillText('"Every adventure becomes a little more interesting when', 334, 446);
    ctx.fillText('the right people are part of it. Made especially for you!"', 334, 474);

    const link = document.createElement('a');
    link.download = 'ROSIE-001-ID-CARD.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#392337]/75 p-3 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl pixel-panel-pink overflow-hidden my-auto"
      >
        {/* Retro Computer Window Title Bar */}
        <div className="bg-[#EC6FA9] border-b-4 border-[#392337] px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <PixelHeart className="w-4 h-4 shrink-0" color="#FFF5EE" />
            <span className="font-pixel-title text-[10px] sm:text-xs text-[#FFF5EE] truncate">
              PLAYER IDENTIFICATION CARD
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onClose();
            }}
            aria-label="Close ID Card"
            className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-title text-[10px] px-2.5 py-1 shrink-0"
          >
            X
          </button>
        </div>

        {/* Window Content */}
        <div className="p-4 sm:p-6 bg-[#FFD6E7]">
          <div className="pixel-box p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left Portrait + Badges */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="w-full aspect-square max-w-[200px] bg-gradient-to-b from-[#D9C7FF] to-[#FFC0D9] border-4 border-[#392337] flex items-center justify-center relative p-3">
                  <div className="absolute top-2 left-2">
                    <PixelStar className="w-4 h-4" color="#FFF5EE" />
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <PixelHeart className="w-4 h-4" color="#C94F86" />
                  </div>
                  <div className="animate-pixel-bob">
                    <CharacterSprite id={selectedCharacter} className="w-28 h-28" />
                  </div>
                </div>

                <div className="mt-3 w-full max-w-[200px] bg-[#392337] border-2 border-[#392337] px-3 py-2 text-center">
                  <span className="font-pixel-title text-[11px] text-[#FFDCC8]">
                    ID: ROSIE-001
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="bg-[#EC6FA9] text-[#FFF5EE] border-2 border-[#392337] px-2 py-0.5 font-pixel-ui text-[10px] font-bold">
                    ★ LEGENDARY
                  </span>
                  <span className="bg-[#D9C7FF] text-[#392337] border-2 border-[#392337] px-2 py-0.5 font-pixel-ui text-[10px] font-bold">
                    ♡ VIP
                  </span>
                </div>
              </div>

              {/* Right Details Grid */}
              <div className="md:col-span-8 space-y-2.5">
                {[
                  ['NAME', 'HANNALLE DEWYROSE'],
                  ['NICKNAME', 'ROSIE'],
                  ['CLASS', 'SPECIAL ADVENTURER'],
                  ['RANK', 'LEGENDARY'],
                  ['STATUS', 'ONE OF A KIND'],
                  ['ROLE', 'MAIN CHARACTER'],
                  ['SPECIAL ABILITY', 'MAKING EVERY ADVENTURE MORE FUN'],
                  ['PLAYER ID', 'ROSIE-001'],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b-2 border-dashed border-[#F7A8C9] pb-1.5"
                  >
                    <span className="font-pixel-ui text-xs font-bold text-[#C94F86]">
                      {label}:
                    </span>
                    <span className="font-pixel-ui text-xs sm:text-sm font-bold text-[#392337]">
                      {val}
                    </span>
                  </div>
                ))}

                {/* Personalized Message Box */}
                <div className="mt-4 bg-[#FFD6E7] border-3 border-[#392337] p-3.5 relative">
                  <p className="font-rounded text-xs sm:text-sm font-bold text-[#392337] leading-relaxed">
                    &ldquo;Every adventure becomes a little more interesting when the right people are part of it. This little world was created especially for you!&rdquo;
                  </p>
                  <span className="inline-block w-2.5 h-4 bg-[#C94F86] animate-blink ml-1 align-middle" />
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-6 pt-4 border-t-2 border-[#F7A8C9] flex flex-wrap items-center justify-between gap-3">
              <span className="font-pixel-ui text-xs text-[#C94F86]">
                {downloaded ? '✓ SAVED ROSIE-001-ID-CARD.PNG!' : 'ISSUED BY: A FRIEND ♡'}
              </span>
              <button
                type="button"
                onClick={handleDownloadPng}
                className="pixel-btn bg-[#EC6FA9] text-[#FFF5EE] font-pixel-title text-[10px] sm:text-xs px-5 py-3"
              >
                DOWNLOAD ID CARD (PNG)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
