import React, { useState } from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { CHARACTERS } from '../../lib/rosieData';
import type { CharacterId } from '../../types/rosie';
import { CharacterSprite } from './PixelSprites';

interface CharacterSelectScreenProps {
  selectedCharacter: CharacterId;
  onSelectCharacter: (id: CharacterId) => void;
  onBack: () => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({
  selectedCharacter,
  onSelectCharacter,
  onBack,
}) => {
  const startIdx = Math.max(
    0,
    CHARACTERS.findIndex((c) => c.id === selectedCharacter)
  );
  const [index, setIndex] = useState(startIdx);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const active = CHARACTERS[index];

  const handlePrev = () => {
    chiptune.playSfx('select');
    setIndex((prev) => (prev - 1 + CHARACTERS.length) % CHARACTERS.length);
  };

  const handleNext = () => {
    chiptune.playSfx('select');
    setIndex((prev) => (prev + 1) % CHARACTERS.length);
  };

  const statRows = [
    { label: 'HP', val: active.hp, max: 100, color: '#EC6FA9' },
    { label: 'SPEED', val: active.speed, max: 100, color: '#D9C7FF' },
    { label: 'LUCK', val: active.luck, max: 100, color: '#FFDCC8' },
    { label: 'ATTACK', val: active.attack, max: 100, color: '#C94F86' },
  ];

  return (
    <div className="min-h-screen w-full pixel-checker-pink py-8 px-4 flex flex-col items-center justify-center">
      {/* Arcade Monitor Frame */}
      <div className="max-w-4xl w-full pixel-panel-dark p-3 sm:p-5 bg-[#5E354E]">
        <div className="bg-[#392337] border-4 border-[#FFD6E7] px-4 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('click');
              onBack();
            }}
            className="pixel-btn bg-[#FFD6E7] px-3 py-1.5 font-pixel-ui text-xs text-[#392337] font-bold whitespace-nowrap shrink-0"
          >
            &lt; TITLE
          </button>
          <h1 className="font-pixel-title text-xs sm:text-lg text-[#FFC0D9] text-center">
            CHOOSE YOUR CHARACTER
          </h1>
          <span className="font-pixel-ui text-xs text-[#FFDCC8] tabular-nums whitespace-nowrap shrink-0">
            {active.code} / 05
          </span>
        </div>

        <div className="mt-4 bg-[#FFD6E7] border-4 border-[#392337] p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Character Portrait Preview */}
            <div className="md:col-span-6 flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous character"
                  className="pixel-btn bg-[#D9C7FF] hover:bg-[#FFF5EE] w-11 h-11 flex items-center justify-center font-pixel-title text-base text-[#392337] shrink-0"
                >
                  &lt;
                </button>

                <div className="relative flex-1 max-w-[230px] aspect-square bg-[#392337] border-4 border-[#392337] shadow-[inset_0_0_0_4px_#EC6FA9] flex flex-col items-center justify-center p-4">
                  <div className="animate-pixel-bob">
                    <CharacterSprite id={active.id} className="w-28 h-28 sm:w-32 sm:h-32" />
                  </div>
                  <span className="mt-2 font-pixel-ui text-[10px] text-[#FFDCC8] tracking-widest">
                    PLAYER READY
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next character"
                  className="pixel-btn bg-[#D9C7FF] hover:bg-[#FFF5EE] w-11 h-11 flex items-center justify-center font-pixel-title text-base text-[#392337] shrink-0"
                >
                  &gt;
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
                {CHARACTERS.map((char, idx) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      chiptune.playSfx('select');
                      setIndex(idx);
                    }}
                    className={`p-1.5 border-3 border-[#392337] transition-transform ${
                      idx === index
                        ? 'bg-[#EC6FA9] -translate-y-1 shadow-[3px_3px_0px_#392337]'
                        : 'bg-[#FFF5EE] hover:bg-[#FFC0D9]'
                    }`}
                    title={char.name}
                  >
                    <CharacterSprite id={char.id} className="w-8 h-8" />
                  </button>
                ))}
              </div>
            </div>

            {/* Stats & Action Panel */}
            <div className="md:col-span-6 pixel-box p-4 sm:p-5 text-[#392337]">
              <div className="border-b-4 border-[#392337] pb-2">
                <p className="font-pixel-ui text-xs text-[#C94F86] font-bold">
                  {active.code}. {active.title}
                </p>
                <h2 className="mt-1 font-pixel-title text-lg sm:text-xl text-[#392337]">
                  {active.name}
                </h2>
              </div>

              <p className="mt-3 font-pixel-dialog text-2xl leading-snug text-[#392337]">
                {active.description}
              </p>

              <div className="mt-4 space-y-2.5">
                {statRows.map((st) => (
                  <div key={st.label}>
                    <div className="flex items-center justify-between font-pixel-ui text-[11px] font-bold mb-1">
                      <span>{st.label}</span>
                      <span className="tabular-nums">{st.val}</span>
                    </div>
                    <div className="w-full h-3.5 bg-[#392337] border-2 border-[#392337] p-0.5">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round((st.val / st.max) * 100))}%`,
                          backgroundColor: st.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-[#FFD6E7] border-2 border-[#392337] px-3 py-2">
                <span className="font-pixel-ui text-[10px] text-[#C94F86] block font-bold">
                  SPECIAL SKILL
                </span>
                <span className="font-pixel-ui text-xs text-[#392337] font-bold">
                  ★ {active.specialSkill}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    chiptune.playSfx('click');
                    setInfoModalOpen(true);
                  }}
                  className="pixel-btn bg-[#FFDCC8] hover:bg-[#FFF5EE] px-4 py-2.5 font-pixel-ui text-xs font-bold text-[#392337] whitespace-nowrap shrink-0"
                >
                  CHARACTER INFO
                </button>

                <button
                  type="button"
                  onClick={() => {
                    chiptune.playSfx('victory');
                    onSelectCharacter(active.id);
                  }}
                  className="pixel-btn flex-1 bg-[#EC6FA9] hover:bg-[#C94F86] px-5 py-2.5 font-pixel-title text-xs text-[#FFFFFF] whitespace-nowrap shrink-0"
                >
                  SELECT CHARACTER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Information Modal */}
      {infoModalOpen && (
        <div
          onClick={() => setInfoModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#241423]/75 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="pixel-box max-w-md w-full p-5 text-[#392337]"
          >
            <div className="flex items-center justify-between pb-3 border-b-4 border-[#392337]">
              <h3 className="font-pixel-title text-sm">{active.name} DOSSIER</h3>
              <button
                type="button"
                onClick={() => setInfoModalOpen(false)}
                className="pixel-btn bg-[#EC6FA9] text-white px-2.5 py-1 font-pixel-ui text-xs"
              >
                X
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="p-2 bg-[#FFC0D9] border-3 border-[#392337]">
                <CharacterSprite id={active.id} className="w-16 h-16" />
              </div>
              <div>
                <p className="font-pixel-ui text-xs font-bold text-[#C94F86]">{active.title}</p>
                <p className="font-pixel-dialog text-2xl mt-1">Skill: {active.specialSkill}</p>
              </div>
            </div>
            <p className="mt-4 font-pixel-dialog text-2xl leading-snug">{active.description}</p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoModalOpen(false)}
                className="pixel-btn bg-[#FFD6E7] px-4 py-2 font-pixel-ui text-xs font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
