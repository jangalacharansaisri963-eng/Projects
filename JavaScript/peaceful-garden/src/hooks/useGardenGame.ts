import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  PlantInstance,
  PlantSpecies,
  EnvironmentId,
  ToolType,
  PlayerInventory,
  GameStats,
  DailyQuest,
  ParticleEffect,
  WeatherType,
  TimeOfDay,
  Achievement,
  DailyStreakData,
  GearSupplyItem,
} from '../types';
import {
  PLANT_SPECIES,
  POT_ITEMS,
  TOOL_ITEMS,
  GARDEN_ENVIRONMENTS,
  INITIAL_DAILY_QUESTS,
  DECORATION_ITEMS,
  HYBRID_RECIPES,
  LIFETIME_ACHIEVEMENTS,
  STREAK_REWARDS,
  GEAR_SUPPLIES_SHOP,
} from '../data/plantData';
import { audioSynth } from '../utils/audioSynth';

const STORAGE_KEY = 'sprout_serenity_garden_save_v3';

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function useGardenGame() {
  // Active Environment
  const [currentEnvId, setCurrentEnvId] = useState<EnvironmentId>('sunlit_terrace');
  
  // Selected Tool
  const [activeTool, setActiveTool] = useState<ToolType>('watering_can');

  // Selected Plant for detail modal
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  // Selected Parents for Cross-Breeding
  const [selectedBreedParentA, setSelectedBreedParentA] = useState<string | null>(null);
  const [selectedBreedParentB, setSelectedBreedParentB] = useState<string | null>(null);

  // Plants on all environments
  const [plants, setPlants] = useState<PlantInstance[]>([]);

  // Inventory & Economy with Finite Gears & Daily Streaks
  const [inventory, setInventory] = useState<PlayerInventory>({
    coins: 180,
    gems: 10,
    seeds: {
      sunflower_radiance: 4,
      lavender_breeze: 3,
      chamomile_calm: 3,
      monstera_deliciosa: 2,
      succulent_rosette: 2,
      golden_pothos_cascade: 2,
    },
    unlockedPots: ['pot_classic_terracotta'],
    unlockedTools: {
      inspect: 1,
      watering_can: 1,
      spritzer: 1,
      trowel: 1,
      pruner: 1,
      fertilizer: 1,
      pollinator: 1,
      bell: 1,
      revive_potion: 1,
    },
    unlockedEnvironments: ['sunlit_terrace'],
    environmentSlotCapacities: {
      sunlit_terrace: 6,
      cozy_greenhouse: 6,
      moonlit_sanctuary: 6,
      indoor_sunroom: 6,
      alpine_meadow: 6,
      crystal_grotto: 6,
    },
    unlockedDecorations: [],
    placedDecorations: {
      sunlit_terrace: [],
      cozy_greenhouse: [],
      moonlit_sanctuary: [],
      indoor_sunroom: [],
      alpine_meadow: [],
      crystal_grotto: [],
    },
    // Consumable Gear Supplies
    waterSupply: 80,
    maxWaterCapacity: 120,
    mistCharges: 25,
    prunerBlades: 20,
    chimeResonances: 15,
    pollenDust: 12,
    fertilizerBags: 4,
    revivePotions: 2,
    // Daily Streaks
    dailyStreak: {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: getTodayDateString(),
      claimedToday: false,
      streakRewardsHistory: [],
    },
    discoveredSpecies: ['sunflower_radiance', 'lavender_breeze', 'chamomile_calm', 'succulent_rosette', 'monstera_deliciosa', 'golden_pothos_cascade'],
    discoveredHybrids: [],
  });

  // Daily Quests
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(INITIAL_DAILY_QUESTS);

  // Lifetime Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(LIFETIME_ACHIEVEMENTS);

  // Dynamic Weather & Time of Day System
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noon');
  const [activeWeather, setActiveWeather] = useState<WeatherType>('sunny');
  const [isTimeAutoAdvancing, setIsTimeAutoAdvancing] = useState<boolean>(true);

  // Lifetime Stats
  const [stats, setStats] = useState<GameStats>({
    totalHarvests: 0,
    totalSeedsPlanted: 0,
    totalWaterPoured: 0,
    totalWeedsCleaned: 0,
    totalCrossBreeds: 0,
    totalCoinsEarned: 180,
    totalGemsEarned: 10,
    daysActive: 1,
    musicListenedSec: 0,
    firstPlayDate: Date.now(),
  });

  // UI States & Modals
  const [isAlmanacOpen, setIsAlmanacOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [isBreedingLabOpen, setIsBreedingLabOpen] = useState(false);
  const [isTerrainExpanderOpen, setIsTerrainExpanderOpen] = useState(false);
  const [isQuickRefillOpen, setIsQuickRefillOpen] = useState(false);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);

  // Music tracking
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Helper: check and update daily streak on startup
  const checkDailyStreakLogic = (streak: DailyStreakData): DailyStreakData => {
    const today = getTodayDateString();
    if (!streak.lastActiveDate) {
      return {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        claimedToday: false,
        streakRewardsHistory: [],
      };
    }

    if (streak.lastActiveDate === today) {
      // Same day, preserve status
      return streak;
    }

    // Check if yesterday
    const lastDate = new Date(streak.lastActiveDate);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day! Increment streak!
      const nextStreak = streak.currentStreak + 1;
      return {
        ...streak,
        currentStreak: nextStreak,
        longestStreak: Math.max(streak.longestStreak, nextStreak),
        lastActiveDate: today,
        claimedToday: false,
      };
    } else if (diffDays > 1) {
      // Skipped a day -> reset streak to 1
      return {
        ...streak,
        currentStreak: 1,
        lastActiveDate: today,
        claimedToday: false,
      };
    }

    return streak;
  };

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.plants) setPlants(parsed.plants);
        if (parsed.inventory) {
          const loadedStreak = parsed.inventory.dailyStreak
            ? checkDailyStreakLogic(parsed.inventory.dailyStreak)
            : {
                currentStreak: 1,
                longestStreak: 1,
                lastActiveDate: getTodayDateString(),
                claimedToday: false,
                streakRewardsHistory: [],
              };

          setInventory((prev) => ({ 
            ...prev, 
            ...parsed.inventory,
            waterSupply: parsed.inventory.waterSupply ?? 80,
            maxWaterCapacity: parsed.inventory.maxWaterCapacity ?? 120,
            mistCharges: parsed.inventory.mistCharges ?? 25,
            prunerBlades: parsed.inventory.prunerBlades ?? 20,
            chimeResonances: parsed.inventory.chimeResonances ?? 15,
            pollenDust: parsed.inventory.pollenDust ?? 12,
            fertilizerBags: parsed.inventory.fertilizerBags ?? 4,
            revivePotions: parsed.inventory.revivePotions ?? 2,
            dailyStreak: loadedStreak,
            environmentSlotCapacities: { ...prev.environmentSlotCapacities, ...(parsed.inventory.environmentSlotCapacities || {}) },
            discoveredHybrids: parsed.inventory.discoveredHybrids || [],
          }));
        }
        if (parsed.dailyQuests) setDailyQuests(parsed.dailyQuests);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.currentEnvId) setCurrentEnvId(parsed.currentEnvId);
        if (parsed.timeOfDay) setTimeOfDay(parsed.timeOfDay);
        if (parsed.activeWeather) setActiveWeather(parsed.activeWeather);
      } else {
        // Starter initial plants
        const starterPlants: PlantInstance[] = [
          {
            id: 'starter_plant_1',
            speciesId: 'sunflower_radiance',
            slotIndex: 0,
            environmentId: 'sunlit_terrace',
            plantedTimestamp: Date.now() - 35000,
            lastWateredTimestamp: Date.now() - 10000,
            lastTendedTimestamp: Date.now(),
            stage: 'blooming',
            growthProgress: 0.85,
            moistureLevel: 70,
            health: 100,
            fertilizerLevel: 50,
            happiness: 95,
            potId: 'pot_classic_terracotta',
            nickname: 'Sunny Bloom',
            weedsCount: 0,
            isOverwatered: false,
            isUnderwatered: false,
            totalTimesWatered: 2,
            totalTimesPruned: 0,
            harvestCount: 0,
          },
          {
            id: 'starter_plant_2',
            speciesId: 'lavender_breeze',
            slotIndex: 1,
            environmentId: 'sunlit_terrace',
            plantedTimestamp: Date.now() - 40000,
            lastWateredTimestamp: Date.now() - 12000,
            lastTendedTimestamp: Date.now(),
            stage: 'mature',
            growthProgress: 1.0,
            moistureLevel: 62,
            health: 100,
            fertilizerLevel: 0,
            happiness: 100,
            potId: 'pot_classic_terracotta',
            nickname: 'Purple Breeze',
            weedsCount: 0,
            isOverwatered: false,
            isUnderwatered: false,
            totalTimesWatered: 2,
            totalTimesPruned: 0,
            harvestCount: 0,
          },
          {
            id: 'starter_plant_3',
            speciesId: 'chamomile_calm',
            slotIndex: 2,
            environmentId: 'sunlit_terrace',
            plantedTimestamp: Date.now() - 15000,
            lastWateredTimestamp: Date.now() - 5000,
            lastTendedTimestamp: Date.now(),
            stage: 'sprout',
            growthProgress: 0.28,
            moistureLevel: 80,
            health: 100,
            fertilizerLevel: 0,
            happiness: 90,
            potId: 'pot_classic_terracotta',
            nickname: 'Little Chamomile',
            weedsCount: 0,
            isOverwatered: false,
            isUnderwatered: false,
            totalTimesWatered: 1,
            totalTimesPruned: 0,
            harvestCount: 0,
          },
        ];
        setPlants(starterPlants);
      }
    } catch (e) {
      console.warn('Could not load saved garden:', e);
    }
  }, []);

  // Save to LocalStorage
  const saveGameState = useCallback(() => {
    try {
      const data = {
        plants,
        inventory,
        dailyQuests,
        achievements,
        stats,
        currentEnvId,
        timeOfDay,
        activeWeather,
        lastSaved: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save garden state:', e);
    }
  }, [plants, inventory, dailyQuests, achievements, stats, currentEnvId, timeOfDay, activeWeather]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveGameState();
    }, 1500);
    return () => clearTimeout(timer);
  }, [saveGameState]);

  // Track Quest Progress Helper
  const recordQuestAction = useCallback(
    (actionType: DailyQuest['actionType'], amount: number = 1) => {
      setDailyQuests((prevQuests) =>
        prevQuests.map((q) => {
          if (q.actionType === actionType && !q.completed) {
            const nextCount = q.currentCount + amount;
            const isDone = nextCount >= q.targetCount;
            if (isDone && !q.completed) {
              audioSynth.playQuestCompleteSound();
            }
            return {
              ...q,
              currentCount: Math.min(q.targetCount, nextCount),
              completed: isDone,
            };
          }
          return q;
        })
      );
    },
    []
  );

  // Update Achievement Progress Helper
  const updateAchievementProgress = useCallback(
    (achievementId: string, newValue: number) => {
      setAchievements((prevAch) =>
        prevAch.map((ach) => {
          if (ach.id !== achievementId) return ach;
          const currentTier = ach.currentTier;
          const isMaxed = currentTier >= ach.tiers.length;
          return {
            ...ach,
            progress: newValue,
            isMaxed,
          };
        })
      );
    },
    []
  );

  // Spawn visual particle helper
  const addParticle = useCallback((x: number, y: number, type: ParticleEffect['type'], text?: string) => {
    const newP: ParticleEffect = {
      id: `p_${Date.now()}_${Math.random()}`,
      x,
      y,
      type,
      text,
    };
    setParticles((prev) => [...prev.slice(-20), newP]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newP.id));
    }, 1300);
  }, []);

  // --- 100% COMPLETION REWARDS SYSTEM ---
  // Gives guaranteed coins and rare gems when hitting 100% in moisture, health, happiness, or growth!
  const triggerPerfectionReward = useCallback((
    reason: string,
    baseCoins: number = 25,
    gemChance: number = 0.30,
    clientX?: number,
    clientY?: number
  ) => {
    const isGemWon = Math.random() < gemChance;
    const gemsAwarded = isGemWon ? (Math.random() < 0.25 ? 2 : 1) : 0;
    const coinsAwarded = baseCoins;

    audioSynth.playPerfectionSound();
    if (gemsAwarded > 0) {
      setTimeout(() => audioSynth.playGemSound(), 180);
    }

    // Confetti burst for perfection
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#FBBF24', '#60A5FA', '#34D399', '#A78BFA', '#F472B6'],
    });

    setInventory((inv) => ({
      ...inv,
      coins: inv.coins + coinsAwarded,
      gems: inv.gems + gemsAwarded,
    }));

    setStats((s) => ({
      ...s,
      totalCoinsEarned: s.totalCoinsEarned + coinsAwarded,
      totalGemsEarned: s.totalGemsEarned + gemsAwarded,
    }));

    const rewardText = `✨ 100% ${reason}! +${coinsAwarded} 🪙${gemsAwarded > 0 ? ` +${gemsAwarded} 💎` : ''}`;

    if (clientX && clientY) {
      addParticle(clientX, clientY, gemsAwarded > 0 ? 'coin' : 'sparkle', rewardText);
    }
  }, [addParticle]);

  // Dynamic Day/Night Cycle and Weather Clock
  useEffect(() => {
    if (!isTimeAutoAdvancing) return;

    const timeOrder: TimeOfDay[] = ['dawn', 'noon', 'afternoon', 'sunset', 'twilight', 'midnight'];
    const weatherPool: WeatherType[] = [
      'sunny',
      'sunny',
      'golden_hour',
      'gentle_rain',
      'morning_mist',
      'overcast',
      'starry_night',
      'aurora_borealis',
      'heatwave',
    ];

    const cycleInterval = setInterval(() => {
      setTimeOfDay((prevTime) => {
        const nextIdx = (timeOrder.indexOf(prevTime) + 1) % timeOrder.length;
        const nextT = timeOrder[nextIdx];

        // Match weather loosely to time of day
        if (nextT === 'midnight' || nextT === 'twilight') {
          setActiveWeather((w) => (Math.random() < 0.35 ? 'aurora_borealis' : 'starry_night'));
        } else if (nextT === 'sunset') {
          setActiveWeather('golden_hour');
        } else if (nextT === 'dawn') {
          setActiveWeather('morning_mist');
        } else {
          const randomWeather = weatherPool[Math.floor(Math.random() * weatherPool.length)];
          setActiveWeather(randomWeather);
        }

        audioSynth.playWeatherChangeSound();
        return nextT;
      });
    }, 55000);

    return () => clearInterval(cycleInterval);
  }, [isTimeAutoAdvancing]);

  // Real-Time Plant Physics Simulation Loop (1 second tick)
  useEffect(() => {
    const interval = setInterval(() => {
      // Passive Rainwater collection during gentle rain or morning mist
      if (activeWeather === 'gentle_rain' || activeWeather === 'morning_mist') {
        setInventory((inv) => {
          if (inv.waterSupply < inv.maxWaterCapacity) {
            return {
              ...inv,
              waterSupply: Math.min(inv.maxWaterCapacity, inv.waterSupply + (activeWeather === 'gentle_rain' ? 2 : 1)),
            };
          }
          return inv;
        });
      }

      setPlants((prevPlants) => {
        return prevPlants.map((plant) => {
          const species = PLANT_SPECIES.find((s) => s.id === plant.speciesId);
          const env = GARDEN_ENVIRONMENTS.find((e) => e.id === plant.environmentId);
          const pot = POT_ITEMS.find((p) => p.id === plant.potId);

          if (!species || !env) return plant;

          // Physics & Environmental Modifiers
          const humidityFactor = env.humidityRetention;
          const potMoistureBonus = pot ? pot.moistureRetentionBonus : 0;
          
          let moistureDropPerSec = (species.waterConsumptionRate / 60) * humidityFactor * (1 - potMoistureBonus);

          // Weather Effects:
          if (activeWeather === 'gentle_rain' && (plant.environmentId === 'sunlit_terrace' || plant.environmentId === 'alpine_meadow')) {
            moistureDropPerSec = -0.35; // Gentle rain automatically hydrates outdoor terrace & alpine meadows!
          } else if (activeWeather === 'morning_mist') {
            moistureDropPerSec = -0.15; // Misty dew hydrates slightly
          } else if (activeWeather === 'heatwave') {
            moistureDropPerSec *= 1.45; // Evaporates faster during intense heatwave
          }

          const nextMoisture = Math.max(0, Math.min(100, plant.moistureLevel - moistureDropPerSec));
          const isDry = nextMoisture <= 5;
          const isOverwatered = nextMoisture > 92;

          // Health & Happiness calculations
          let healthChange = 0;
          let happinessChange = 0;

          if (isDry) {
            if (species.illustrationType === 'phoenix_bonsai') {
              healthChange = 0.05;
            } else {
              healthChange = -0.45;
              happinessChange = -0.6;
            }
          } else if (isOverwatered) {
            healthChange = -0.15;
            happinessChange = -0.2;
          } else if (nextMoisture >= species.minOptimalMoisture && nextMoisture <= species.maxOptimalMoisture) {
            healthChange = 0.3;
            happinessChange = 0.35;
          }

          // Cosmic / Aurora boost
          if ((activeWeather === 'aurora_borealis' || activeWeather === 'starry_night') && (species.rarity === 'rare' || species.rarity === 'mythic' || species.isHybrid)) {
            happinessChange += 0.25;
            healthChange += 0.15;
          }

          // Weeds nutrient drain
          if (plant.weedsCount > 0) {
            healthChange -= 0.1 * plant.weedsCount;
            happinessChange -= 0.2 * plant.weedsCount;
          }

          const nextHealth = Math.max(0, Math.min(100, plant.health + healthChange));
          const nextHappiness = Math.max(0, Math.min(100, plant.happiness + happinessChange));

          // Fertilizer decay
          const nextFertilizer = Math.max(0, plant.fertilizerLevel - (100 / 120));

          // Growth calculation
          let nextProgress = plant.growthProgress;
          let nextStage = plant.stage;

          if (nextHealth <= 5 && species.illustrationType !== 'phoenix_bonsai') {
            nextStage = 'withered';
          } else if (plant.stage !== 'mature' && plant.stage !== 'withered') {
            if (nextMoisture >= 15 || activeWeather === 'gentle_rain') {
              const potGrowthBonus = pot ? 1 + pot.growthBonus : 1;
              const fertBoost = nextFertilizer > 0 ? 1.6 : 1.0;
              const weatherGrowthBoost = activeWeather === 'heatwave' ? 1.4 : (activeWeather === 'golden_hour' ? 1.2 : 1.0);
              
              const growthPerSec = (1 / species.growthDurationSec) * potGrowthBonus * fertBoost * weatherGrowthBoost;
              nextProgress = Math.min(1.0, plant.growthProgress + growthPerSec);

              if (nextProgress >= 1.0) {
                nextStage = 'mature';
                // Trigger 100% Growth Full Bloom Reward!
                if (plant.growthProgress < 1.0) {
                  triggerPerfectionReward('Full Bloom Growth', 35, 0.35);
                }
              } else if (nextProgress >= 0.75) {
                nextStage = 'blooming';
              } else if (nextProgress >= 0.35) {
                nextStage = 'growing';
              } else if (nextProgress >= 0.12) {
                nextStage = 'sprout';
              } else {
                nextStage = 'seed';
              }
            }
          }

          // Spontaneous weed growth
          let nextWeeds = plant.weedsCount;
          const weedResistance = env.weedResistance || 0.1;
          if (plant.weedsCount < 3 && nextMoisture > 40 && Math.random() < 0.0025 * (1 - weedResistance)) {
            nextWeeds += 1;
          }

          return {
            ...plant,
            moistureLevel: nextMoisture,
            health: nextHealth,
            happiness: nextHappiness,
            fertilizerLevel: nextFertilizer,
            growthProgress: nextProgress,
            stage: nextStage,
            weedsCount: nextWeeds,
            isUnderwatered: isDry,
            isOverwatered: isOverwatered,
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWeather, triggerPerfectionReward]);

  // Audio BGM Sync
  const toggleAudio = useCallback(() => {
    const isMuted = audioSynth.toggleMute();
    setIsMusicPlaying(!isMuted);
    if (!isMuted) {
      recordQuestAction('listen_music', 1);
    }
  }, [recordQuestAction]);

  const changeMusicPreset = useCallback((preset: 'cozy_chords' | 'rain_kalimba' | 'wind_chimes' | 'zen_bowl') => {
    audioSynth.setPreset(preset);
  }, []);

  // --- PLAYER INTERACTIONS (WITH FINITE GEARS & 100% REWARDS) ---

  // 1. Water Plant (Consumes 10 Water Units)
  const waterPlant = useCallback(
    (plantId: string, clientX?: number, clientY?: number) => {
      // Check water supply
      if (inventory.waterSupply < 10) {
        if (clientX && clientY) {
          addParticle(clientX, clientY, 'water', '🪣 Out of Water! Refill in Shop 🛒');
        }
        setIsQuickRefillOpen(true);
        return;
      }

      audioSynth.playWaterSound();

      let reached100PercentMoisture = false;
      let reached100PercentHealth = false;
      let reached100PercentHappiness = false;

      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === plantId) {
            const addedMoisture = Math.min(100, p.moistureLevel + 42);
            const addedHealth = Math.min(100, p.health + 12);
            const addedHappiness = Math.min(100, p.happiness + 15);

            if (p.moistureLevel < 100 && addedMoisture >= 100) {
              reached100PercentMoisture = true;
            }
            if (p.health < 100 && addedHealth >= 100) {
              reached100PercentHealth = true;
            }
            if (p.happiness < 100 && addedHappiness >= 100) {
              reached100PercentHappiness = true;
            }

            return {
              ...p,
              moistureLevel: addedMoisture,
              health: addedHealth,
              happiness: addedHappiness,
              lastWateredTimestamp: Date.now(),
              lastTendedTimestamp: Date.now(),
              totalTimesWatered: p.totalTimesWatered + 1,
            };
          }
          return p;
        })
      );

      // Deduct Water Supply
      setInventory((inv) => ({
        ...inv,
        waterSupply: Math.max(0, inv.waterSupply - 10),
      }));

      setStats((s) => {
        const nextWater = s.totalWaterPoured + 250;
        updateAchievementProgress('ach_hydration_care', Math.floor(nextWater / 250));
        return { ...s, totalWaterPoured: nextWater };
      });

      recordQuestAction('water', 1);

      // Trigger 100% completion bonuses!
      if (reached100PercentMoisture) {
        triggerPerfectionReward('Hydration Mastery', 25, 0.35, clientX, clientY);
      } else if (reached100PercentHealth) {
        triggerPerfectionReward('Pristine Vitality', 20, 0.25, clientX, clientY);
      } else if (reached100PercentHappiness) {
        triggerPerfectionReward('Flora Happiness', 20, 0.25, clientX, clientY);
      } else if (clientX && clientY) {
        addParticle(clientX, clientY, 'water', '+42% Water (-10💧)');
      }
    },
    [inventory.waterSupply, recordQuestAction, updateAchievementProgress, triggerPerfectionReward, addParticle]
  );

  // 2. Mist Spritzer (Consumes 1 Mist Spray)
  const mistPlant = useCallback(
    (plantId: string, clientX?: number, clientY?: number) => {
      if (inventory.mistCharges <= 0) {
        if (clientX && clientY) {
          addParticle(clientX, clientY, 'sparkle', '💨 Mist Canister Empty! Refill in Shop 🛒');
        }
        setIsQuickRefillOpen(true);
        return;
      }

      audioSynth.playMistSound();

      let reached100Moisture = false;
      let reached100Happiness = false;

      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === plantId) {
            const nextM = Math.min(100, p.moistureLevel + 20);
            const nextH = Math.min(100, p.happiness + 25);

            if (p.moistureLevel < 100 && nextM >= 100) reached100Moisture = true;
            if (p.happiness < 100 && nextH >= 100) reached100Happiness = true;

            return {
              ...p,
              moistureLevel: nextM,
              happiness: nextH,
              health: Math.min(100, p.health + 8),
              lastTendedTimestamp: Date.now(),
            };
          }
          return p;
        })
      );

      // Deduct mist charge
      setInventory((inv) => ({
        ...inv,
        mistCharges: Math.max(0, inv.mistCharges - 1),
      }));

      recordQuestAction('fertilize', 1);

      if (reached100Moisture) {
        triggerPerfectionReward('Misty Hydration', 25, 0.30, clientX, clientY);
      } else if (reached100Happiness) {
        triggerPerfectionReward('Flora Serenity', 20, 0.25, clientX, clientY);
      } else if (clientX && clientY) {
        addParticle(clientX, clientY, 'sparkle', 'Fresh Mist ✨ (-1💨)');
      }
    },
    [inventory.mistCharges, recordQuestAction, triggerPerfectionReward, addParticle]
  );

  // 3. Harvest Plant
  const harvestPlant = useCallback(
    (plantId: string, clientX?: number, clientY?: number) => {
      const plant = plants.find((p) => p.id === plantId);
      if (!plant) return;

      const species = PLANT_SPECIES.find((s) => s.id === plant.speciesId);
      if (!species) return;

      if (plant.stage !== 'mature') return;

      audioSynth.playHarvestSound();
      audioSynth.playCoinSound();

      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#FBBF24', '#34D399', '#A78BFA', '#F472B6', '#FDE047'],
      });

      let coinsEarned = species.sellPriceCoins;
      if (activeWeather === 'golden_hour') coinsEarned = Math.round(coinsEarned * 1.25);
      if (plant.isPrismaticMutation) coinsEarned = Math.round(coinsEarned * 2.5);

      let gemsEarned = species.gemReward;
      if (activeWeather === 'aurora_borealis' || plant.isPrismaticMutation) {
        gemsEarned = gemsEarned * 2;
      }

      const seedBonus = Math.random() < 0.65;
      const nextSeeds = { ...inventory.seeds };
      if (seedBonus) {
        nextSeeds[species.id] = (nextSeeds[species.id] || 0) + 1;
      }

      setInventory((inv) => ({
        ...inv,
        coins: inv.coins + coinsEarned,
        gems: inv.gems + gemsEarned,
        seeds: nextSeeds,
      }));

      setStats((s) => {
        const nextHarvests = s.totalHarvests + 1;
        updateAchievementProgress('ach_harvest_master', nextHarvests);
        return {
          ...s,
          totalHarvests: nextHarvests,
          totalCoinsEarned: s.totalCoinsEarned + coinsEarned,
          totalGemsEarned: s.totalGemsEarned + gemsEarned,
        };
      });

      recordQuestAction('harvest', 1);
      setPlants((prev) => prev.filter((p) => p.id !== plantId));

      if (clientX && clientY) {
        addParticle(clientX, clientY, 'coin', `+${coinsEarned} 🪙 +${gemsEarned} 💎`);
      }
    },
    [plants, activeWeather, inventory.seeds, recordQuestAction, updateAchievementProgress, addParticle]
  );

  // 4. Plant New Seed in Slot
  const plantSeedInSlot = useCallback(
    (slotIndex: number, speciesId: string, potId: string = 'pot_classic_terracotta', clientX?: number, clientY?: number) => {
      if ((inventory.seeds[speciesId] || 0) <= 0) {
        return false;
      }

      const species = PLANT_SPECIES.find((s) => s.id === speciesId);
      if (!species) return false;

      audioSynth.playPlantSeedSound();

      const newPlant: PlantInstance = {
        id: `plant_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        speciesId,
        slotIndex,
        environmentId: currentEnvId,
        plantedTimestamp: Date.now(),
        lastWateredTimestamp: Date.now(),
        lastTendedTimestamp: Date.now(),
        stage: 'seed',
        growthProgress: 0.0,
        moistureLevel: 55,
        health: 100,
        fertilizerLevel: 0,
        happiness: 90,
        potId,
        weedsCount: 0,
        isOverwatered: false,
        isUnderwatered: false,
        totalTimesWatered: 1,
        totalTimesPruned: 0,
        harvestCount: 0,
      };

      setPlants((prev) => [...prev, newPlant]);

      setInventory((inv) => {
        const nextDiscovered = inv.discoveredSpecies.includes(speciesId)
          ? inv.discoveredSpecies
          : [...inv.discoveredSpecies, speciesId];

        updateAchievementProgress('ach_flora_collector', nextDiscovered.length);

        return {
          ...inv,
          seeds: {
            ...inv.seeds,
            [speciesId]: inv.seeds[speciesId] - 1,
          },
          discoveredSpecies: nextDiscovered,
        };
      });

      setStats((s) => ({
        ...s,
        totalSeedsPlanted: s.totalSeedsPlanted + 1,
      }));

      recordQuestAction('plant', 1);

      if (clientX && clientY) {
        addParticle(clientX, clientY, 'leaf', `Planted ${species.name}! 🌱`);
      }
      return true;
    },
    [inventory.seeds, currentEnvId, recordQuestAction, updateAchievementProgress, addParticle]
  );

  // 5. Pull Weeds / Prune (Consumes 1 Shears Blade Durability)
  const prunePlant = useCallback(
    (plantId: string, clientX?: number, clientY?: number) => {
      if (inventory.prunerBlades <= 0) {
        if (clientX && clientY) {
          addParticle(clientX, clientY, 'leaf', '✂️ Shears Blades Dull! Sharpen in Shop 🛒');
        }
        setIsQuickRefillOpen(true);
        return;
      }

      audioSynth.playPruneSound();
      audioSynth.playCoinSound();

      let reached100Health = false;
      let allClean = false;

      setPlants((prev) => {
        const updated = prev.map((p) => {
          if (p.id === plantId) {
            const nextH = Math.min(100, p.health + 18);
            if (p.health < 100 && nextH >= 100) reached100Health = true;

            return {
              ...p,
              weedsCount: 0,
              health: nextH,
              happiness: Math.min(100, p.happiness + 20),
              totalTimesPruned: p.totalTimesPruned + 1,
              stage: p.stage === 'withered' && p.health > 20 ? 'growing' : p.stage,
            };
          }
          return p;
        });

        // Check if 100% of current environment plants have 0 weeds
        const envPlants = updated.filter((p) => p.environmentId === currentEnvId);
        if (envPlants.length > 0 && envPlants.every((p) => p.weedsCount === 0)) {
          allClean = true;
        }

        return updated;
      });

      // Deduct 1 pruner blade use & add weed cleanup coin
      setInventory((inv) => ({
        ...inv,
        coins: inv.coins + 8,
        prunerBlades: Math.max(0, inv.prunerBlades - 1),
      }));

      setStats((s) => ({
        ...s,
        totalWeedsCleaned: s.totalWeedsCleaned + 1,
        totalCoinsEarned: s.totalCoinsEarned + 8,
      }));

      recordQuestAction('prune', 1);

      if (allClean) {
        triggerPerfectionReward('Pristine Sanctuary Cleanliness', 30, 0.30, clientX, clientY);
      } else if (reached100Health) {
        triggerPerfectionReward('Botanical Vitality', 20, 0.25, clientX, clientY);
      } else if (clientX && clientY) {
        addParticle(clientX, clientY, 'coin', '+8 🪙 Weeded (-1✂️)');
      }
    },
    [inventory.prunerBlades, currentEnvId, recordQuestAction, triggerPerfectionReward, addParticle]
  );

  // 6. Apply Fertilizer (Consumes 1 Fertilizer Bag)
  const fertilizePlant = useCallback(
    (plantId: string, clientX?: number, clientY?: number) => {
      if (inventory.fertilizerBags <= 0) {
        if (clientX && clientY) {
          addParticle(clientX, clientY, 'sparkle', '🌱 Out of Fertilizer! Buy more in Shop 🛒');
        }
        setIsQuickRefillOpen(true);
        return;
      }

      audioSynth.playDigSound();
      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === plantId) {
            return {
              ...p,
              fertilizerLevel: 100,
              happiness: Math.min(100, p.happiness + 35),
              health: Math.min(100, p.health + 25),
            };
          }
          return p;
        })
      );

      setInventory((inv) => ({
        ...inv,
        fertilizerBags: inv.fertilizerBags - 1,
      }));

      recordQuestAction('fertilize', 1);
      triggerPerfectionReward('Organic Soil Enrichment', 20, 0.20, clientX, clientY);
    },
    [inventory.fertilizerBags, recordQuestAction, triggerPerfectionReward, addParticle]
  );

  // 7. Ring Musical Chime (Consumes 1 Chime Resonance)
  const ringChimeForPlant = useCallback(
    (plantId: string, clientX?: number, clientY?: number) => {
      if (inventory.chimeResonances <= 0) {
        if (clientX && clientY) {
          addParticle(clientX, clientY, 'heart', '🔔 Chime Resonators Spent! Refill in Shop 🛒');
        }
        setIsQuickRefillOpen(true);
        return;
      }

      audioSynth.playBellChimeSound();
      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === plantId) {
            return {
              ...p,
              happiness: 100,
              health: Math.min(100, p.health + 15),
            };
          }
          return p;
        })
      );

      setInventory((inv) => ({
        ...inv,
        chimeResonances: Math.max(0, inv.chimeResonances - 1),
      }));

      recordQuestAction('listen_music', 1);
      triggerPerfectionReward('Harmonic Flora Bliss', 20, 0.25, clientX, clientY);
    },
    [inventory.chimeResonances, recordQuestAction, triggerPerfectionReward, addParticle]
  );

  // 8. Revive Withered Plant with Potion
  const revivePlant = useCallback(
    (plantId: string, clientX?: number, clientY?: number) => {
      if (inventory.revivePotions <= 0) {
        if (clientX && clientY) {
          addParticle(clientX, clientY, 'sparkle', '🧪 Out of Revive Elixir! Buy in Shop 🛒');
        }
        setIsQuickRefillOpen(true);
        return;
      }

      audioSynth.playReviveSound();
      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === plantId) {
            return {
              ...p,
              stage: 'blooming',
              health: 100,
              moistureLevel: 80,
              happiness: 100,
              growthProgress: Math.max(0.7, p.growthProgress),
            };
          }
          return p;
        })
      );

      setInventory((inv) => ({
        ...inv,
        revivePotions: inv.revivePotions - 1,
      }));

      triggerPerfectionReward('Miracle Vitality Rebirth', 35, 0.40, clientX, clientY);
    },
    [inventory.revivePotions, triggerPerfectionReward, addParticle]
  );

  // 9. CROSS-BREEDING / POLLINATION LAB MECHANICS (Consumes 1 Pollen Dust)
  const crossBreedPlants = useCallback(
    (parentAId: string, parentBId: string) => {
      if (inventory.pollenDust <= 0) {
        setIsQuickRefillOpen(true);
        return { success: false, message: 'Golden Pollen Dust exhausted! Refill supplies in the Artisan Market.' };
      }

      const plantA = plants.find((p) => p.id === parentAId);
      const plantB = plants.find((p) => p.id === parentBId);

      if (!plantA || !plantB) return { success: false, message: 'Invalid parent plants selected.' };
      if (plantA.id === plantB.id) return { success: false, message: 'Please select two different parent plants.' };

      const speciesA = PLANT_SPECIES.find((s) => s.id === plantA.speciesId);
      const speciesB = PLANT_SPECIES.find((s) => s.id === plantB.speciesId);

      if (!speciesA || !speciesB) return { success: false, message: 'Species not found.' };

      // Deduct 1 Pollen Dust
      setInventory((inv) => ({
        ...inv,
        pollenDust: Math.max(0, inv.pollenDust - 1),
      }));

      // Find matching recipe in HYBRID_RECIPES
      const matchedRecipe = HYBRID_RECIPES.find(
        (r) =>
          (r.parentA === speciesA.id && r.parentB === speciesB.id) ||
          (r.parentA === speciesB.id && r.parentB === speciesA.id)
      );

      audioSynth.playPollinationSound();

      const currentEnv = GARDEN_ENVIRONMENTS.find((e) => e.id === currentEnvId);
      const envMutationBonus = currentEnv?.mutationAffinityBonus || 0;
      const weatherBonus = activeWeather === 'aurora_borealis' ? 0.35 : (activeWeather === 'starry_night' ? 0.2 : 0);

      if (matchedRecipe) {
        const resultSpecies = PLANT_SPECIES.find((s) => s.id === matchedRecipe.resultSpeciesId);
        if (!resultSpecies) return { success: false, message: 'Hybrid species metadata missing.' };

        const finalSuccessRate = Math.min(0.95, matchedRecipe.successRate + envMutationBonus);
        const roll = Math.random();

        if (roll <= finalSuccessRate) {
          const isPrismatic = Math.random() < (matchedRecipe.mutationChance + weatherBonus);

          if (isPrismatic) {
            audioSynth.playMutationSuccessSound();
          }

          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#10B981'],
          });

          setInventory((inv) => {
            const nextSeeds = {
              ...inv.seeds,
              [resultSpecies.id]: (inv.seeds[resultSpecies.id] || 0) + (isPrismatic ? 2 : 1),
            };
            const nextDiscoveredSpecies = inv.discoveredSpecies.includes(resultSpecies.id)
              ? inv.discoveredSpecies
              : [...inv.discoveredSpecies, resultSpecies.id];
            const nextDiscoveredHybrids = inv.discoveredHybrids.includes(resultSpecies.id)
              ? inv.discoveredHybrids
              : [...inv.discoveredHybrids, resultSpecies.id];

            updateAchievementProgress('ach_hybrid_pioneer', nextDiscoveredHybrids.length);
            updateAchievementProgress('ach_flora_collector', nextDiscoveredSpecies.length);

            return {
              ...inv,
              seeds: nextSeeds,
              discoveredSpecies: nextDiscoveredSpecies,
              discoveredHybrids: nextDiscoveredHybrids,
              gems: inv.gems + (isPrismatic ? 6 : 3),
            };
          });

          setStats((s) => ({ ...s, totalCrossBreeds: s.totalCrossBreeds + 1 }));
          recordQuestAction('cross_breed', 1);

          return {
            success: true,
            species: resultSpecies,
            isPrismatic,
            message: `Miraculous cross-pollination! Discovered ${resultSpecies.name}${isPrismatic ? ' (Prismatic Starborn Mutation! ✨)' : ''}!`,
          };
        } else {
          setInventory((inv) => ({
            ...inv,
            seeds: {
              ...inv.seeds,
              [speciesA.id]: (inv.seeds[speciesA.id] || 0) + 1,
            },
          }));
          return {
            success: false,
            message: `The pollen gently dispersed in the breeze without creating a new hybrid seed. You collected 1x ${speciesA.name} seed packet instead.`,
          };
        }
      } else {
        const consolationSeed = Math.random() < 0.5 ? speciesA : speciesB;
        setInventory((inv) => ({
          ...inv,
          seeds: {
            ...inv.seeds,
            [consolationSeed.id]: (inv.seeds[consolationSeed.id] || 0) + 1,
          },
          coins: inv.coins + 30,
        }));
        return {
          success: false,
          message: `Crossed ${speciesA.name} with ${speciesB.name}. No known hybrid recipe formed, but you gathered fresh pollen and +30 🪙!`,
        };
      }
    },
    [inventory.pollenDust, plants, currentEnvId, activeWeather, recordQuestAction, updateAchievementProgress]
  );

  // 10. Expand Environment Slots Capacity
  const expandEnvironmentSlots = useCallback(
    (envId: EnvironmentId) => {
      const currentCap = inventory.environmentSlotCapacities[envId] || 6;
      if (currentCap >= 12) return false;

      const upgradeCostCoins = (currentCap - 4) * 120;
      const upgradeCostGems = (currentCap - 4) * 2;

      if (inventory.coins < upgradeCostCoins || inventory.gems < upgradeCostGems) return false;

      audioSynth.playAchievementSound();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });

      setInventory((inv) => ({
        ...inv,
        coins: inv.coins - upgradeCostCoins,
        gems: inv.gems - upgradeCostGems,
        environmentSlotCapacities: {
          ...inv.environmentSlotCapacities,
          [envId]: currentCap + 2,
        },
      }));

      return true;
    },
    [inventory.coins, inventory.gems, inventory.environmentSlotCapacities]
  );

  // 11. Change Pot Style for a Plant
  const setPlantPot = useCallback((plantId: string, potId: string) => {
    audioSynth.playPotPlacementSound();
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, potId } : p))
    );
  }, []);

  // 12. Purchases & Refills
  const buySeed = useCallback(
    (speciesId: string, count: number = 1) => {
      const species = PLANT_SPECIES.find((s) => s.id === speciesId);
      if (!species) return false;

      const totalCost = species.seedCostCoins * count;
      if (inventory.coins < totalCost) return false;

      audioSynth.playCoinSound();
      setInventory((inv) => {
        const nextDiscovered = inv.discoveredSpecies.includes(speciesId)
          ? inv.discoveredSpecies
          : [...inv.discoveredSpecies, speciesId];

        updateAchievementProgress('ach_flora_collector', nextDiscovered.length);

        return {
          ...inv,
          coins: inv.coins - totalCost,
          seeds: {
            ...inv.seeds,
            [speciesId]: (inv.seeds[speciesId] || 0) + count,
          },
          discoveredSpecies: nextDiscovered,
        };
      });
      return true;
    },
    [inventory.coins, updateAchievementProgress]
  );

  const buyPot = useCallback(
    (potId: string) => {
      const pot = POT_ITEMS.find((p) => p.id === potId);
      if (!pot) return false;

      if (inventory.coins < pot.priceCoins || inventory.gems < pot.priceGems) return false;

      audioSynth.playGemSound();
      setInventory((inv) => ({
        ...inv,
        coins: inv.coins - pot.priceCoins,
        gems: inv.gems - pot.priceGems,
        unlockedPots: [...inv.unlockedPots, potId],
      }));
      return true;
    },
    [inventory.coins, inventory.gems]
  );

  const buyTool = useCallback(
    (toolId: ToolType) => {
      const tool = TOOL_ITEMS.find((t) => t.id === toolId);
      if (!tool) return false;

      if (inventory.coins < tool.priceCoins || inventory.gems < tool.priceGems) return false;

      audioSynth.playGemSound();
      setInventory((inv) => ({
        ...inv,
        coins: inv.coins - tool.priceCoins,
        gems: inv.gems - tool.priceGems,
        unlockedTools: {
          ...inv.unlockedTools,
          [toolId]: (inv.unlockedTools[toolId] || 0) + 1,
        },
      }));
      return true;
    },
    [inventory.coins, inventory.gems]
  );

  const buyEnvironment = useCallback(
    (envId: EnvironmentId) => {
      const env = GARDEN_ENVIRONMENTS.find((e) => e.id === envId);
      if (!env) return false;

      if (inventory.coins < env.priceCoins || inventory.gems < env.priceGems) return false;

      audioSynth.playAchievementSound();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

      setInventory((inv) => {
        const nextEnvs = [...inv.unlockedEnvironments, envId];
        updateAchievementProgress('ach_sanctuary_expansion', nextEnvs.length);
        return {
          ...inv,
          coins: inv.coins - env.priceCoins,
          gems: inv.gems - env.priceGems,
          unlockedEnvironments: nextEnvs,
        };
      });
      return true;
    },
    [inventory.coins, inventory.gems, updateAchievementProgress]
  );

  // Buy Any Gear Supply Item (Water, Mist, Blades, Chimes, Pollen, Fertilizer, Potions, Bundle)
  const buyGearSupply = useCallback((supplyId: string): boolean => {
    const supply = GEAR_SUPPLIES_SHOP.find((s) => s.id === supplyId);
    if (!supply) return false;

    if (inventory.coins < supply.priceCoins || inventory.gems < supply.priceGems) return false;

    audioSynth.playCoinSound();
    if (supply.priceGems > 0) audioSynth.playGemSound();

    setInventory((inv) => {
      let nextInv = {
        ...inv,
        coins: inv.coins - supply.priceCoins,
        gems: inv.gems - supply.priceGems,
      };

      if (supply.targetGear === 'waterSupply') {
        nextInv.waterSupply = Math.min(inv.maxWaterCapacity + 100, inv.waterSupply + supply.givesAmount);
      } else if (supply.targetGear === 'mistCharges') {
        nextInv.mistCharges = inv.mistCharges + supply.givesAmount;
      } else if (supply.targetGear === 'prunerBlades') {
        nextInv.prunerBlades = inv.prunerBlades + supply.givesAmount;
      } else if (supply.targetGear === 'chimeResonances') {
        nextInv.chimeResonances = inv.chimeResonances + supply.givesAmount;
      } else if (supply.targetGear === 'pollenDust') {
        nextInv.pollenDust = inv.pollenDust + supply.givesAmount;
      } else if (supply.targetGear === 'fertilizerBags') {
        nextInv.fertilizerBags = inv.fertilizerBags + supply.givesAmount;
      } else if (supply.targetGear === 'revivePotions') {
        nextInv.revivePotions = inv.revivePotions + supply.givesAmount;
      } else if (supply.targetGear === 'bundle') {
        // Master Caretaker Bundle
        nextInv.waterSupply = Math.min(inv.maxWaterCapacity + 150, inv.waterSupply + 150);
        nextInv.mistCharges = inv.mistCharges + 30;
        nextInv.prunerBlades = inv.prunerBlades + 25;
        nextInv.chimeResonances = inv.chimeResonances + 15;
        nextInv.pollenDust = inv.pollenDust + 10;
        nextInv.fertilizerBags = inv.fertilizerBags + 4;
        nextInv.revivePotions = inv.revivePotions + 1;
      }

      return nextInv;
    });

    return true;
  }, [inventory.coins, inventory.gems]);

  const buyFertilizerPack = useCallback((amount: number = 3, costCoins: number = 40) => {
    if (inventory.coins < costCoins) return false;
    audioSynth.playCoinSound();
    setInventory((inv) => ({
      ...inv,
      coins: inv.coins - costCoins,
      fertilizerBags: inv.fertilizerBags + amount,
    }));
    return true;
  }, [inventory.coins]);

  const buyRevivePotion = useCallback((costCoins: number = 120) => {
    if (inventory.coins < costCoins) return false;
    audioSynth.playGemSound();
    setInventory((inv) => ({
      ...inv,
      coins: inv.coins - costCoins,
      revivePotions: inv.revivePotions + 1,
    }));
    return true;
  }, [inventory.coins]);

  // Quick Refill Specifics
  const quickRefillWater = useCallback(() => {
    return buyGearSupply('supply_water_bucket');
  }, [buyGearSupply]);

  const quickRefillMist = useCallback(() => {
    return buyGearSupply('supply_mist_canister');
  }, [buyGearSupply]);

  const quickRefillBlades = useCallback(() => {
    return buyGearSupply('supply_shears_blades');
  }, [buyGearSupply]);

  // Claim Daily Streak Reward
  const claimDailyStreak = useCallback(() => {
    if (inventory.dailyStreak.claimedToday) return;

    const streakCycleDay = ((inventory.dailyStreak.currentStreak - 1) % 7) + 1;
    const tier = STREAK_REWARDS.find((r) => r.day === streakCycleDay) || STREAK_REWARDS[0];

    audioSynth.playStreakRewardSound();
    confetti({
      particleCount: 80,
      spread: 85,
      origin: { y: 0.55 },
      colors: ['#EA580C', '#F59E0B', '#10B981', '#6366F1', '#EC4899'],
    });

    setInventory((inv) => {
      const nextSeeds = { ...inv.seeds };
      if (tier.seedSpeciesId) {
        nextSeeds[tier.seedSpeciesId] = (nextSeeds[tier.seedSpeciesId] || 0) + 1;
      }

      return {
        ...inv,
        coins: inv.coins + tier.coins,
        gems: inv.gems + tier.gems,
        waterSupply: inv.waterSupply + (tier.waterBonus || 0),
        mistCharges: inv.mistCharges + (tier.mistBonus || 0),
        prunerBlades: inv.prunerBlades + (tier.bladesBonus || 0),
        fertilizerBags: inv.fertilizerBags + (tier.fertilizerBonus || 0),
        revivePotions: inv.revivePotions + (tier.potionBonus || 0),
        seeds: nextSeeds,
        dailyStreak: {
          ...inv.dailyStreak,
          claimedToday: true,
          lastActiveDate: getTodayDateString(),
          streakRewardsHistory: [...inv.dailyStreak.streakRewardsHistory, tier.day],
        },
      };
    });

    setStats((s) => ({
      ...s,
      totalCoinsEarned: s.totalCoinsEarned + tier.coins,
      totalGemsEarned: s.totalGemsEarned + tier.gems,
    }));
  }, [inventory.dailyStreak]);

  // Claim Daily Quest Reward
  const claimQuestReward = useCallback(
    (questId: string) => {
      const quest = dailyQuests.find((q) => q.id === questId);
      if (!quest || !quest.completed || quest.claimed) return;

      audioSynth.playGemSound();
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });

      setInventory((inv) => ({
        ...inv,
        coins: inv.coins + quest.rewardCoins,
        gems: inv.gems + quest.rewardGems,
      }));

      setDailyQuests((quests) =>
        quests.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
      );
    },
    [dailyQuests]
  );

  // Claim Achievement Tier Reward
  const claimAchievementTier = useCallback(
    (achievementId: string) => {
      const ach = achievements.find((a) => a.id === achievementId);
      if (!ach || ach.isMaxed) return;

      const currentTierData = ach.tiers[ach.currentTier];
      if (!currentTierData || ach.progress < currentTierData.threshold) return;

      audioSynth.playAchievementSound();
      confetti({ particleCount: 60, spread: 75, origin: { y: 0.6 } });

      setInventory((inv) => {
        const nextSeeds = { ...inv.seeds };
        if (currentTierData.rewardSeedId) {
          nextSeeds[currentTierData.rewardSeedId] = (nextSeeds[currentTierData.rewardSeedId] || 0) + 1;
        }
        return {
          ...inv,
          coins: inv.coins + currentTierData.rewardCoins,
          gems: inv.gems + currentTierData.rewardGems,
          seeds: nextSeeds,
        };
      });

      setAchievements((prev) =>
        prev.map((a) => {
          if (a.id !== achievementId) return a;
          const nextTier = a.currentTier + 1;
          return {
            ...a,
            currentTier: nextTier,
            isMaxed: nextTier >= a.tiers.length,
          };
        })
      );
    },
    [achievements]
  );

  return {
    currentEnvId,
    setCurrentEnvId,
    activeTool,
    setActiveTool,
    selectedPlantId,
    setSelectedPlantId,
    selectedBreedParentA,
    setSelectedBreedParentA,
    selectedBreedParentB,
    setSelectedBreedParentB,
    plants,
    inventory,
    dailyQuests,
    achievements,
    stats,
    timeOfDay,
    setTimeOfDay,
    activeWeather,
    setActiveWeather,
    isTimeAutoAdvancing,
    setIsTimeAutoAdvancing,
    isAlmanacOpen,
    setIsAlmanacOpen,
    isShopOpen,
    setIsShopOpen,
    isQuestsOpen,
    setIsQuestsOpen,
    isStreakModalOpen,
    setIsStreakModalOpen,
    isAudioPlayerOpen,
    setIsAudioPlayerOpen,
    isBreedingLabOpen,
    setIsBreedingLabOpen,
    isTerrainExpanderOpen,
    setIsTerrainExpanderOpen,
    isQuickRefillOpen,
    setIsQuickRefillOpen,
    particles,
    isMusicPlaying,
    toggleAudio,
    changeMusicPreset,
    waterPlant,
    mistPlant,
    harvestPlant,
    plantSeedInSlot,
    prunePlant,
    fertilizePlant,
    ringChimeForPlant,
    revivePlant,
    crossBreedPlants,
    expandEnvironmentSlots,
    setPlantPot,
    buySeed,
    buyPot,
    buyTool,
    buyEnvironment,
    buyGearSupply,
    buyFertilizerPack,
    buyRevivePotion,
    quickRefillWater,
    quickRefillMist,
    quickRefillBlades,
    claimDailyStreak,
    claimQuestReward,
    claimAchievementTier,
    addParticle,
  };
}
