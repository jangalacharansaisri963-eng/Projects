import React from 'react';
import { Target, PlayerStats } from '../types';
import { sound } from '../utils/audio';
import {
  CheckCircle2,
  DollarSign,
  Database,
  ArrowRight,
  ShoppingBag,
  Flame,
  Award,
  Zap
} from 'lucide-react';

interface VictoryModalProps {
  target: Target;
  stolenGB: number;
  bonusCredits: number;
  playerStats: PlayerStats;
  onNextTarget: () => void;
  onOpenShop: () => void;
  onOpenBroker: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  target,
  stolenGB,
  bonusCredits,
  playerStats,
  onNextTarget,
  onOpenShop,
  onOpenBroker
}) => {
  return (
    <div
      id="victory-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-mono"
    >
      <div className="w-full max-w-lg bg-neutral-950 border border-emerald-500/60 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.25)]">
        {/* Emerald Header */}
        <div className="p-4 bg-emerald-950/70 border-b border-emerald-800/60 text-center space-y-1">
          <div className="inline-flex p-2.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
            HEIST SUCCESSFUL!
          </h2>
          <p className="text-xs text-emerald-300">
            {target.name} VAULT INFILTRATED & EXFILTRATED
          </p>
        </div>

        {/* Loot Breakdown */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Direct Bounty
              </div>
              <div className="text-lg font-bold text-amber-400">
                +${bonusCredits.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-cyan-400" /> Stolen Vault Data
              </div>
              <div className="text-lg font-bold text-cyan-400">
                +{stolenGB} GB
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-400" /> Hacker XP
              </div>
              <div className="text-base font-bold text-purple-300">
                +{target.firewall * 150} XP
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Police Heat Added
              </div>
              <div className="text-base font-bold text-rose-400">
                +{target.heatGenerated}%
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                sound.playKeyClick();
                onOpenBroker();
              }}
              className="flex-1 py-2.5 px-3 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Database className="w-4 h-4" /> Sell Data ({stolenGB}GB)
            </button>
            <button
              onClick={() => {
                sound.playKeyClick();
                onOpenShop();
              }}
              className="flex-1 py-2.5 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" /> Hardware Shop
            </button>
            <button
              onClick={() => {
                sound.playKeyClick();
                onNextTarget();
              }}
              className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ArrowRight className="w-4 h-4" /> Next Target
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
