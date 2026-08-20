import React, { useState } from 'react';
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
  Award,
  Music,
  ChevronDown,
  ChevronUp
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getThemeName = () => {
    switch (terminalTheme) {
      case 'amber': return 'Amber';
      case 'cyan': return 'Cyan';
      case 'blood': return 'Blood';
      case 'ghost': return 'Ghost';
      case 'matrix': default: return 'Matrix';
    }
  };

  return (
    <header className="w-full bg-neutral-950/95 border-b border-neutral-800 px-3 sm:px-6 py-2.5 font-mono select-none sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        
        {/* Top Row: Brand, Rank, and Global Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Hacker Rank */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-base font-black tracking-tight text-white truncate">
                  CODE HEIST
                </span>
                <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                  v.102
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 truncate">
                <span className="flex items-center gap-1 text-purple-300 font-semibold truncate">
                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{playerStats.hackerRank}</span>
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400 shrink-0">{playerStats.hackerXP} XP</span>
              </div>
            </div>
          </div>

          {/* Quick Controls Bar (Mobile & Desktop) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all min-h-[38px] ${
                soundEnabled
                  ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                  : 'border-neutral-800 text-neutral-500 bg-neutral-900'
              }`}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden lg:inline text-[11px]">SFX</span>
            </button>

            {/* Ambient Synth Music Toggle */}
            <button
              onClick={onToggleAmbient}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all min-h-[38px] ${
                ambientPlaying
                  ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 animate-pulse'
                  : 'border-neutral-800 text-neutral-500 bg-neutral-900'
              }`}
              title="Toggle Cyber Drone Music"
              aria-label="Toggle Ambient Audio"
            >
              <Music className="w-4 h-4" />
              <span className="hidden lg:inline text-[11px]">Drone</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={onCycleTheme}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs transition-all flex items-center gap-1 min-h-[38px]"
              title="Cycle Color Theme"
              aria-label="Cycle Color Theme"
            >
              <Palette className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline text-[11px]">{getThemeName()}</span>
            </button>

            {/* Mobile Options Accordion Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs min-h-[38px] flex items-center justify-center"
              aria-label="Toggle settings"
            >
              {mobileMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Desktop Game Mode Selector */}
            <div className="hidden md:flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800 text-[11px] font-bold">
              <button
                onClick={() => onSelectGameMode('chill')}
                className={`px-2.5 py-1.5 rounded ${
                  playerStats.gameMode === 'chill' ? 'bg-emerald-500/20 text-emerald-300' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                CHILL
              </button>
              <button
                onClick={() => onSelectGameMode('standard')}
                className={`px-2.5 py-1.5 rounded ${
                  playerStats.gameMode === 'standard' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                PRO
              </button>
              <button
                onClick={() => onSelectGameMode('hardcore')}
                className={`px-2.5 py-1.5 rounded ${
                  playerStats.gameMode === 'hardcore' ? 'bg-rose-500/20 text-rose-300' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                HARDCORE
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Mobile Mode Settings Bar */}
        {mobileMenuOpen && (
          <div className="md:hidden p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center justify-between text-xs animate-in fade-in">
            <span className="text-[11px] text-neutral-400 font-semibold">Game Mode:</span>
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => onSelectGameMode('chill')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                  playerStats.gameMode === 'chill' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-neutral-400'
                }`}
              >
                CHILL
              </button>
              <button
                onClick={() => onSelectGameMode('standard')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                  playerStats.gameMode === 'standard' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-neutral-400'
                }`}
              >
                PRO
              </button>
              <button
                onClick={() => onSelectGameMode('hardcore')}
                className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                  playerStats.gameMode === 'hardcore' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-neutral-400'
                }`}
              >
                HARDCORE
              </button>
            </div>
          </div>
        )}

        {/* Bottom Row: Vital Stats & Touch-Friendly Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-3 text-xs">
          
          {/* Stats Badges */}
          <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto scrollbar-none py-0.5 flex-1 min-w-0">
            {/* Credits */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 whitespace-nowrap text-[11px] sm:text-xs">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span className="text-neutral-400 hidden xs:inline">Credits:</span>
              <strong className="text-amber-400 font-bold">
                ${playerStats.credits.toLocaleString()}
              </strong>
            </div>

            {/* Stolen Data Stash */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 whitespace-nowrap text-[11px] sm:text-xs">
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <span className="text-neutral-400 hidden xs:inline">Stash:</span>
              <strong className="text-cyan-400 font-bold">
                {playerStats.stolenDataGB} GB
              </strong>
            </div>

            {/* Police Heat Gauge */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 whitespace-nowrap text-[11px] sm:text-xs">
              <Flame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                playerStats.heatLevel >= 60 ? 'text-rose-500 animate-pulse' : playerStats.heatLevel >= 30 ? 'text-amber-400' : 'text-emerald-400'
              }`} />
              <span className="text-neutral-400 hidden xs:inline">Heat:</span>
              <strong className={`font-bold ${
                playerStats.heatLevel >= 60 ? 'text-rose-400' : playerStats.heatLevel >= 30 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {playerStats.heatLevel}%
              </strong>
            </div>
          </div>

          {/* Quick Heat Reduction Buttons (Always Tap-Friendly on Mobile) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onMaskIP}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap min-h-[34px]"
              title="Bounce proxies to reduce heat"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>mask_ip()</span>
            </button>
            <button
              onClick={onWipeLogs}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-rose-500/30 text-rose-300 text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap min-h-[34px]"
              title="Clean police audit logs ($800)"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>wipe_logs()</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
