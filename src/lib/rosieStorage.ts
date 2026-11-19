import type { RosieProgressState } from '../types/rosie';
import { ACHIEVEMENTS } from './rosieData';

const STORAGE_KEY = 'rosie_exe_save_v1';

export const DEFAULT_PROGRESS: RosieProgressState = {
  selectedCharacter: 'rosie',
  xp: 20,
  adventurePoints: 50,
  collectedStars: 1,
  discoveredCards: ['card-001'],
  openedNotes: [],
  defeatedMonsters: [],
  completedMiniGames: [],
  worldObjectsVisited: [],
  chestOpened: false,
  secretRoomUnlocked: false,
  adventureCompleted: false,
  unlockedAchievements: ['first-step'],
  sound: {
    musicEnabled: true,
    sfxEnabled: true,
    volume: 0.55,
  },
  ticTacToeScore: {
    p1: 0,
    p2: 0,
    ties: 0,
  },
};

export function loadProgress(): RosieProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<RosieProgressState>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      sound: {
        ...DEFAULT_PROGRESS.sound,
        ...(parsed.sound || {}),
      },
      ticTacToeScore: {
        ...DEFAULT_PROGRESS.ticTacToeScore,
        ...(parsed.ticTacToeScore || {}),
      },
      discoveredCards: Array.isArray(parsed.discoveredCards) && parsed.discoveredCards.length > 0
        ? parsed.discoveredCards
        : DEFAULT_PROGRESS.discoveredCards,
      openedNotes: Array.isArray(parsed.openedNotes) ? parsed.openedNotes : [],
      defeatedMonsters: Array.isArray(parsed.defeatedMonsters) ? parsed.defeatedMonsters : [],
      completedMiniGames: Array.isArray(parsed.completedMiniGames) ? parsed.completedMiniGames : [],
      worldObjectsVisited: Array.isArray(parsed.worldObjectsVisited) ? parsed.worldObjectsVisited : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) && parsed.unlockedAchievements.length > 0
        ? parsed.unlockedAchievements
        : DEFAULT_PROGRESS.unlockedAchievements,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(state: RosieProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function resetProgress(): RosieProgressState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_PROGRESS;
}

export function computePlayerLevel(xp: number): {
  level: number;
  xpInLevel: number;
  xpForNext: number;
  pct: number;
} {
  const xpForNext = 100;
  const level = 1 + Math.floor(xp / xpForNext);
  const xpInLevel = xp % xpForNext;
  return {
    level,
    xpInLevel,
    xpForNext,
    pct: Math.min(100, Math.round((xpInLevel / xpForNext) * 100)),
  };
}

export function canUnlockSecretRoom(state: RosieProgressState): boolean {
  return (
    state.completedMiniGames.length >= 2 &&
    state.defeatedMonsters.length >= 2 &&
    state.discoveredCards.length >= 3
  );
}

/**
 * Evaluates achievement thresholds & returns updated state + any newly unlocked titles.
 */
export function evaluateAchievements(state: RosieProgressState): {
  nextState: RosieProgressState;
  newlyUnlocked: string[];
} {
  const unlocked = new Set(state.unlockedAchievements);
  const newlyUnlocked: string[] = [];
  let bonusAp = 0;

  const check = (id: string, condition: boolean) => {
    if (condition && !unlocked.has(id)) {
      unlocked.add(id);
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (def) {
        newlyUnlocked.push(def.title);
        bonusAp += def.apBonus;
      }
    }
  };

  check('first-step', true);
  check('card-collector', state.discoveredCards.length >= 3);
  check('monster-hunter', state.defeatedMonsters.length >= 3);
  check('arcade-master', state.completedMiniGames.length >= 2);
  check('treasure-seeker', state.secretRoomUnlocked || canUnlockSecretRoom(state));
  check('legendary-explorer', state.adventureCompleted);

  if (newlyUnlocked.length === 0) {
    return { nextState: state, newlyUnlocked: [] };
  }

  return {
    nextState: {
      ...state,
      unlockedAchievements: Array.from(unlocked),
      adventurePoints: state.adventurePoints + bonusAp,
    },
    newlyUnlocked,
  };
}
