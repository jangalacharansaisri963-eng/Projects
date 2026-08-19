import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { 
  Achievement, 
  BiomeConfig, 
  GameMode, 
  GameSettings, 
  GameStats, 
  PlayerState, 
  VehicleDefinition, 
  VehicleUpgradeLevels 
} from './types/game';
import { VEHICLE_LIST } from './data/vehicles';
import { BIOMES } from './data/biomes';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { sound } from './services/audioService';

import { HUD } from './components/HUD';
import { StartScreen } from './components/StartScreen';
import { GameOverModal } from './components/GameOverModal';
import { GarageModal } from './components/GarageModal';
import { PauseModal } from './components/PauseModal';
import { AchievementsModal } from './components/AchievementsModal';
import { ModeSelectModal } from './components/ModeSelectModal';

const STORAGE_KEY = 'highway_dash_save_v1';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Persistence State
  const [cash, setCash] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cash`);
      return saved ? parseInt(saved, 10) : 50; // Starter cash bonus
    } catch {
      return 50;
    }
  });

  const [bestDistance, setBestDistance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_best_dist`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [vehicles, setVehicles] = useState<VehicleDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_vehicles`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return VEHICLE_LIST;
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_selected_car`);
      return saved || 'cruiser';
    } catch {
      return 'cruiser';
    }
  });

  const [upgrades, setUpgrades] = useState<VehicleUpgradeLevels>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_upgrades`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      topSpeed: 0,
      acceleration: 0,
      handling: 0,
      armor: 0,
      nitroDuration: 0,
      magnetRadius: 0,
    };
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [claimedAchievementIds, setClaimedAchievementIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_claimed_ach`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Game UI & Mode States
  const [selectedBiome, setSelectedBiome] = useState<BiomeConfig>(BIOMES[0]);
  const [selectedMode, setSelectedMode] = useState<GameMode>('survival');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  
  const [currentStats, setCurrentStats] = useState<GameStats>({
    distance: 0,
    coinsEarned: 0,
    cash: 0,
    nearMisses: 0,
    topSpeedReached: 0,
    timeSurvived: 0,
    carsWrecked: 0,
  });

  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [bombTimer, setBombTimer] = useState<number>(30);

  // Modals
  const [isGarageOpen, setIsGarageOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isModesOpen, setIsModesOpen] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    masterVolume: 1,
    sfxVolume: 0.8,
    musicVolume: 0.5,
    enableScanlines: false,
    enableScreenShake: true,
    enableVibration: true,
    controlType: 'virtual_buttons',
    steeringSensitivity: 1.1,
    autoGas: true,
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Sync settings to engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateSettings(settings);
    }
  }, [settings]);

  // Sync menu vehicle & biome preview to engine when not playing
  useEffect(() => {
    if (engineRef.current && gameState === 'menu') {
      engineRef.current.initGame(selectedVehicle, selectedBiome, selectedMode, upgrades);
      engineRef.current.render();
    }
  }, [selectedVehicle, selectedBiome, selectedMode, upgrades, gameState]);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cash`, cash.toString());
      localStorage.setItem(`${STORAGE_KEY}_best_dist`, bestDistance.toString());
      localStorage.setItem(`${STORAGE_KEY}_vehicles`, JSON.stringify(vehicles));
      localStorage.setItem(`${STORAGE_KEY}_selected_car`, selectedVehicleId);
      localStorage.setItem(`${STORAGE_KEY}_upgrades`, JSON.stringify(upgrades));
      localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
      localStorage.setItem(`${STORAGE_KEY}_claimed_ach`, JSON.stringify(claimedAchievementIds));
    } catch {
      // Ignore quota error
    }
  }, [cash, bestDistance, vehicles, selectedVehicleId, upgrades, achievements, claimedAchievementIds]);

  // Audio configuration sync
  useEffect(() => {
    sound.setVolumes(isMuted, settings.sfxVolume, settings.musicVolume);
  }, [isMuted, settings.sfxVolume, settings.musicVolume]);

  // Achievement progress tracking helper
  const handleAchievementProgress = useCallback((id: string, amount: number) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id !== id) return ach;
        const newProgress = Math.max(ach.progress, amount);
        const unlocked = newProgress >= ach.target;
        return {
          ...ach,
          progress: newProgress,
          unlocked: ach.unlocked || unlocked,
        };
      })
    );
  }, []);

  // Initialize GameEngine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, {
      onUpdateStats: (stats, player) => {
        setCurrentStats(stats);
        setPlayerState({ ...player });
      },
      onGameOver: (stats, reason) => {
        setGameState('gameover');
        setGameOverReason(reason);
        setCash((prev) => prev + stats.coinsEarned);

        if (stats.distance > bestDistance) {
          setBestDistance(stats.distance);
        }

        handleAchievementProgress('first_drive', 1);
      },
      onNearMiss: (combo, bonus) => {
        // Handled in engine
      },
      onAchievementProgress: handleAchievementProgress,
      onBombTimerTick: (seconds) => {
        setBombTimer(seconds);
      },
    });

    engineRef.current = engine;
    engine.initGame(selectedVehicle, selectedBiome, selectedMode, upgrades);
    engine.resize();
    engine.render();

    const handleResize = () => {
      engine.resize();
      if (gameState === 'menu') {
        engine.render();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
    };
  }, [bestDistance, handleAchievementProgress]);

  // Start Game
  const handleStartGame = () => {
    if (!engineRef.current) return;
    setIsGarageOpen(false);
    setIsAchievementsOpen(false);
    setIsModesOpen(false);

    engineRef.current.initGame(selectedVehicle, selectedBiome, selectedMode, upgrades);
    engineRef.current.start();
    setGameState('playing');
  };

  // Pause & Resume
  const handlePauseGame = () => {
    if (!engineRef.current || gameState !== 'playing') return;
    engineRef.current.pause();
    setGameState('paused');
  };

  const handleResumeGame = () => {
    if (!engineRef.current) return;
    engineRef.current.resume();
    setGameState('playing');
  };

  const handleRestartGame = () => {
    handleStartGame();
  };

  // Garage Handlers
  const handleUnlockVehicle = (carId: string, price: number): boolean => {
    if (cash < price) return false;
    setCash((prev) => prev - price);
    setVehicles((prev) =>
      prev.map((v) => (v.id === carId ? { ...v, unlocked: true } : v))
    );
    setSelectedVehicleId(carId);

    const unlockedTotal = vehicles.filter((v) => v.unlocked).length + 1;
    handleAchievementProgress('collector', unlockedTotal);
    return true;
  };

  const handleUpgradeStat = (stat: keyof VehicleUpgradeLevels, cost: number): boolean => {
    if (cash < cost) return false;
    setCash((prev) => prev - cost);
    setUpgrades((prev) => ({
      ...prev,
      [stat]: prev[stat] + 1,
    }));
    return true;
  };

  const handleCustomColor = (carId: string, color: string, underglow: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === carId ? { ...v, color, underglowColor: underglow } : v
      )
    );
  };

  const handleClaimAchievementReward = (id: string, coins: number) => {
    if (claimedAchievementIds.includes(id)) return;
    setCash((prev) => prev + coins);
    setClaimedAchievementIds((prev) => [...prev, id]);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950 select-none">
      {/* Game Rendering Canvas */}
      <canvas
        id="game-canvas"
        ref={canvasRef}
        className="w-full h-full block touch-none cursor-crosshair"
      />

      {/* Optional CRT Scanlines Effect */}
      {settings.enableScanlines && (
        <div className="scanlines absolute inset-0 z-10 pointer-events-none" />
      )}

      {/* HUD during Active Gameplay */}
      {gameState === 'playing' && (
        <HUD
          stats={currentStats}
          player={playerState}
          mode={selectedMode}
          bombTimer={bombTimer}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onPause={handlePauseGame}
          onHonk={() => engineRef.current?.honkHorn()}
          onNitroDown={() => {
            if (engineRef.current) engineRef.current.isNitroPressed = true;
          }}
          onNitroUp={() => {
            if (engineRef.current) engineRef.current.isNitroPressed = false;
          }}
          onBrakeDown={() => {
            if (engineRef.current) engineRef.current.isBrakePressed = true;
          }}
          onBrakeUp={() => {
            if (engineRef.current) engineRef.current.isBrakePressed = false;
          }}
          onSteerLeftDown={() => {
            if (engineRef.current) engineRef.current.isLeftPressed = true;
          }}
          onSteerLeftUp={() => {
            if (engineRef.current) engineRef.current.isLeftPressed = false;
          }}
          onSteerRightDown={() => {
            if (engineRef.current) engineRef.current.isRightPressed = true;
          }}
          onSteerRightUp={() => {
            if (engineRef.current) engineRef.current.isRightPressed = false;
          }}
          onGasDown={() => {
            if (engineRef.current) engineRef.current.isGasPressed = true;
          }}
          onGasUp={() => {
            if (engineRef.current) engineRef.current.isGasPressed = false;
          }}
          onJoystickMove={(dx) => {
            engineRef.current?.setJoystickSteer(dx);
          }}
          onJoystickEnd={() => {
            engineRef.current?.setJoystickSteer(0);
          }}
          controlType={settings.controlType}
          onChangeControlType={(type) => {
            setSettings((prev) => ({ ...prev, controlType: type }));
          }}
          autoGas={settings.autoGas}
          onToggleAutoGas={() => {
            setSettings((prev) => ({ ...prev, autoGas: !prev.autoGas }));
          }}
        />
      )}

      {/* Main Start Screen Menu */}
      {gameState === 'menu' && (
        <StartScreen
          onStart={handleStartGame}
          onOpenGarage={() => setIsGarageOpen(true)}
          onOpenModes={() => setIsModesOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          selectedVehicle={selectedVehicle}
          selectedBiome={selectedBiome}
          selectedMode={selectedMode}
          totalCash={cash}
          bestDistance={bestDistance}
        />
      )}

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameState === 'gameover'}
        stats={currentStats}
        reason={gameOverReason}
        onRestart={handleRestartGame}
        onOpenGarage={() => {
          setGameState('menu');
          setIsGarageOpen(true);
        }}
        bestDistance={bestDistance}
      />

      {/* In-Game Pause Modal */}
      <PauseModal
        isOpen={gameState === 'paused'}
        onResume={handleResumeGame}
        onRestart={handleRestartGame}
        onOpenGarage={() => {
          engineRef.current?.stop();
          setGameState('menu');
          setIsGarageOpen(true);
        }}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
      />

      {/* Garage / Tuning Modal */}
      <GarageModal
        isOpen={isGarageOpen}
        onClose={() => setIsGarageOpen(false)}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={(car) => setSelectedVehicleId(car.id)}
        vehicles={vehicles}
        onUnlockVehicle={handleUnlockVehicle}
        upgrades={upgrades}
        onUpgradeStat={handleUpgradeStat}
        onCustomColor={handleCustomColor}
        totalCash={cash}
      />

      {/* Mode & Track Select Modal */}
      <ModeSelectModal
        isOpen={isModesOpen}
        onClose={() => setIsModesOpen(false)}
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        selectedBiome={selectedBiome}
        onSelectBiome={setSelectedBiome}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
        onClaimReward={handleClaimAchievementReward}
        claimedIds={claimedAchievementIds}
      />
    </div>
  );
}
