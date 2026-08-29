/**
 * Retro Arcade Engine - Achievements & Trophy System
 * Offline-first persistent badges, XP levels, and unlock triggers
 */

import { soundEngine } from './audio';
import { StorageManager } from './storage';

export type TrophyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'secret';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: TrophyTier;
  xp: number;
  icon: string; // Lucide icon or emoji tag
  category: 'shmup' | 'brick_breaker' | 'platformer' | 'tank_arena' | 'sandbox' | 'general';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

const ACHIEVEMENTS_STORAGE_KEY = 'retro_arcade_achievements_v1';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'First Flight',
    description: 'Launch and play your first mission in Space Shmup',
    tier: 'bronze',
    xp: 50,
    icon: 'Rocket',
    category: 'shmup',
    unlocked: false,
  },
  {
    id: 'cosmic_ace',
    title: 'Cosmic Ace',
    description: 'Score over 10,000 points in Space Shmup',
    tier: 'silver',
    xp: 150,
    icon: 'Sparkles',
    category: 'shmup',
    unlocked: false,
  },
  {
    id: 'boss_slayer',
    title: 'Mothership Buster',
    description: 'Defeat the colossal alien boss in Wave 5 of Space Shmup',
    tier: 'gold',
    xp: 300,
    icon: 'Crown',
    category: 'shmup',
    unlocked: false,
  },
  {
    id: 'brick_breaker_novice',
    title: 'Paddle Master',
    description: 'Break 30 bricks in Brick Breaker',
    tier: 'bronze',
    xp: 50,
    icon: 'Layers',
    category: 'brick_breaker',
    unlocked: false,
  },
  {
    id: 'laser_paddle',
    title: 'Armed & Dangerous',
    description: 'Collect and fire the Laser Blaster powerup in Brick Breaker',
    tier: 'silver',
    xp: 150,
    icon: 'Zap',
    category: 'brick_breaker',
    unlocked: false,
  },
  {
    id: 'dungeon_crawler',
    title: 'Knight Quest',
    description: 'Reach Stage 2 in Dungeon Platformer',
    tier: 'bronze',
    xp: 75,
    icon: 'Shield',
    category: 'platformer',
    unlocked: false,
  },
  {
    id: 'gem_collector',
    title: 'Treasure Hunter',
    description: 'Collect 15 gems in a single Platformer run',
    tier: 'silver',
    xp: 150,
    icon: 'Gem',
    category: 'platformer',
    unlocked: false,
  },
  {
    id: 'tank_destroyer',
    title: 'Armored Dominator',
    description: 'Destroy 8 enemy tanks in Tank Arena',
    tier: 'silver',
    xp: 175,
    icon: 'Target',
    category: 'tank_arena',
    unlocked: false,
  },
  {
    id: 'mine_trapper',
    title: 'Demolitions Expert',
    description: 'Eliminate an enemy tank with a proximity mine',
    tier: 'bronze',
    xp: 100,
    icon: 'Bomb',
    category: 'tank_arena',
    unlocked: false,
  },
  {
    id: 'combo_king',
    title: 'Hyper Combo 10x',
    description: 'Achieve a 10x multiplier combo in any arcade game',
    tier: 'gold',
    xp: 250,
    icon: 'Flame',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'pixel_artist',
    title: 'Pixel Artisan',
    description: 'Create and save a custom 16x16 sprite in the Sprite Studio',
    tier: 'silver',
    xp: 125,
    icon: 'Palette',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'paparazzi',
    title: 'Retro Photographer',
    description: 'Capture and export a high-res screenshot snapshot',
    tier: 'bronze',
    xp: 75,
    icon: 'Camera',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'hall_of_fame',
    title: 'Legendary Record',
    description: 'Secure a spot on the Hall of Fame high score board',
    tier: 'silver',
    xp: 200,
    icon: 'Trophy',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'sandbox_architect',
    title: 'Physics Overlord',
    description: 'Spawn 20+ dynamic physics bodies in the Sandbox Lab',
    tier: 'bronze',
    xp: 100,
    icon: 'Boxes',
    category: 'sandbox',
    unlocked: false,
  },
  {
    id: 'moon_walker',
    title: 'Quantum Modifier',
    description: 'Activate Moon Gravity, Turbo Speed, or a retro palette filter',
    tier: 'bronze',
    xp: 75,
    icon: 'Sliders',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'arcade_god',
    title: 'Arcade Luminary',
    description: 'Unlock 10 achievements to become a certified Arcade God',
    tier: 'platinum',
    xp: 500,
    icon: 'Award',
    category: 'general',
    unlocked: false,
  },
];

export class AchievementManager {
  private static listeners: ((achievement: Achievement) => void)[] = [];

  static subscribe(listener: (achievement: Achievement) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  static getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (!data) return INITIAL_ACHIEVEMENTS;
      const saved: Record<string, { unlocked: boolean; unlockedAt?: string }> = JSON.parse(data);
      return INITIAL_ACHIEVEMENTS.map((a) => ({
        ...a,
        unlocked: saved[a.id]?.unlocked ?? false,
        unlockedAt: saved[a.id]?.unlockedAt,
      }));
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  static unlock(id: string): boolean {
    try {
      const achievements = this.getAchievements();
      const target = achievements.find((a) => a.id === id);
      if (!target || target.unlocked) return false;

      // Mark unlocked
      const savedRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      const saved: Record<string, { unlocked: boolean; unlockedAt?: string }> = savedRaw ? JSON.parse(savedRaw) : {};
      saved[id] = {
        unlocked: true,
        unlockedAt: new Date().toISOString().split('T')[0],
      };
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(saved));

      target.unlocked = true;
      target.unlockedAt = saved[id].unlockedAt;

      // Play fanfare chime
      soundEngine.playFanfare();

      // Notify listeners (Toast banner)
      this.listeners.forEach((listener) => listener(target));

      // Check if unlocked 10 achievements for the 'arcade_god' platinum trophy
      const unlockedCount = achievements.filter((a) => a.unlocked || a.id === id).length;
      if (unlockedCount >= 10 && id !== 'arcade_god') {
        setTimeout(() => {
          this.unlock('arcade_god');
        }, 1500);
      }

      return true;
    } catch (e) {
      console.warn('Could not save achievement', e);
      return false;
    }
  }

  static getTotalXP(): number {
    const list = this.getAchievements();
    return list.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  }

  static getPlayerLevel(): { level: number; currentXP: number; nextLevelXP: number; title: string; progressPercent: number } {
    const xp = this.getTotalXP();
    const xpPerLevel = 250;
    const level = Math.floor(xp / xpPerLevel) + 1;
    const currentXPInLevel = xp % xpPerLevel;
    const progressPercent = Math.min(100, Math.round((currentXPInLevel / xpPerLevel) * 100));

    const titles = [
      'Arcade Rookie',
      'Pixel Explorer',
      'Retro Contender',
      'Combo Striker',
      'High Score Hunter',
      'Veteran Pilot',
      'Chiptune Champion',
      'Arcade Master',
      'Grand Champion',
      'Arcade God',
    ];

    const title = titles[Math.min(titles.length - 1, level - 1)];

    return {
      level,
      currentXP: currentXPInLevel,
      nextLevelXP: xpPerLevel,
      title,
      progressPercent,
    };
  }
}
