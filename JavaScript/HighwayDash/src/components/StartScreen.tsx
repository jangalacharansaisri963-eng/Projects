import React from 'react';
import { VehicleDefinition, BiomeConfig, GameMode } from '../types/game';
import { 
  Play, 
  Wrench, 
  Trophy, 
  Flame, 
  Coins, 
  FileCode,
  Sparkles
} from 'lucide-react';
import { sound } from '../services/audioService';

interface StartScreenProps {
  onStart: () => void;
  onOpenGarage: () => void;
  onOpenModes: () => void;
  onOpenAchievements: () => void;
  selectedVehicle: VehicleDefinition;
  selectedBiome: BiomeConfig;
  selectedMode: GameMode;
  totalCash: number;
  bestDistance: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onOpenGarage,
  onOpenModes,
  onOpenAchievements,
  selectedVehicle,
  selectedBiome,
  selectedMode,
  totalCash,
  bestDistance,
}) => {
  const handleStartGame = () => {
    sound.playPowerup();
    onStart();
  };

  const getModeTitle = (mode: GameMode) => {
    switch (mode) {
      case 'survival': return 'CLASSIC SURVIVAL';
      case 'time_bomb': return 'SPEED BOMB (>90 KM/H)';
      case 'police_chase': return 'POLICE PURSUIT';
      case 'zen_cruise': return 'ZEN FREEWAY';
    }
  };

  return (
    <div 
      id="start-screen-root" 
      className="absolute inset-0 z-30 flex flex-col justify-between items-center p-4 pb-12 sm:pb-8 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto"
      style={{ paddingBottom: 'max(3rem, calc(env(safe-area-inset-bottom, 0px) + 2rem))' }}
    >
      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-1.5 xs:gap-2 flex-wrap sm:flex-nowrap">
        {/* High Score / Best Distance */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-xl">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-wider">RECORD DISTANCE</span>
            <span className="text-xs sm:text-sm font-display text-white font-mono-race">
              {bestDistance} <span className="text-[10px] sm:text-xs text-zinc-400">m</span>
            </span>
          </div>
        </div>

        {/* Currency & Achievements button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            id="achievements-nav-btn"
            onClick={onOpenAchievements}
            className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-xl transition-all cursor-pointer text-zinc-200"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-bold hidden xs:inline">ACHIEVEMENTS</span>
          </button>

          <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-amber-500/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-xl">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span className="text-sm sm:text-base font-display text-amber-400 font-mono-race">${totalCash}</span>
          </div>
        </div>
      </div>

      {/* Hero Title & Interactive Vehicle Card */}
      <div className="flex flex-col items-center max-w-xl text-center my-auto py-6">
        {/* Game Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Flame className="w-3.5 h-3.5" /> TURBO SURVIVAL EDITION
          </div>
          <h1 className="text-4xl sm:text-6xl font-display text-white tracking-tight text-glow-cyan">
            HIGHWAY DASH
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md">
            Thread tight traffic gaps, ignite nitrous boosts, scrape highway medians, and outrun the chaos.
          </p>
        </div>

        {/* Selected Vehicle Card Preview */}
        <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 mt-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mini vehicle visual */}
            <div
              className="relative w-16 h-24 rounded-xl flex flex-col items-center justify-between p-1.5 shadow-lg shrink-0"
              style={{
                backgroundColor: selectedVehicle.color,
                border: `2px solid ${selectedVehicle.accentColor}`,
                boxShadow: `0 0 16px ${selectedVehicle.underglowColor || 'transparent'}`,
              }}
            >
              <div className="w-3/4 h-2 rounded-full" style={{ backgroundColor: selectedVehicle.accentColor }} />
              <div className="w-3/4 h-4 bg-sky-400/90 rounded border border-cyan-200" />
              <div className="w-2/3 h-5 bg-zinc-900/90 rounded" />
              <div className="w-full h-1.5 rounded" style={{ backgroundColor: selectedVehicle.accentColor }} />
            </div>

            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">ACTIVE CAR</span>
              <h3 className="text-lg font-display text-white">{selectedVehicle.name}</h3>
              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{selectedVehicle.specialPerk}</p>
            </div>
          </div>

          <button
            onClick={onOpenGarage}
            className="w-full sm:w-auto px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-zinc-700 transition-all cursor-pointer shrink-0"
          >
            <Wrench className="w-4 h-4 text-cyan-400" /> GARAGE & TUNING
          </button>
        </div>

        {/* Track & Mode Selection Badges */}
        <div className="w-full grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={onOpenModes}
            className="bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 p-3 rounded-2xl flex flex-col text-left transition-all cursor-pointer"
          >
            <span className="text-[10px] uppercase font-bold text-zinc-400">MODE</span>
            <span className="text-xs font-display text-white mt-0.5">{getModeTitle(selectedMode)}</span>
          </button>

          <button
            onClick={onOpenModes}
            className="bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 p-3 rounded-2xl flex flex-col text-left transition-all cursor-pointer"
          >
            <span className="text-[10px] uppercase font-bold text-zinc-400">HIGHWAY TRACK</span>
            <span className="text-xs font-display text-amber-400 mt-0.5">{selectedBiome.name}</span>
          </button>
        </div>

        {/* Big Launch Start Button */}
        <button
          id="main-start-btn"
          onClick={handleStartGame}
          className="w-full py-5 mt-6 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-display text-xl sm:text-2xl rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Play className="w-7 h-7 fill-current" /> START SURVIVAL DRIVE
        </button>

        {/* Control Tips Pill */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-[11px] font-semibold text-zinc-400">
          <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">WASD / ARROWS: STEER</span>
          <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">SPACE: NITRO</span>
          <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">H: HORN (PARTS TRAFFIC)</span>
          <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">TOUCH / DRAG ON MOBILE</span>
        </div>
      </div>

      {/* Footer credits */}
      <div className="text-[11px] text-zinc-500 font-mono-race">
        HIGHWAY DASH: SURVIVAL TURBO • BUILT WITH REACT & CANVAS 60FPS ENGINE
      </div>
    </div>
  );
};
    
