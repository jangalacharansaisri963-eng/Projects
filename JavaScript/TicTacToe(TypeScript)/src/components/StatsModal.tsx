import React from 'react';
import { motion } from 'motion/react';
import { GameStats } from '../types';
import { ThemeConfig } from '../utils/themes';
import { X, BarChart3, Trophy, Flame, RotateCcw, Trash2 } from 'lucide-react';

interface StatsModalProps {
  theme: ThemeConfig;
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  theme,
  stats,
  isOpen,
  onClose,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const totalAIGames = stats.aiPlayerWins + stats.aiLosses + stats.aiDraws;
  const aiWinRate = totalAIGames > 0 ? Math.round((stats.aiPlayerWins / totalAIGames) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative ${theme.cardClass}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">Lifetime Game Stats</h2>
        </div>

        <div className="space-y-3">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total Played</div>
              <div className="text-xl font-black text-indigo-400">{stats.totalGames}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">AI Win Rate</div>
              <div className="text-xl font-black text-emerald-400">{aiWinRate}%</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Best Streak</div>
              <div className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{stats.bestStreak}</span>
              </div>
            </div>
          </div>

          {/* AI Mode Detailed Stats */}
          <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/40 space-y-2">
            <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>vs AI Computer Record</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-800/40">
                <span className="block text-emerald-400 font-bold">{stats.aiPlayerWins}</span>
                <span className="text-[10px] text-slate-400">Wins</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/40">
                <span className="block text-rose-400 font-bold">{stats.aiLosses}</span>
                <span className="text-[10px] text-slate-400">Losses</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/40">
                <span className="block text-slate-300 font-bold">{stats.aiDraws}</span>
                <span className="text-[10px] text-slate-400">Draws</span>
              </div>
            </div>
          </div>

          {/* PvP Mode Detailed Stats */}
          <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/40 space-y-2">
            <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>2-Player Local Record</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-800/40">
                <span className="block text-indigo-400 font-bold">{stats.pvpWinsX}</span>
                <span className="text-[10px] text-slate-400">X Wins</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/40">
                <span className="block text-slate-300 font-bold">{stats.pvpDraws}</span>
                <span className="text-[10px] text-slate-400">Draws</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/40">
                <span className="block text-rose-400 font-bold">{stats.pvpWinsO}</span>
                <span className="text-[10px] text-slate-400">O Wins</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={onResetStats}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>

          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${theme.accent}`}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
