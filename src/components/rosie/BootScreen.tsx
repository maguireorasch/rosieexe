import React, { useEffect, useState } from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { BOOT_MESSAGES } from '../../lib/rosieData';
import { PixelStar } from './PixelSprites';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= BOOT_MESSAGES.length) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 520);

    const autoDone = window.setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(autoDone);
    };
  }, [onComplete]);

  const progressPct = Math.round((visibleCount / BOOT_MESSAGES.length) * 100);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-b from-[#392337] via-[#7A3560] to-[#EC6FA9]">
      {/* Floating Pixel Stars */}
      {[
        { top: '12%', left: '14%', delay: '0s' },
        { top: '20%', right: '18%', delay: '0.6s' },
        { bottom: '22%', left: '20%', delay: '1.1s' },
        { bottom: '18%', right: '14%', delay: '0.3s' },
        { top: '48%', left: '8%', delay: '1.5s' },
        { top: '44%', right: '9%', delay: '0.9s' },
      ].map((pos, idx) => (
        <div
          key={idx}
          className="animate-star-twinkle pointer-events-none absolute"
          style={{ ...pos, animationDelay: pos.delay }}
        >
          <PixelStar className="w-5 h-5" color={idx % 2 === 0 ? '#FFD6E7' : '#D9C7FF'} />
        </div>
      ))}

      {/* Retro Computer Boot Terminal Window */}
      <div className="relative z-10 w-full max-w-xl pixel-panel-dark p-1">
        <div className="flex items-center justify-between bg-[#EC6FA9] px-3 py-2 border-b-4 border-[#241423]">
          <span className="font-pixel-ui text-xs sm:text-sm font-bold text-[#392337] tracking-wider">
            ROSIE.EXE // SYSTEM BOOT
          </span>
          <span className="font-pixel-ui text-xs text-[#392337]">V1.0</span>
        </div>

        <div className="p-5 sm:p-7 space-y-5 bg-[#241423]">
          <div className="space-y-2 min-h-[210px]">
            {BOOT_MESSAGES.slice(0, visibleCount).map((line, i) => (
              <p
                key={line}
                className={`font-pixel-dialog text-2xl sm:text-3xl tracking-wide ${
                  line.includes('PLAYER FOUND') || line.includes('WELCOME')
                    ? 'text-[#FFC0D9]'
                    : 'text-[#FFF5EE]'
                }`}
              >
                &gt; {line}
                {i === visibleCount - 1 && (
                  <span className="animate-blink inline-block w-2.5 h-5 bg-[#EC6FA9] ml-2 align-middle" />
                )}
              </p>
            ))}
          </div>

          {/* Chunked Pixel Loading Bar */}
          <div>
            <div className="flex items-center justify-between font-pixel-ui text-xs text-[#FFD6E7] mb-2">
              <span>LOADING CARTRIDGE</span>
              <span className="tabular-nums">{progressPct}%</span>
            </div>
            <div className="w-full h-7 bg-[#392337] border-4 border-[#FFD6E7] p-1 flex gap-1">
              {Array.from({ length: 14 }, (_, idx) => {
                const filled = (idx + 1) / 14 <= visibleCount / BOOT_MESSAGES.length;
                return (
                  <div
                    key={idx}
                    className={`flex-1 h-full transition-colors duration-200 ${
                      filled ? 'bg-[#EC6FA9]' : 'bg-[#392337]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('boot');
                onComplete();
              }}
              className="pixel-btn bg-[#FFD6E7] hover:bg-[#FFC0D9] px-4 py-2 font-pixel-ui text-xs text-[#392337] font-bold"
            >
              SKIP INTRO &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
