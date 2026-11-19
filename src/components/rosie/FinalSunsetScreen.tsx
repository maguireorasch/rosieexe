import React, { useEffect, useRef } from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import type { CharacterId } from '../../types/rosie';
import { CharacterSprite, PixelHeart, PixelStar } from './PixelSprites';

interface FinalSunsetScreenProps {
  selectedCharacter: CharacterId;
  onPlayAgain: () => void;
  onReturnToWorld: () => void;
}

export const FinalSunsetScreen: React.FC<FinalSunsetScreenProps> = ({
  selectedCharacter,
  onPlayAgain,
  onReturnToWorld,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }

    const sparks: Spark[] = [];
    const palette = ['#FFFFFF', '#FFD6E7', '#EC6FA9', '#FFDCC8', '#D9C7FF'];

    const spawnBurst = () => {
      const cx = 80 + Math.random() * Math.max(120, canvas.width - 160);
      const cy = 60 + Math.random() * Math.max(100, canvas.height * 0.45);
      for (let i = 0; i < 24; i += 1) {
        const angle = (i / 24) * Math.PI * 2;
        const spd = 1.6 + Math.random() * 2.8;
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1,
          color: palette[i % palette.length],
        });
      }
    };

    spawnBurst();
    const burstInterval = window.setInterval(spawnBurst, 1300);

    let rafId = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04;
        s.life -= 0.018;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), 6, 6);
      }
      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.clearInterval(burstInterval);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#7A3560] via-[#EC6FA9] to-[#FFDCC8] text-[#392337]">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10"
        aria-hidden="true"
      />

      {/* Falling Sakura Petals */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="animate-float-petal absolute -top-6 w-3 h-3 bg-[#FFF5EE] border border-[#EC6FA9]"
            style={{
              left: `${(i * 7.2 + 3) % 96}%`,
              animationDelay: `${i * 0.65}s`,
              ['--dur' as string]: `${9 + (i % 4) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Pixel Sunset Landscape */}
      <svg
        viewBox="0 0 640 200"
        shapeRendering="crispEdges"
        preserveAspectRatio="xMidYMax slice"
        className="pointer-events-none absolute bottom-0 inset-x-0 w-full h-56 sm:h-64 z-0"
        aria-hidden="true"
      >
        <circle cx="320" cy="110" r="46" fill="#FFF5EE" opacity="0.7" />
        <rect x="288" y="88" width="64" height="54" fill="#C94F86" opacity="0.7" />
        <polygon points="284,90 320,66 356,90" fill="#7A3560" opacity="0.8" />
        <rect x="0" y="138" width="640" height="62" fill="#543451" />
        <rect x="0" y="138" width="640" height="8" fill="#EC6FA9" />
        <rect x="52" y="96" width="14" height="50" fill="#392337" />
        <rect x="26" y="64" width="64" height="36" fill="#FFC0D9" />
        <rect x="572" y="96" width="14" height="50" fill="#392337" />
        <rect x="548" y="64" width="64" height="36" fill="#FFC0D9" />
      </svg>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="pixel-box max-w-2xl w-full p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <PixelStar className="w-6 h-6" color="#EC6FA9" />
            <PixelHeart className="w-6 h-6" color="#C94F86" />
            <PixelStar className="w-6 h-6" color="#EC6FA9" />
          </div>

          <h1 className="font-pixel-title text-base sm:text-2xl text-[#C94F86] leading-snug">
            THANKS FOR PLAYING, ROSIE!
          </h1>
          <p className="mt-2 font-pixel-ui text-xs sm:text-sm font-bold text-[#392337]">
            &ldquo;Every great adventure deserves a little celebration.&rdquo;
          </p>

          <p className="mt-5 font-pixel-dialog text-2xl sm:text-3xl leading-snug text-[#392337]">
            Hope this tiny pixel world made you smile, Rosie. Stay awesome and never stop exploring!
          </p>

          <div className="mt-5 bg-[#FFD6E7] border-3 border-[#392337] px-4 py-2.5 inline-block">
            <p className="font-pixel-ui text-[10px] sm:text-xs font-bold text-[#392337]">
              MADE WITH CARE — JUST FOR HANNALLE DEWYROSE.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('victory');
                onPlayAgain();
              }}
              className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-7 py-3.5 font-pixel-title text-xs whitespace-nowrap shrink-0"
            >
              PLAY AGAIN
            </button>

            <button
              type="button"
              onClick={() => {
                chiptune.playSfx('nav');
                onReturnToWorld();
              }}
              className="pixel-btn bg-[#FFDCC8] text-[#392337] px-5 py-3.5 font-pixel-ui text-xs font-bold whitespace-nowrap shrink-0"
            >
              EXPLORE WORLD
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-20 pb-6 flex justify-center">
        <div className="animate-pixel-bob">
          <CharacterSprite id={selectedCharacter} className="w-20 h-20 sm:w-24 sm:h-24" />
        </div>
      </div>
    </div>
  );
};
