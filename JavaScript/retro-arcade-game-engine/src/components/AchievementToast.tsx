/**
 * In-Game Animated Achievement Unlock Toast Notification
 */

import React, { useEffect, useState } from 'react';
import { Achievement, AchievementManager } from '../engine/achievements';
import { Award, Trophy, Crown, Sparkles, Zap, Flame, Rocket, Star } from 'lucide-react';

export const AchievementToast: React.FC = () => {
  const [currentToast, setCurrentToast] = useState<Achievement | null>(null);

  useEffect(() => {
    const unsubscribe = AchievementManager.subscribe((achievement) => {
      setCurrentToast(achievement);
      const timer = setTimeout(() => {
        setCurrentToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!currentToast) return null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'from-purple-600 via-pink-500 to-indigo-600 border-purple-400 text-purple-200';
      case 'gold':
        return 'from-amber-600 via-yellow-500 to-amber-700 border-yellow-400 text-amber-200';
      case 'silver':
        return 'from-slate-400 via-slate-300 to-slate-500 border-slate-300 text-slate-100';
      default:
        return 'from-amber-800 via-amber-700 to-amber-900 border-amber-600 text-amber-100';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 duration-300 max-w-sm pointer-events-auto">
      <div className="bg-slate-950/95 border-2 border-yellow-400/80 rounded-xl p-3.5 shadow-2xl shadow-yellow-500/20 backdrop-blur-md flex items-center gap-3.5 ring-1 ring-white/10 font-sans">
        {/* Animated Badge Icon */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTierColor(
            currentToast.tier
          )} border flex items-center justify-center shadow-lg flex-shrink-0 animate-bounce`}
        >
          <Trophy className="w-6 h-6 text-white drop-shadow-md" />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between gap-1 font-mono">
            <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" /> ACHIEVEMENT UNLOCKED!
            </span>
            <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded font-bold border border-yellow-400/30">
              +{currentToast.xp} XP
            </span>
          </div>

          <h4 className="text-sm font-bold text-white tracking-wide truncate mt-0.5 font-mono">
            {currentToast.title}
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5 font-sans">
            {currentToast.description}
          </p>
        </div>
      </div>
    </div>
  );
};
