export type PlantRarity = 'common' | 'uncommon' | 'rare' | 'mythic' | 'hybrid';

export type PlantStage = 'seed' | 'sprout' | 'growing' | 'blooming' | 'mature' | 'withered';

export type LightLevel = 'low' | 'medium' | 'high';

export type WeatherType = 
  | 'sunny' 
  | 'gentle_rain' 
  | 'overcast' 
  | 'golden_hour' 
  | 'starry_night'
  | 'morning_mist'
  | 'heatwave'
  | 'aurora_borealis';

export type TimeOfDay = 'dawn' | 'noon' | 'afternoon' | 'sunset' | 'twilight' | 'midnight';

export type EnvironmentId = 
  | 'sunlit_terrace' 
  | 'cozy_greenhouse' 
  | 'moonlit_sanctuary' 
  | 'indoor_sunroom'
  | 'alpine_meadow'
  | 'crystal_grotto';

export type ToolType = 
  | 'inspect'
  | 'watering_can'
  | 'spritzer'
  | 'trowel'
  | 'pruner'
  | 'fertilizer'
  | 'bell'
  | 'revive_potion'
  | 'pollinator';

export interface PlantSpecies {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  rarity: PlantRarity;
  growthDurationSec: number; // base time in seconds from seed to mature
  waterConsumptionRate: number; // % moisture drop per minute
  preferredLight: LightLevel;
  minOptimalMoisture: number; // e.g. 35%
  maxOptimalMoisture: number; // e.g. 85%
  seedCostCoins: number;
  sellPriceCoins: number;
  gemReward: number;
  illustrationType: 
    | 'sunflower'
    | 'lavender'
    | 'monstera'
    | 'succulent'
    | 'sakura_bonsai'
    | 'moon_orchid'
    | 'star_jasmine'
    | 'strawberry'
    | 'golden_pothos'
    | 'dragon_lily'
    | 'chamomile'
    | 'glowing_nightshade'
    | 'solar_lavender'
    | 'cosmic_monstera'
    | 'sakura_jasmine'
    | 'inferno_nightshade'
    | 'ruby_pearl_succulent'
    | 'phoenix_bonsai';
  seedPouchColor: string;
  accentColor: string;
  loreSnippet: string;
  unlockedByDefault?: boolean;
  isHybrid?: boolean;
  parentSpeciesIds?: [string, string];
  mutationTrait?: string;
}

export interface PlantInstance {
  id: string;
  speciesId: string;
  slotIndex: number;
  environmentId: EnvironmentId;
  plantedTimestamp: number;
  lastWateredTimestamp: number;
  lastTendedTimestamp: number;
  stage: PlantStage;
  growthProgress: number; // 0.0 to 1.0
  moistureLevel: number; // 0 to 100%
  health: number; // 0 to 100%
  fertilizerLevel: number; // 0 to 100%
  happiness: number; // 0 to 100%
  potId: string;
  nickname?: string;
  weedsCount: number;
  isOverwatered: boolean;
  isUnderwatered: boolean;
  totalTimesWatered: number;
  totalTimesPruned: number;
  harvestCount: number;
  isPrismaticMutation?: boolean;
  mutationBonusMult?: number;
}

export interface HybridRecipe {
  parentA: string;
  parentB: string;
  resultSpeciesId: string;
  successRate: number; // 0.0 to 1.0
  mutationChance: number;
  description: string;
  hint?: string;
  rarity?: PlantRarity;
}

export interface PotItem {
  id: string;
  name: string;
  description: string;
  style: 'terracotta' | 'pastel_glaze' | 'mossy_stone' | 'wooden_cask' | 'celestial_star' | 'porcelain_wave' | 'golden_filigree' | 'hanging_macrame';
  baseColor: string;
  patternColor: string;
  priceCoins: number;
  priceGems: number;
  unlocked: boolean;
  moistureRetentionBonus: number; // e.g. 0.15 = 15% slower drying
  growthBonus: number; // e.g. 0.10 = 10% faster growth
}

