export type GameMode = 'chill' | 'standard' | 'hardcore';

export interface Target {
  id: string;
  name: string;
  codename: string;
  category: 'local' | 'commercial' | 'financial' | 'government' | 'deep_space' | 'quantum';
  firewall: number;
  vaultSizeGB: number;
  basePayout: number;
  description: string;
  securityType: string;
  icon: string;
  heatGenerated: number;
  traceSpeedMultiplier: number;
  requiredHackerLevel: number;
  ip: string;
  lore: string;
}

export interface UpgradeItem {
  id: string;
  name: string;
  category: 'cpu' | 'vpn' | 'ram' | 'botnet' | 'exploit';
  tier: number;
  maxTier: number;
  cost: number;
  costMultiplier: number;
  description: string;
  effect: string;
  traceSpeedReduction?: number; // e.g. 0.15 = 15% slower trace
  decryptSpeedBoost?: number; // e.g. 1.5 = 50% faster decrypt
  bypassBonus?: number; // extra grace / hints
  heatReductionBonus?: number;
  autoBypassChance?: number;
}

export type PuzzleType = 'firewall_sync' | 'vault_decrypt' | 'trace_deflect' | 'port_overflow';

export interface HeistState {
  target: Target;
  stage: number; // 1, 2, 3
  totalStages: number;
  tracePercent: number; // 0 - 100
  traceSpeed: number; // base per second
  elapsedSeconds: number;
  maxTimeSeconds: number;
  isPaused: boolean;
  status: 'planning' | 'active' | 'success' | 'failed' | 'escaped';
  currentPuzzle: PuzzleType;
  puzzleData: any;
  lootStolenGB: number;
  logs: Array<{ text: string; type: 'info' | 'warn' | 'error' | 'success' | 'system'; timestamp: string }>;
  bypassAttemptsLeft: number;
}

export interface PlayerStats {
  credits: number;
  cryptoBTC: number;
  stolenDataGB: number;
  successfulHeists: number;
  failedHeists: number;
  heatLevel: number; // 0 to 100
  hackerRank: string;
  hackerXP: number;
  inventory: Record<string, number>; // upgradeId -> tier
  unlockedTargets: string[];
  gameMode: GameMode;
  reputation: number;
  logsCleaned: number;
  lastBypassTime: number;
}

export interface TerminalLog {
  id: string;
  text: string;
  type: 'cmd' | 'output' | 'success' | 'error' | 'warning' | 'ascii' | 'trace';
  timestamp: string;
}

export interface DarknetBuyer {
  id: string;
  name: string;
  specialty: string;
  multiplier: number;
  risk: 'low' | 'medium' | 'high';
  quote: string;
}
