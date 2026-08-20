import React from 'react';
import { Target, PlayerStats } from '../types';
import { sound } from '../utils/audio';
import {
  Trophy,
  CheckCircle2,
  DollarSign,
  Database,
  ArrowRight,
  ShoppingBag,
  Award,
  Flame
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-mono overflow-y-auto"
    >
      <div className="w-full max-w-lg my-auto bg-neutral-950 border border-emerald-500/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.25)]">
        
        {/* Banner */}
        <div className="bg-emerald-950/80 border-b border-emerald-900/60 p-4 text-center">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-2 animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-400 tracking-wider">
            HEIST COMPLETED!
          </h2>
          <p className="text-xs text-emerald-300/80 font-bold uppercase tracking-widest mt-0.5">
            EXFILTRATION SUCCESSFUL
          </p>
        </div>

        {/* Details Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs text-neutral-400">Target Infiltrated:</p>
            <h3 className="text-base sm:text-lg font-bold text-white">{target.name}</h3>
            <span className="text-xs text-neutral-500">[{target.ip}]</span>
          </div>

          {/* Reward Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-cyan-400" /> Stolen Data
              </div>
              <div className="text-base sm:text-lg font-bold text-cyan-400">
                +{stolenGB} GB
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Direct Bounty
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-400">
                +${bonusCredits.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-400" /> Hacker XP
              </div>
              <div className="text-base sm:text-lg font-bold text-purple-400">
                +{target.firewall * 150} XP
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Heat Added
              </div>
              <div className="text-base sm:text-lg font-bold text-rose-400">
                +{target.heatGenerated}%
              </div>
            </div>
          </div>

          {/* Quick Action Navigation with 44px min height for mobile */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                sound.playKeyClick();
                onOpenBroker();
              }}
              className="flex-1 py-3 px-3 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.15)] min-h-[44px] active:scale-98"
            >
              <Database className="w-4 h-4" /> Sell Data ({stolenGB}GB)
            </button>
            <button
              onClick={() => {
                sound.playKeyClick();
                onOpenShop();
              }}
              className="flex-1 py-3 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.15)] min-h-[44px] active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" /> Darknet Shop
            </button>
            <button
              onClick={() => {
                sound.playKeyClick();
                onNextTarget();
              }}
              className="flex-1 py-3 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] min-h-[44px] active:scale-98"
            >
              <ArrowRight className="w-4 h-4" /> Next Target
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