export interface ToolItem {
  id: ToolType;
  name: string;
  level: number;
  description: string;
  priceCoins: number;
  priceGems: number;
  unlocked: boolean;
  efficiencyMultiplier: number;
  capacityWater?: number;
}

export interface GardenEnvironment {
  id: EnvironmentId;
  name: string;
  tagline: string;
  description: string;
  slotsCount: number;
  ambientLight: LightLevel;
  humidityRetention: number; // multiplier on evaporation
  baseTempC: number;
  bgThemeClass: string;
  soundscapePreset: 'cozy_chords' | 'rain_kalimba' | 'wind_chimes' | 'zen_bowl';
  unlocked: boolean;
  priceCoins: number;
  priceGems: number;
  mutationAffinityBonus?: number;
  weedResistance?: number;
}

export interface DecorationItem {
  id: string;
  name: string;
  category: 'statue' | 'lighting' | 'water_feature' | 'furniture' | 'companion' | 'nature' | 'decor';
  icon: string;
  priceCoins: number;
  priceGems: number;
  unlocked: boolean;
  description: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  actionType: 'water' | 'harvest' | 'plant' | 'fertilize' | 'prune' | 'listen_music' | 'buy_pot' | 'cross_breed';
  targetCount: number;
  currentCount: number;
  rewardCoins: number;
  rewardGems: number;
  completed: boolean;
  claimed: boolean;
}

export interface AchievementTier {
  threshold: number;
  title: string;
  tierName?: string;
  description?: string;
  rewardGems: number;
  rewardCoins: number;
  rewardSeedId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'cultivation' | 'breeding' | 'sanctuary' | 'mastery';
  icon: string;
  tiers: AchievementTier[];
  currentTier: number; // 0, 1, 2, 3...
  progress: number;
  isMaxed: boolean;
}

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // "YYYY-MM-DD"
  claimedToday: boolean;
  streakRewardsHistory: number[];
  lastClaimTimestamp?: number;
}

export interface StreakRewardTier {
  day: number;
  title: string;
  coins: number;
  gems: number;
  seedSpeciesId?: string;
  waterBonus?: number;
  mistBonus?: number;
  bladesBonus?: number;
  fertilizerBonus?: number;
  potionBonus?: number;
  description: string;
}

export interface GearSupplyItem {
  id: string;
  name: string;
  category: 'water' | 'mist' | 'pruner' | 'chime' | 'pollen' | 'fertilizer' | 'potion' | 'bundle';
  description: string;
  icon: string;
  priceCoins: number;
  priceGems: number;
  givesAmount: number;
  targetGear: 'waterSupply' | 'mistCharges' | 'prunerBlades' | 'chimeResonances' | 'pollenDust' | 'fertilizerBags' | 'revivePotions' | 'bundle';
}

export interface PlayerInventory {
  coins: number;
  gems: number;
  seeds: Record<string, number>; // speciesId -> count
  unlockedPots: string[];
  unlockedTools: Record<ToolType, number>; // tool -> level
  unlockedEnvironments: EnvironmentId[];
  environmentSlotCapacities: Record<EnvironmentId, number>; // slots per environment
  unlockedDecorations: string[];
  placedDecorations: Record<EnvironmentId, string[]>;
  // Consumable Gear Charges & Supplies (Non-infinite)
  waterSupply: number;
  maxWaterCapacity: number;
  mistCharges: number;
  prunerBlades: number;
  chimeResonances: number;
  pollenDust: number;
  fertilizerBags: number;
  revivePotions: number;
  // Daily Streak
  dailyStreak: DailyStreakData;
  discoveredSpecies: string[];
  discoveredHybrids: string[];
}

export interface GameStats {
  totalHarvests: number;
  totalSeedsPlanted: number;
  totalWaterPoured: number;
  totalWeedsCleaned: number;
  totalCrossBreeds: number;
  totalCoinsEarned: number;
  totalGemsEarned: number;
  daysActive: number;
  musicListenedSec: number;
  firstPlayDate: number;
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'water' | 'sparkle' | 'heart' | 'leaf' | 'coin' | 'pollen' | 'mutation';
  text?: string;
}
