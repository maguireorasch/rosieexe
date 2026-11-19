import React, { useState } from 'react';
import { chiptune } from '../../lib/chiptuneAudio';
import { COLLECTIBLE_CARDS, MONSTERS } from '../../lib/rosieData';
import type { CharacterId, MonsterId, MonsterProfile } from '../../types/rosie';
import { CharacterSprite, MonsterSprite, PixelHeart, PixelStar } from './PixelSprites';

interface MonsterBattleScreenProps {
  selectedCharacter: CharacterId;
  defeatedMonsters: MonsterId[];
  onMonsterDefeated: (monster: MonsterProfile) => void;
  onBackToWorld: () => void;
}

export const MonsterBattleScreen: React.FC<MonsterBattleScreenProps> = ({
  selectedCharacter,
  defeatedMonsters,
  onMonsterDefeated,
  onBackToWorld,
}) => {
  const [monsterIdx, setMonsterIdx] = useState(0);
  const monster = MONSTERS[monsterIdx];

  const [playerHp, setPlayerHp] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [monsterHp, setMonsterHp] = useState(monster.maxHp);
  const [busyTurn, setBusyTurn] = useState(false);
  const [battleLog, setBattleLog] = useState(
    `A wild ${monster.name} appeared in the Pink Forest!`
  );
  const [outcome, setOutcome] = useState<'playing' | 'victory' | 'defeat'>('playing');

  const [playerDmgPopup, setPlayerDmgPopup] = useState<string | null>(null);
  const [monsterDmgPopup, setMonsterDmgPopup] = useState<string | null>(null);
  const [shakingTarget, setShakingTarget] = useState<'player' | 'monster' | null>(null);

  const startFight = (idx: number) => {
    const nextMonster = MONSTERS[idx];
    setMonsterIdx(idx);
    setPlayerHp(100);
    setPlayerEnergy(100);
    setMonsterHp(nextMonster.maxHp);
    setBusyTurn(false);
    setOutcome('playing');
    setPlayerDmgPopup(null);
    setMonsterDmgPopup(null);
    setBattleLog(`A wild ${nextMonster.name} (${nextMonster.title}) appeared!`);
  };

  const executeMonsterTurn = (nextMonsterHp: number, isDefending: boolean) => {
    if (nextMonsterHp <= 0) {
      chiptune.playSfx('victory');
      setOutcome('victory');
      setBusyTurn(false);
      onMonsterDefeated(monster);
      return;
    }

    window.setTimeout(() => {
      chiptune.playSfx('attack');
      const raw = monster.attack - 2 + Math.floor(Math.random() * 6);
      const dmg = isDefending ? Math.max(3, Math.floor(raw * 0.45)) : raw;
      setShakingTarget('player');
      setPlayerDmgPopup(`-${dmg}`);
      window.setTimeout(() => setShakingTarget(null), 350);

      setPlayerHp((prev) => {
        const updated = Math.max(0, prev - dmg);
        if (updated <= 0) {
          setOutcome('defeat');
        }
        return updated;
      });
      setBattleLog(
        `${monster.name} used ${monster.specialAbility}! Took ${dmg} DMG${
          isDefending ? ' (Shielded!)' : ''
        }.`
      );
      setBusyTurn(false);
    }, 650);
  };

  const handleAttack = () => {
    if (busyTurn || outcome !== 'playing') return;
    setBusyTurn(true);
    chiptune.playSfx('attack');
    const dmg = Math.max(12, 20 + Math.floor(Math.random() * 11) - Math.floor(monster.defense / 2));
    const nextHp = Math.max(0, monsterHp - dmg);
    setMonsterHp(nextHp);
    setShakingTarget('monster');
    setMonsterDmgPopup(`-${dmg}`);
    window.setTimeout(() => setShakingTarget(null), 350);
    setBattleLog(`You attacked ${monster.name} for ${dmg} damage!`);
    executeMonsterTurn(nextHp, false);
  };

  const handleSpecialSkill = () => {
    if (busyTurn || outcome !== 'playing' || playerEnergy < 30) return;
    setBusyTurn(true);
    chiptune.playSfx('unlock');
    setPlayerEnergy((e) => Math.max(0, e - 30));
    const dmg = 34 + Math.floor(Math.random() * 14);
    const nextHp = Math.max(0, monsterHp - dmg);
    setMonsterHp(nextHp);
    setShakingTarget('monster');
    setMonsterDmgPopup(`-${dmg}!`);
    window.setTimeout(() => setShakingTarget(null), 350);
    setBattleLog(`Used SPECIAL SKILL for ${dmg} massive pink damage!`);
    executeMonsterTurn(nextHp, false);
  };

  const handleDefend = () => {
    if (busyTurn || outcome !== 'playing') return;
    setBusyTurn(true);
    chiptune.playSfx('select');
    setPlayerEnergy((e) => Math.min(100, e + 24));
    setBattleLog('Raised a pink crystal shield & restored +24 ENERGY!');
    executeMonsterTurn(monsterHp, true);
  };

  const handleHeal = () => {
    if (busyTurn || outcome !== 'playing' || playerEnergy < 25) return;
    setBusyTurn(true);
    chiptune.playSfx('flip');
    const healAmt = 36;
    setPlayerEnergy((e) => Math.max(0, e - 25));
    setPlayerHp((hp) => Math.min(100, hp + healAmt));
    setPlayerDmgPopup(`+${healAmt} HP`);
    setBattleLog(`Restored +${healAmt} HP with cozy strawberry pixel tea!`);
    executeMonsterTurn(monsterHp, false);
  };

  const rewardCard = COLLECTIBLE_CARDS.find((c) => c.id === monster.cardRewardId);

  return (
    <div className="min-h-screen w-full pixel-checker-pink py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="pixel-box p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-pixel-ui text-xs font-bold text-[#C94F86]">
              PINK RPG ARENA · {defeatedMonsters.length}/5 MONSTERS DEFEATED
            </p>
            <h1 className="mt-1 font-pixel-title text-base sm:text-xl text-[#392337]">
              MONSTER BATTLE!
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('nav');
              onBackToWorld();
            }}
            className="pixel-btn bg-[#FFDCC8] px-4 py-2.5 font-pixel-ui text-xs font-bold text-[#392337] whitespace-nowrap shrink-0"
          >
            &lt; BACK TO WORLD
          </button>
        </div>

        {/* Monster Roster Tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {MONSTERS.map((m, idx) => {
            const defeated = defeatedMonsters.includes(m.id);
            const isSelected = idx === monsterIdx;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  chiptune.playSfx('click');
                  startFight(idx);
                }}
                className={`pixel-btn px-3 py-2 font-pixel-ui text-[11px] font-bold whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#EC6FA9] text-[#FFFFFF]'
                    : defeated
                      ? 'bg-[#D9C7FF] text-[#392337]'
                      : 'bg-[#FFF5EE] text-[#392337]'
                }`}
              >
                {m.number}. {m.name} {defeated ? '✓' : ''}
              </button>
            );
          })}
        </div>

        {/* Enchanted Pink & Purple Forest Battlefield */}
        <div className="mt-5 border-4 border-[#392337] shadow-[6px_6px_0px_#392337] bg-gradient-to-b from-[#392337] via-[#7A3560] to-[#C94F86] p-4 sm:p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute top-4 left-10 animate-star-twinkle">
            <PixelStar className="w-4 h-4" color="#FFDCC8" />
          </div>
          <div className="pointer-events-none absolute top-6 right-14 animate-star-twinkle">
            <PixelStar className="w-5 h-5" color="#D9C7FF" />
          </div>

          {/* Arena Fighters Row */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-4 pb-6 border-b-4 border-[#392337]">
            {/* Player Left */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[260px] pixel-box p-3 mb-4">
                <div className="flex justify-between font-pixel-ui text-xs font-bold text-[#392337]">
                  <span>HERO (YOU)</span>
                  <span className="tabular-nums">HP {playerHp}/100</span>
                </div>
                <div className="w-full h-3.5 bg-[#392337] mt-1 p-0.5">
                  <div
                    className="h-full bg-[#EC6FA9] transition-all duration-300"
                    style={{ width: `${playerHp}%` }}
                  />
                </div>
                <div className="flex justify-between font-pixel-ui text-[10px] font-bold text-[#C94F86] mt-2">
                  <span>ENERGY</span>
                  <span className="tabular-nums">{playerEnergy}/100</span>
                </div>
                <div className="w-full h-2.5 bg-[#392337] mt-1 p-0.5">
                  <div
                    className="h-full bg-[#D9C7FF] transition-all duration-300"
                    style={{ width: `${playerEnergy}%` }}
                  />
                </div>
              </div>

              <div className="relative">
                {playerDmgPopup && (
                  <span
                    key={playerDmgPopup + playerHp}
                    className="animate-damage-float absolute -top-6 left-1/2 -translate-x-1/2 font-pixel-title text-sm text-[#FFDCC8] drop-shadow-[2px_2px_0px_#392337]"
                  >
                    {playerDmgPopup}
                  </span>
                )}
                <div className={shakingTarget === 'player' ? 'animate-battle-shake' : 'animate-pixel-bob'}>
                  <CharacterSprite id={selectedCharacter} className="w-28 h-28 sm:w-32 sm:h-32" />
                </div>
              </div>
            </div>

            {/* Monster Right */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[260px] pixel-panel-pink p-3 mb-4">
                <div className="flex justify-between font-pixel-ui text-xs font-bold text-[#392337]">
                  <span className="truncate">{monster.name}</span>
                  <span className="tabular-nums">
                    HP {monsterHp}/{monster.maxHp}
                  </span>
                </div>
                <div className="w-full h-3.5 bg-[#392337] mt-1 p-0.5">
                  <div
                    className="h-full bg-[#C94F86] transition-all duration-300"
                    style={{ width: `${Math.round((monsterHp / monster.maxHp) * 100)}%` }}
                  />
                </div>
                <p className="mt-1.5 font-pixel-ui text-[10px] font-bold text-[#392337]">
                  ATK {monster.attack} · DEF {monster.defense} · {monster.title}
                </p>
              </div>

              <div className="relative">
                {monsterDmgPopup && (
                  <span
                    key={monsterDmgPopup + monsterHp}
                    className="animate-damage-float absolute -top-6 left-1/2 -translate-x-1/2 font-pixel-title text-sm text-[#FFFFFF] drop-shadow-[2px_2px_0px_#C94F86]"
                  >
                    {monsterDmgPopup}
                  </span>
                )}
                <div className={shakingTarget === 'monster' ? 'animate-battle-shake' : 'animate-pixel-bob'}>
                  <MonsterSprite id={monster.id} className="w-28 h-28 sm:w-32 sm:h-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Retro Dialogue Log + Battle Commands */}
          <div className="relative z-10 mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            <div className="md:col-span-7 pixel-box p-4 flex items-center">
              <p className="font-pixel-dialog text-2xl text-[#392337] leading-snug">
                &gt; {battleLog}
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={busyTurn || outcome !== 'playing'}
                onClick={handleAttack}
                className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] py-3 px-2 font-pixel-ui text-xs font-bold"
              >
                ATTACK
              </button>
              <button
                type="button"
                disabled={busyTurn || outcome !== 'playing' || playerEnergy < 30}
                onClick={handleSpecialSkill}
                className="pixel-btn bg-[#D9C7FF] text-[#392337] py-3 px-2 font-pixel-ui text-xs font-bold disabled:opacity-50"
              >
                SPECIAL (-30E)
              </button>
              <button
                type="button"
                disabled={busyTurn || outcome !== 'playing'}
                onClick={handleDefend}
                className="pixel-btn bg-[#FFDCC8] text-[#392337] py-3 px-2 font-pixel-ui text-xs font-bold"
              >
                DEFEND
              </button>
              <button
                type="button"
                disabled={busyTurn || outcome !== 'playing' || playerEnergy < 25}
                onClick={handleHeal}
                className="pixel-btn bg-[#FFF5EE] text-[#392337] py-3 px-2 font-pixel-ui text-xs font-bold disabled:opacity-50"
              >
                HEAL (-25E)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Victory / Defeat Overlay */}
      {outcome !== 'playing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#241423]/85 p-4">
          <div className="pixel-box max-w-md w-full p-6 text-center text-[#392337]">
            <div className="flex justify-center gap-2 mb-2">
              <PixelHeart className="w-6 h-6" />
              <PixelStar className="w-6 h-6" color="#EC6FA9" />
              <PixelHeart className="w-6 h-6" />
            </div>

            {outcome === 'victory' ? (
              <>
                <h2 className="font-pixel-title text-base sm:text-lg text-[#C94F86]">
                  MONSTER DEFEATED!
                </h2>
                <p className="mt-3 font-pixel-dialog text-2xl">
                  You defeated {monster.name}!
                </p>
                <div className="mt-3 bg-[#FFD6E7] border-3 border-[#392337] p-3 space-y-1 font-pixel-ui text-xs font-bold">
                  <p>+{monster.xpReward} XP</p>
                  <p>+{monster.apReward} ADVENTURE POINTS</p>
                  {rewardCard && <p>CARD UNLOCKED: {rewardCard.name}!</p>}
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {monsterIdx < MONSTERS.length - 1 && (
                    <button
                      type="button"
                      onClick={() => startFight(monsterIdx + 1)}
                      className="pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-4 py-2.5 font-pixel-ui text-xs font-bold"
                    >
                      NEXT MONSTER &gt;
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startFight(monsterIdx)}
                    className="pixel-btn bg-[#FFDCC8] px-4 py-2.5 font-pixel-ui text-xs font-bold"
                  >
                    REMATCH
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-pixel-title text-base text-[#392337]">
                  NEED A COZY BREAK!
                </h2>
                <p className="mt-3 font-pixel-dialog text-2xl">
                  Your HP reached 0. Restore &amp; try again!
                </p>
                <button
                  type="button"
                  onClick={() => startFight(monsterIdx)}
                  className="mt-5 pixel-btn bg-[#EC6FA9] text-[#FFFFFF] px-6 py-2.5 font-pixel-ui text-xs font-bold"
                >
                  TRY AGAIN
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
