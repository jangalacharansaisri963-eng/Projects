export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface DifficultyConfig {
  name: Difficulty;
  label: string;
  rows: number;
  cols: number;
  timeLimit: number; // in seconds
  description: string;
}

export interface EmojiDefinition {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
  accentColor: string;
  subEmoji?: string;
  badge?: string;
}

export interface CardItem {
  uid: string;
  emojiId: string;
  emoji: string;
  name: string;
  bgGradient: string;
  accentColor: string;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking: boolean;
}

export type GameScreen = 'MENU' | 'PLAYING' | 'WIN' | 'GAMEOVER';

export interface GameStats {
  moves: number;
  timeLeft: number;
  maxTime: number;
  score: number;
  matchedPairs: number;
  totalPairs: number;
  streak: number;
  maxStreak: number;
  stars: number;
}

export type BestScores = {
  [key in Difficulty]?: {
    bestMoves: number;
    bestTime: number;
    highScore: number;
    stars: number;
  };
};
