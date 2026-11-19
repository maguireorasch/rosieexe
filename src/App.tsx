import React, { useCallback, useEffect, useState } from 'react';
import { chiptune } from './lib/chiptuneAudio';
import {
  canUnlockSecretRoom,
  evaluateAchievements,
  loadProgress,
  resetProgress,
  saveProgress,
} from './lib/rosieStorage';
import type {
  CharacterId,
  GameScreen,
  MonsterProfile,
  RosieProgressState,
  SoundSettings,
} from './types/rosie';
import { BootScreen } from './components/rosie/BootScreen';
import { OpeningScreen } from './components/rosie/OpeningScreen';
import { CharacterSelectScreen } from './components/rosie/CharacterSelectScreen';
import { PixelWorldScreen } from './components/rosie/PixelWorldScreen';
import { PlayerIdModal } from './components/rosie/PlayerIdModal';
import { CardCollectionScreen } from './components/rosie/CardCollectionScreen';
import { MailboxScreen } from './components/rosie/MailboxScreen';
import { MonsterBattleScreen } from './components/rosie/MonsterBattleScreen';
import { ArcadeGamesScreen } from './components/rosie/ArcadeGamesScreen';
import { SecretRoomScreen } from './components/rosie/SecretRoomScreen';
import { FinalSunsetScreen } from './components/rosie/FinalSunsetScreen';
import {
  AchievementsModal,
  HowToPlayModal,
  SettingsModal,
  WorldHud,
} from './components/rosie/ModalsAndHud';
import { PixelStar } from './components/rosie/PixelSprites';

interface ToastBanner {
  id: number;
  title: string;
  subtitle: string;
}

