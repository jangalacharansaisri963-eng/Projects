export type PlayerSymbol = 'X' | 'O';
export type BoardValue = PlayerSymbol | null;

export type GameMode = 'pvp' | 'ai'; // Player vs Player or Player vs AI
export type AIDifficulty = 'easy' | 'medium' | 'hard'; // Hard = Minimax unbeatable

export type BoardSize = 3 | 4 | 5;

export interface Move {
  index: number;
  row: number;
  col: number;
  player: PlayerSymbol;
  timestamp: number;
}

export interface WinningLine {
  combo: number[]; // Indices of winning cells
  direction: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
  lineIndex: number; // Row/col index or diagonal identifier
}

export type ThemeMode = 'dark' | 'light' | 'neon' | 'pastel' | 'chalkboard';

export interface GameStats {
  pvpWinsX: number;
  pvpWinsO: number;
  pvpDraws: number;
  aiPlayerWins: number;
  aiLosses: number;
  aiDraws: number;
  totalGames: number;
  currentStreak: number;
  bestStreak: number;
}

export interface GameSettings {
  mode: GameMode;
  difficulty: AIDifficulty;
  userSymbol: PlayerSymbol; // Symbol chosen by human in AI mode
  boardSize: BoardSize;
  soundEnabled: boolean;
  theme: ThemeMode;
  autoReplaySpeed: number; // ms per move in replay mode
}
