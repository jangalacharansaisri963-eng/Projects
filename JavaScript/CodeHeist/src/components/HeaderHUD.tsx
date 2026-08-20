import React from 'react';
import { PlayerStats, GameMode } from '../types';
import { sound } from '../utils/audio';
import {
  Terminal,
  DollarSign,
  Database,
  Flame,
  Volume2,
  VolumeX,
  Palette,
  Shield,
  Trash2,
  Radio,
  Award
} from 'lucide-react';

interface HeaderHUDProps {
  playerStats: PlayerStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  ambientPlaying: boolean;
  onToggleAmbient: () => void;
  terminalTheme: 'matrix' | 'amber' | 'cyan' | 'blood' | 'ghost';
  onCycleTheme: () => void;
  onSelectGameMode: (mode: GameMode) => void;
  onMaskIP: () => void;
  onWipeLogs: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  playerStats,
  soundEnabled,
  onToggleSound,
  ambientPlaying,
  onToggleAmbient,
  terminalTheme,
  onCycleTheme,
  onSelectGameMode,
  onMaskIP,
  onWipeLogs
}) => {
  const getThemeName = () => {
    switch (terminalTheme) {
      case 'amber': return 'Cyber Amber';
      case 'cyan': return 'Tron Cyan';
      case 'blood': return 'Blood Red';
      case 'ghost': return 'Ghost White';
      case 'matrix': default: return 'Matrix Green';
    }
  };

  return (
    <header className="w-full bg-neutral-950/95 border-b border-neutral-800 px-3 sm:px-6 py-2.5 font-mono select-none sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand & Hacker Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  CODE HEIST <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">v.102</span>
                </span>
                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                  Dan Studios
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-purple-300 font-semibold">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  {playerStats.hackerRank}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">XP: {playerStats.hackerXP}</span>
              </div>
            </div>
          </div>

          {/* Mobile Right HUD Controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded border text-xs ${soundEnabled ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-neutral-800 text-neutral-500'}`}
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onCycleTheme}
              className="p-1.5 rounded border border-neutral-800 text-neutral-400 hover:text-white"
              title="Cycle Theme"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vital Stats Bar */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs py-1 scrollbar-none">
          {/* Credits */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 whitespace-nowrap">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-neutral-400">Credits:</span>
            <strong className="text-amber-400 font-bold">
              ${playerStats.credits.toLocaleString()}
            </strong>
          </div>

          {/* Stolen Data Stash */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 whitespace-nowrap">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-neutral-400">Data Stash:</span>
            <strong className="text-cyan-400 font-bold">
              {playerStats.stolenDataGB} GB
            </strong>
          </div>

          {/* Police Heat Gauge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 whitespace-nowrap">
            <Flame className={`w-4 h-4 ${playerStats.heatLevel >= 60 ? 'text-rose-500 animate-pulse' : playerStats.heatLevel >= 30 ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="text-neutral-400">Heat:</span>
            <strong className={`font-bold ${playerStats.heatLevel >= 60 ? 'text-rose-400' : playerStats.heatLevel >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {playerStats.heatLevel}%
            </strong>
          </div>

          {/* Mask IP & Wipe Log Actions */}
          <button
            onClick={onMaskIP}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-emerald-400 text-xs font-semibold transition-all whitespace-nowrap"
            title="Bounce proxies to reduce heat"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> mask_ip()
          </button>
          <button
            onClick={onWipeLogs}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-rose-400 text-xs font-semibold transition-all whitespace-nowrap"
            title="Clean police audit logs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" /> wipe_logs()
          </button>
        </div>

        {/* Desktop Utility Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Game Mode Selector */}
          <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800 text-[11px] font-bold">
            <button
              onClick={() => onSelectGameMode('chill')}
              className={`px-2 py-1 rounded ${playerStats.gameMode === 'chill' ? 'bg-emerald-500/20 text-emerald-300' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              CHILL
            </button>
            <button
              onClick={() => onSelectGameMode('standard')}
              className={`px-2 py-1 rounded ${playerStats.gameMode === 'standard' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              PRO
            </button>
            <button
              onClick={() => onSelectGameMode('hardcore')}
              className={`px-2 py-1 rounded ${playerStats.gameMode === 'hardcore' ? 'bg-rose-500/20 text-rose-300' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              HARDCORE
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={onCycleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs transition-all"
            title="Switch color theme"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[11px]">{getThemeName()}</span>
          </button>

          {/* Ambient Synth Toggle */}
          <button
            onClick={onToggleAmbient}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              ambientPlaying
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={ambientPlaying ? 'Stop Ambient Cyber Hum' : 'Play Ambient Cyber Hum'}
          >
            <Radio className="w-4 h-4" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
