/**
 * Trophy & Achievements Modal with Player Level, XP Progression & Badges
 */

import React, { useState } from 'react';
import { Achievement, AchievementManager } from '../engine/achievements';
import {
  Trophy,
  X,
  Sparkles,
  Award,
  Crown,
  Flame,
  Zap,
  Lock,
  CheckCircle2,
  Filter,
  Star,
  Rocket,
  Shield,
  Palette,
  Camera,
  Layers,
  Target,
  Bomb,
  Gem,
  Boxes,
  Sliders,
} from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!isOpen) return null;

  const achievements = AchievementManager.getAchievements();
  const playerStats = AchievementManager.getPlayerLevel();
  const totalXP = AchievementManager.getTotalXP();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const unlockPercentage = Math.round((unlockedCount / achievements.length) * 100);

  const filteredList = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-900/50 text-purple-300 border-purple-500/40';
      case 'gold':
        return 'bg-amber-900/50 text-amber-300 border-amber-500/40';
      case 'silver':
        return 'bg-slate-700/50 text-slate-200 border-slate-400/40';
      default:
        return 'bg-amber-950/50 text-amber-500 border-amber-700/40';
    }
  };

  const renderIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-5 h-5 ${unlocked ? 'text-yellow-400' : 'text-slate-500'}` };
    switch (iconName) {
      case 'Rocket': return <Rocket {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Gem': return <Gem {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Bomb': return <Bomb {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Palette': return <Palette {...props} />;
      case 'Camera': return <Camera {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Boxes': return <Boxes {...props} />;
      case 'Sliders': return <Sliders {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-2xl shadow-black/90 flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto ring-1 ring-white/10 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-slate-100 font-mono flex items-center gap-2">
                TROPHY HALL & ACHIEVEMENTS
                <span className="text-[9px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30 uppercase font-semibold">
                  {unlockedCount} / {achievements.length} UNLOCKED ({unlockPercentage}%)
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Level Progression • XP Rewards • Global Badges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Level & XP Card */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-yellow-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-700 flex flex-col items-center justify-center shadow-lg border-2 border-yellow-300 flex-shrink-0 text-slate-950">
              <span className="text-[10px] font-mono font-bold leading-none uppercase">LVL</span>
              <span className="text-xl font-mono font-black leading-none">{playerStats.level}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{playerStats.title}</h3>
                <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded font-mono font-bold border border-yellow-400/30">
                  {totalXP} TOTAL XP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {playerStats.currentXP} / {playerStats.nextLevelXP} XP to Level {playerStats.level + 1}
              </p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="w-full sm:w-48 flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>PROGRESS</span>
              <span className="text-yellow-400 font-bold">{playerStats.progressPercent}%</span>
            </div>
            <div className="h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-500"
                style={{ width: `${playerStats.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                filter === 'all'
                  ? 'bg-yellow-500 text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ALL ({achievements.length})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                filter === 'unlocked'
                  ? 'bg-yellow-500 text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              UNLOCKED ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                filter === 'locked'
                  ? 'bg-yellow-500 text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              LOCKED ({achievements.length - unlockedCount})
            </button>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredList.map((a) => (
            <div
              key={a.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                a.unlocked
                  ? 'bg-slate-950/80 border-yellow-500/30 hover:border-yellow-400/60 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                  a.unlocked
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {a.unlocked ? renderIcon(a.icon, true) : <Lock className="w-4 h-4 text-slate-600" />}
              </div>

              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white font-mono truncate">{a.title}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono font-bold ${getTierBadge(
                      a.tier
                    )}`}
                  >
                    +{a.xp} XP
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {a.description}
                </p>

                {a.unlocked && a.unlockedAt && (
                  <span className="text-[9px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked on {a.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between font-mono text-[10px]">
          <span className="text-slate-500">Play games, trigger combos & create sprites to unlock badges</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