export function App() {
  const [screen, setScreen] = useState<GameScreen>('boot');
  const [progress, setProgress] = useState<RosieProgressState>(() => loadProgress());

  const [idCardOpen, setIdCardOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [toast, setToast] = useState<ToastBanner | null>(null);

  // Sync audio preferences on mount & whenever sound settings update (music still starts only on user gesture)
  useEffect(() => {
    chiptune.applySettings(progress.sound);
  }, [progress.sound]);

  // Persist save state to localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const showToast = useCallback((title: string, subtitle: string) => {
    const id = Date.now() + Math.random();
    setToast({ id, title, subtitle });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3800);
  }, []);

  const commitProgress = useCallback(
    (updater: (prev: RosieProgressState) => RosieProgressState) => {
      setProgress((prev) => {
        const draft = updater(prev);
        const secretReady = draft.secretRoomUnlocked || canUnlockSecretRoom(draft);
        const withSecret =
          secretReady && !draft.secretRoomUnlocked
            ? { ...draft, secretRoomUnlocked: true }
            : draft;
        const { nextState, newlyUnlocked } = evaluateAchievements(withSecret);
        if (newlyUnlocked.length > 0) {
          chiptune.playSfx('unlock');
          showToast(
            `BADGE UNLOCKED: ${newlyUnlocked[0]}!`,
            newlyUnlocked.length > 1
              ? `+${newlyUnlocked.length} new achievements earned!`
              : 'Check Badges in the top HUD!'
          );
        }
        return nextState;
      });
    },
    [showToast]
  );

  const handleSelectCharacter = (charId: CharacterId) => {
    commitProgress((prev) => ({
      ...prev,
      selectedCharacter: charId,
      xp: prev.xp + 10,
    }));
    setScreen('world');
  };

  const handleUnlockCard = (cardId: string, apReward = 60) => {
    commitProgress((prev) => {
      const already = prev.discoveredCards.includes(cardId);
      if (already) return prev;
      return {
        ...prev,
        discoveredCards: [...prev.discoveredCards, cardId],
        adventurePoints: prev.adventurePoints + apReward,
        xp: prev.xp + 30,
      };
    });
  };

  const handleOpenNote = (noteId: string) => {
    commitProgress((prev) => {
      if (prev.openedNotes.includes(noteId)) return prev;
      return {
        ...prev,
        openedNotes: [...prev.openedNotes, noteId],
        adventurePoints: prev.adventurePoints + 15,
        xp: prev.xp + 10,
      };
    });
  };

  const handleMonsterDefeated = (monster: MonsterProfile) => {
    commitProgress((prev) => {
      const firstClear = !prev.defeatedMonsters.includes(monster.id);
      const nextMonsters = firstClear
        ? [...prev.defeatedMonsters, monster.id]
        : prev.defeatedMonsters;
      const nextCards = prev.discoveredCards.includes(monster.cardRewardId)
        ? prev.discoveredCards
        : [...prev.discoveredCards, monster.cardRewardId];
      return {
        ...prev,
        defeatedMonsters: nextMonsters,
        discoveredCards: nextCards,
        xp: prev.xp + monster.xpReward,
        adventurePoints: prev.adventurePoints + monster.apReward,
        collectedStars: prev.collectedStars + (firstClear ? 1 : 0),
      };
    });
  };

  const handleGameCompleted = (gameId: string, apReward: number) => {
    commitProgress((prev) => {
      const firstClear = !prev.completedMiniGames.includes(gameId);
      const nextGames = firstClear
        ? [...prev.completedMiniGames, gameId]
        : prev.completedMiniGames;

      // Grant bonus collectible card card-006 on 2nd mini-game clear if not unlocked yet
      const shouldGrantCard6 = nextGames.length >= 2 && !prev.discoveredCards.includes('card-006');
      const nextCards = shouldGrantCard6
        ? [...prev.discoveredCards, 'card-006']
        : prev.discoveredCards;

      return {
        ...prev,
        completedMiniGames: nextGames,
        discoveredCards: nextCards,
        adventurePoints: prev.adventurePoints + (firstClear ? apReward : 15),
        xp: prev.xp + (firstClear ? 35 : 10),
        collectedStars: prev.collectedStars + (firstClear ? 1 : 0),
      };
    });
  };

  const handleOpenWorldChest = () => {
    commitProgress((prev) => {
      if (prev.chestOpened) return prev;
      const nextCards = prev.discoveredCards.includes('card-007')
        ? prev.discoveredCards
        : [...prev.discoveredCards, 'card-007'];
      return {
        ...prev,
        chestOpened: true,
        discoveredCards: nextCards,
        adventurePoints: prev.adventurePoints + 100,
        collectedStars: prev.collectedStars + 2,
        xp: prev.xp + 50,
      };
    });
    showToast('TREASURE CHEST OPENED!', '+100 AP, +2 Stars & Bonus Card Unlocked!');
  };

  const handleDiscoverObject = (objectId: string, apGain: number, starGain: number) => {
    commitProgress((prev) => {
      const firstVisit = !prev.worldObjectsVisited.includes(objectId);
      if (!firstVisit) {
        return {
          ...prev,
          adventurePoints: prev.adventurePoints + 5,
        };
      }
      return {
        ...prev,
        worldObjectsVisited: [...prev.worldObjectsVisited, objectId],
        adventurePoints: prev.adventurePoints + apGain,
        collectedStars: prev.collectedStars + starGain,
        xp: prev.xp + 20,
      };
    });
  };

  const handleUnlockSecretChest = () => {
    commitProgress((prev) => {
      const nextCards = prev.discoveredCards.includes('card-008')
        ? prev.discoveredCards
        : [...prev.discoveredCards, 'card-008'];
      return {
        ...prev,
        chestOpened: true,
        secretRoomUnlocked: true,
        adventureCompleted: true,
        discoveredCards: nextCards,
        adventurePoints: prev.adventurePoints + (prev.adventureCompleted ? 0 : 150),
        collectedStars: prev.collectedStars + (prev.adventureCompleted ? 0 : 3),
        xp: prev.xp + (prev.adventureCompleted ? 0 : 80),
      };
    });
  };

  const handleUpdateSound = (nextSound: SoundSettings) => {
    setProgress((prev) => ({ ...prev, sound: nextSound }));
  };

  const handleResetSave = () => {
    const fresh = resetProgress();
    setProgress(fresh);
    chiptune.applySettings(fresh.sound);
    chiptune.stopMusic();
    setScreen('opening');
    showToast('SAVE DATA RESET', 'Starting a fresh adventure in ROSIE.EXE!');
  };

  const showHud =
    screen === 'world' ||
    screen === 'cards' ||
    screen === 'mailbox' ||
    screen === 'battle' ||
    screen === 'arcade' ||
    screen === 'secret';

  return (
    <div className="min-h-screen w-full relative">
      {showHud && (
        <WorldHud
          progress={progress}
          currentScreen={screen}
          onNavigate={setScreen}
          onOpenIdCard={() => setIdCardOpen(true)}
          onOpenAchievements={() => setAchievementsOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      {screen === 'boot' && <BootScreen onComplete={() => setScreen('opening')} />}

      {screen === 'opening' && (
        <OpeningScreen
          onStartGame={() => setScreen('char-select')}
          onOpenHowToPlay={() => setHowToPlayOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      {screen === 'char-select' && (
        <CharacterSelectScreen
          selectedCharacter={progress.selectedCharacter}
          onSelectCharacter={handleSelectCharacter}
          onBack={() => setScreen('opening')}
        />
      )}

      {screen === 'world' && (
        <PixelWorldScreen
          selectedCharacter={progress.selectedCharacter}
          chestOpened={progress.chestOpened}
          secretUnlocked={progress.secretRoomUnlocked || canUnlockSecretRoom(progress)}
          onNavigate={setScreen}
          onOpenIdCard={() => setIdCardOpen(true)}
          onOpenChest={handleOpenWorldChest}
          onDiscoverObject={handleDiscoverObject}
        />
      )}

      {screen === 'cards' && (
        <CardCollectionScreen
          discoveredCards={progress.discoveredCards}
          onUnlockCard={handleUnlockCard}
          onBackToWorld={() => setScreen('world')}
        />
      )}

      {screen === 'mailbox' && (
        <MailboxScreen
          openedNotes={progress.openedNotes}
          onOpenNote={handleOpenNote}
          onBackToWorld={() => setScreen('world')}
        />
      )}

      {screen === 'battle' && (
        <MonsterBattleScreen
          selectedCharacter={progress.selectedCharacter}
          defeatedMonsters={progress.defeatedMonsters}
          onMonsterDefeated={handleMonsterDefeated}
          onBackToWorld={() => setScreen('world')}
        />
      )}

      {screen === 'arcade' && (
        <ArcadeGamesScreen
          completedGames={progress.completedMiniGames}
          ticTacToeScore={progress.ticTacToeScore}
          onUpdateTttScore={(nextScore) =>
            setProgress((prev) => ({ ...prev, ticTacToeScore: nextScore }))
          }
          onGameCompleted={handleGameCompleted}
          onBackToWorld={() => setScreen('world')}
        />
      )}

      {screen === 'secret' && (
        <SecretRoomScreen
          progress={progress}
          onUnlockChest={handleUnlockSecretChest}
          onGoToFinal={() => setScreen('final')}
          onBackToWorld={() => setScreen('world')}
        />
      )}

      {screen === 'final' && (
        <FinalSunsetScreen
          selectedCharacter={progress.selectedCharacter}
          onPlayAgain={() => setScreen('opening')}
          onReturnToWorld={() => setScreen('world')}
        />
      )}

      {/* Modals */}
      <PlayerIdModal
        open={idCardOpen}
        selectedCharacter={progress.selectedCharacter}
        onClose={() => setIdCardOpen(false)}
      />

      <AchievementsModal
        open={achievementsOpen}
        progress={progress}
        onClose={() => setAchievementsOpen(false)}
      />

      <SettingsModal
        open={settingsOpen}
        sound={progress.sound}
        onUpdateSound={handleUpdateSound}
        onResetSave={handleResetSave}
        onClose={() => setSettingsOpen(false)}
      />

      <HowToPlayModal open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />

      {/* Retro Toast Banner */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          className="fixed bottom-4 right-4 z-[95] max-w-sm pixel-panel-dark px-4 py-3 flex items-start gap-3"
        >
          <PixelStar className="w-5 h-5 shrink-0 mt-0.5" color="#FFDCC8" />
          <div className="min-w-0 flex-1">
            <p className="font-pixel-title text-[10px] text-[#FFC0D9] leading-snug">
              {toast.title}
            </p>
            <p className="font-pixel-dialog text-lg text-[#FFF5EE] leading-tight mt-0.5">
              {toast.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="font-pixel-ui text-xs text-[#FFDCC8] hover:text-[#FFFFFF] px-1"
            aria-label="Dismiss notification"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
