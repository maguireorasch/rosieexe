export type GameScreen =
  | 'boot'
  | 'opening'
  | 'char-select'
  | 'world'
  | 'cards'
  | 'mailbox'
  | 'battle'
  | 'arcade'
  | 'secret'
  | 'final';

export type CharacterId =
  | 'rosie'
  | 'pixel-cat'
  | 'mystery-girl'
  | 'little-ghost'
  | 'star-girl';

export type MonsterId =
  | 'slime-king'
  | 'shadow-bat'
  | 'chaos-ghost'
  | 'mushroom-monster'
  | 'dark-forest-guardian';

export type CardRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'SECRET';

export type CardSceneTheme =
  | 'cherry-garden'
  | 'pink-sunset'
  | 'lavender-forest'
  | 'pink-castle'
  | 'starry-night'
  | 'flower-field'
  | 'candy-world'
  | 'secret-treasure';

export interface CharacterProfile {
  id: CharacterId;
  code: string;
  name: string;
  title: string;
  description: string;
  hp: number;
  speed: number;
  luck: number;
  attack: number;
  specialSkill: string;
  accentColor: string;
}

export interface CollectibleCard {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  type: string;
  hp: string;
  rarity: CardRarity;
  abilityName: string;
  abilityDesc: string;
  specialMoveName: string;
  specialMoveDamage: string;
  weakness: string;
  resistance: string;
  retreatCost: number;
  flavorText: string;
  bio: string;
  hiddenMessage: string;
  sceneTheme: CardSceneTheme;
  spriteKind: CharacterId | 'cherry-blossom' | 'chaos-creature' | 'lucky-star' | 'secret-adventure';
}

export interface MailboxNote {
  id: string;
  number: string;
  label: string;
  greeting: string;
  message: string;
  badgeIcon: 'star' | 'heart' | 'flower' | 'moon' | 'spark' | 'gift';
}

export interface MonsterProfile {
  id: MonsterId;
  number: string;
  name: string;
  title: string;
  maxHp: number;
  attack: number;
  defense: number;
  specialAbility: string;
  xpReward: number;
  apReward: number;
  cardRewardId: string;
}

export interface AchievementDef {
  id:
    | 'first-step'
    | 'card-collector'
    | 'monster-hunter'
    | 'arcade-master'
    | 'treasure-seeker'
    | 'legendary-explorer';
  title: string;
  description: string;
  apBonus: number;
}

export interface SoundSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  volume: number;
}

export interface RosieProgressState {
  selectedCharacter: CharacterId;
  xp: number;
  adventurePoints: number;
  collectedStars: number;
  discoveredCards: string[];
  openedNotes: string[];
  defeatedMonsters: MonsterId[];
  completedMiniGames: string[];
  worldObjectsVisited: string[];
  chestOpened: boolean;
  secretRoomUnlocked: boolean;
  adventureCompleted: boolean;
  unlockedAchievements: string[];
  sound: SoundSettings;
  ticTacToeScore: {
    p1: number;
    p2: number;
    ties: number;
  };
}
