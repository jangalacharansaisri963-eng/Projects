/**
 * Offline-First High Score Persistence, User Stats & Custom Levels Storage
 */

import { HighScoreRecord, ArcadeGameMode, SpriteFrame } from './types';
import { AchievementManager } from './achievements';

const HIGH_SCORES_KEY = 'retro_arcade_high_scores_v1';
const STATS_KEY = 'retro_arcade_user_stats_v1';
const CUSTOM_SPRITES_KEY = 'retro_arcade_custom_sprites_v1';

export interface UserStats {
  gamesPlayed: number;
  totalScore: number;
  enemiesDefeated: number;
  bricksDestroyed: number;
  coinsCollected: number;
  highestCombo: number;
}

const DEFAULT_SCORES: HighScoreRecord[] = [
  { id: '1', gameMode: 'shmup', name: 'NEO', score: 25400, date: '2026-08-15', extraStats: 'Wave 8 • Boss Slayer' },
  { id: '2', gameMode: 'shmup', name: 'ACE', score: 18900, date: '2026-08-18', extraStats: 'Wave 6' },
  { id: '3', gameMode: 'shmup', name: 'CYB', score: 12500, date: '2026-08-20', extraStats: 'Wave 4' },
  { id: '4', gameMode: 'shmup', name: 'FOX', score: 8200, date: '2026-08-22', extraStats: 'Wave 3' },

  { id: '5', gameMode: 'brick_breaker', name: 'BRK', score: 32800, date: '2026-08-16', extraStats: 'Level 5 • 8x Multi' },
  { id: '6', gameMode: 'brick_breaker', name: 'VIP', score: 24600, date: '2026-08-19', extraStats: 'Level 4' },
  { id: '7', gameMode: 'brick_breaker', name: 'MAX', score: 15400, date: '2026-08-21', extraStats: 'Level 3' },

  { id: '8', gameMode: 'platformer', name: 'KNT', score: 41200, date: '2026-08-17', extraStats: 'Stage 3 • 45 Gems' },
  { id: '9', gameMode: 'platformer', name: 'SPD', score: 29800, date: '2026-08-19', extraStats: 'Stage 2' },
  { id: '10', gameMode: 'platformer', name: 'JMP', score: 18500, date: '2026-08-23', extraStats: 'Stage 1' },

  { id: '11', gameMode: 'tank_arena', name: 'ARM', score: 19500, date: '2026-08-18', extraStats: '14 Tanks • Arena 5' },
  { id: '12', gameMode: 'tank_arena', name: 'BLZ', score: 14200, date: '2026-08-20', extraStats: '9 Tanks • Arena 3' },
  { id: '13', gameMode: 'tank_arena', name: 'REX', score: 9800, date: '2026-08-24', extraStats: '6 Tanks' },
];

export class StorageManager {
  static getHighScores(gameMode?: ArcadeGameMode): HighScoreRecord[] {
    try {
      const data = localStorage.getItem(HIGH_SCORES_KEY);
      let list: HighScoreRecord[] = data ? JSON.parse(data) : DEFAULT_SCORES;
      if (gameMode) {
        list = list.filter((r) => r.gameMode === gameMode);
      }
      return list.sort((a, b) => b.score - a.score);
    } catch (e) {
      return DEFAULT_SCORES.filter((r) => !gameMode || r.gameMode === gameMode);
    }
  }

  static isHighScore(gameMode: ArcadeGameMode, score: number): boolean {
    if (score <= 0) return false;
    const scores = this.getHighScores(gameMode);
    if (scores.length < 10) return true;
    return score > scores[scores.length - 1].score;
  }

  static saveHighScore(gameMode: ArcadeGameMode, name: string, score: number, extraStats?: string): HighScoreRecord[] {
    try {
      const existing = this.getHighScores();
      const newRecord: HighScoreRecord = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        gameMode,
        name: (name || 'AAA').toUpperCase().substring(0, 3),
        score,
        date: new Date().toISOString().split('T')[0],
        extraStats,
      };

      existing.push(newRecord);
      // Keep top 15 per gameMode
      const grouped: Record<string, HighScoreRecord[]> = {};
      for (const r of existing) {
        if (!grouped[r.gameMode]) grouped[r.gameMode] = [];
        grouped[r.gameMode].push(r);
      }

      let finalList: HighScoreRecord[] = [];
      for (const mode in grouped) {
        grouped[mode].sort((a, b) => b.score - a.score);
        finalList = finalList.concat(grouped[mode].slice(0, 12));
      }

      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(finalList));
      AchievementManager.unlock('hall_of_fame');
      return finalList.filter((r) => r.gameMode === gameMode).sort((a, b) => b.score - a.score);
    } catch (e) {
      console.warn('Could not save high score to LocalStorage', e);
      return [];
    }
  }

  static getStats(): UserStats {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      gamesPlayed: 0,
      totalScore: 0,
      enemiesDefeated: 0,
      bricksDestroyed: 0,
      coinsCollected: 0,
      highestCombo: 0,
    };
  }

  static updateStats(partial: Partial<UserStats>) {
    try {
      const current = this.getStats();
      const updated: UserStats = {
        gamesPlayed: current.gamesPlayed + (partial.gamesPlayed || 0),
        totalScore: current.totalScore + (partial.totalScore || 0),
        enemiesDefeated: current.enemiesDefeated + (partial.enemiesDefeated || 0),
        bricksDestroyed: current.bricksDestroyed + (partial.bricksDestroyed || 0),
        coinsCollected: current.coinsCollected + (partial.coinsCollected || 0),
        highestCombo: Math.max(current.highestCombo, partial.highestCombo || 0),
      };
      localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  static getCustomSprites(): Record<string, SpriteFrame> {
    try {
      const raw = localStorage.getItem(CUSTOM_SPRITES_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  static saveCustomSprite(id: string, sprite: SpriteFrame) {
    try {
      const sprites = this.getCustomSprites();
      sprites[id] = sprite;
      localStorage.setItem(CUSTOM_SPRITES_KEY, JSON.stringify(sprites));
    } catch (e) {}
  }
}
