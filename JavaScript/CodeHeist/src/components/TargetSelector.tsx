import React from 'react';
import { Target, PlayerStats } from '../types';
import { TARGETS } from '../data/levels';
import { sound } from '../utils/audio';
import {
  ShieldAlert,
  Wifi,
  Coins,
  Building2,
  Server,
  Radio,
  Cpu,
  Flame,
  Database,
  Lock,
  DollarSign,
  Play,
  Info
} from 'lucide-react';

interface TargetSelectorProps {
  playerStats: PlayerStats;
  onSelectTarget: (target: Target) => void;
  onInspectTarget: (target: Target) => void;
}

export const TargetSelector: React.FC<TargetSelectorProps> = ({
  playerStats,
  onSelectTarget,
  onInspectTarget
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wifi': return <Wifi className="w-5 h-5 text-emerald-400" />;
      case 'Coins': return <Coins className="w-5 h-5 text-amber-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'Server': return <Server className="w-5 h-5 text-purple-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Radio': return <Radio className="w-5 h-5 text-indigo-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      default: return <Server className="w-5 h-5" />;
    }
  };

  const getFirewallBadge = (level: number) => {
    if (level <= 2) return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-bold border border-emerald-500/30 whitespace-nowrap">LOW (Lvl {level})</span>;
    if (level <= 4) return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] sm:text-[11px] font-bold border border-amber-500/30 whitespace-nowrap">MED (Lvl {level})</span>;
    if (level <= 6) return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] sm:text-[11px] font-bold border border-rose-500/30 whitespace-nowrap">HIGH (Lvl {level})</span>;
    return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] sm:text-[11px] font-bold border border-purple-500/30 whitespace-nowrap">LETHAL (Lvl {level})</span>;
  };

  return (
    <div id="target-selector-panel" className="space-y-4 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400 shrink-0" />
            TARGET DIRECTORY (levels.py)
          </h2>
          <p className="text-xs text-neutral-400">
            Select an active node to infiltrate, extract encrypted vault data, and outrun traceback.
          </p>
        </div>
        <div className="text-xs bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
          <span className="text-neutral-400">Heat Level: </span>
          <strong className={`font-bold ${playerStats.heatLevel >= 60 ? 'text-rose-400 animate-pulse' : playerStats.heatLevel >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {playerStats.heatLevel}%
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {TARGETS.map((target) => {
          const isUnlocked = playerStats.unlockedTargets.includes(target.id);

          return (
            <div
              key={target.id}
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                isUnlocked
                  ? 'bg-neutral-900/90 border-neutral-800 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-neutral-950/60 border-neutral-900 opacity-60'
              }`}
            >
              <div>
                {/* Header with Icon and Firewall Badge */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 shrink-0">
                      {getIcon(target.icon)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-neutral-100 leading-tight truncate">
                        {target.name}
                      </h3>
                      <span className="text-[10px] text-neutral-400 truncate block">
                        {target.ip}
                      </span>
                    </div>
                  </div>
                  {getFirewallBadge(target.firewall)}
                </div>

                <p className="text-xs text-neutral-400 mb-3 line-clamp-2 leading-relaxed">
                  {target.description}
                </p>

                {/* Target Specs Grid */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">Vault: <strong className="text-neutral-100">{target.vaultSizeGB}GB</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Bounty: <strong className="text-amber-400">${target.basePayout.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">Heat: <strong className="text-rose-400">+{target.heatGenerated}%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Trace: <strong className="text-neutral-100">{target.traceSpeedMultiplier}x</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons with 44px min height for mobile */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/60">
                {isUnlocked ? (
                  <>
                    <button
                      id={`btn-heist-${target.id}`}
                      onClick={() => {
                        sound.playKeyClick();
                        onSelectTarget(target);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] min-h-[44px] active:scale-95"
                    >
                      <Play className="w-4 h-4 text-emerald-400" />
                      <span>LAUNCH HEIST</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playKeyClick();
                        onInspectTarget(target);
                      }}
                      className="py-2.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs transition-all min-h-[44px] flex items-center gap-1"
                      title="Inspect target details"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Scan</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 text-xs font-semibold text-center min-h-[44px] flex items-center justify-center">
                    LOCKED (Requires Lvl {target.requiredHackerLevel})
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
