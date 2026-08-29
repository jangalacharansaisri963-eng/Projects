/**
 * High Scores Leaderboard Modal with Offline Persistence
 */

import React, { useState } from 'react';
import { StorageManager } from '../engine/storage';
import { ArcadeGameMode, HighScoreRecord } from '../engine/types';
import { Trophy, X, Flame, Shield, Award, Calendar } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGameMode: ArcadeGameMode;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, currentGameMode }) => {
  const [selectedMode, setSelectedMode] = useState<ArcadeGameMode>(currentGameMode);
  const scores: HighScoreRecord[] = StorageManager.getHighScores(selectedMode);
  const stats = StorageManager.getStats();

  if (!isOpen) return null;

  const modeLabels: Record<ArcadeGameMode, string> = {
    shmup: '🚀 CYBER STRIKE 1984',
    brick_breaker: '🧱 NEON BRICK BREAKER',
    platformer: '🗡️ NEON KNIGHT',
    tank_arena: '🛡️ TANK ARENA 2D',
    sandbox: '🧪 PHYSICS SANDBOX',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/70 rounded-xl p-5 shadow-2xl shadow-black/80 flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold tracking-wider text-amber-400 font-mono">
              HALL OF FAME • HIGH SCORES
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Mode Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          {(['shmup', 'brick_breaker', 'platformer', 'tank_arena'] as ArcadeGameMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-2 py-1.5 rounded-md text-[10px] font-mono font-bold truncate transition ${
                selectedMode === mode
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {mode === 'shmup'
                ? 'SHMUP'
                : mode === 'brick_breaker'
                ? 'BRICK'
                : mode === 'platformer'
                ? 'KNIGHT'
                : 'TANK'}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-inner">
          <div className="grid grid-cols-12 bg-slate-900/90 px-3 py-2 text-[10px] font-mono text-slate-400 font-bold border-b border-slate-800">
            <span className="col-span-2">RANK</span>
            <span className="col-span-3">PLAYER</span>
            <span className="col-span-4 text-right">SCORE</span>
            <span className="col-span-3 text-right">DETAILS</span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto">
            {scores.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-slate-500">
                NO RECORDED SCORES YET. BE THE FIRST!
              </div>
            ) : (
              scores.map((rec, idx) => (
                <div
                  key={rec.id || idx}
                  className={`grid grid-cols-12 px-3 py-2 text-xs font-mono items-center transition ${
                    idx === 0
                      ? 'bg-amber-500/10 text-amber-300 font-bold'
                      : idx === 1
                      ? 'bg-slate-400/10 text-slate-200'
                      : idx === 2
                      ? 'bg-orange-500/10 text-orange-300'
                      : 'text-slate-300 hover:bg-slate-900/50'
                  }`}
                >
                  <span className="col-span-2 flex items-center gap-1 font-bold">
                    {idx === 0 ? '🥇 1ST' : idx === 1 ? '🥈 2ND' : idx === 2 ? '🥉 3RD' : `#${idx + 1}`}
                  </span>
                  <span className="col-span-3 text-sky-400 font-bold tracking-wider">{rec.name}</span>
                  <span className="col-span-4 text-right font-mono font-bold text-amber-400">
                    {rec.score.toLocaleString()}
                  </span>
                  <span className="col-span-3 text-right text-[10px] text-slate-400 truncate">
                    {rec.extraStats || rec.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global Lifetime Stats */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-sky-400" /> PLAYER LIFETIME PROFILE (LOCAL)
          </span>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-slate-900/90 p-2 rounded-md border border-slate-800">
              <span className="text-[9px] text-slate-500 block">TOTAL SCORE</span>
              <span className="text-xs font-bold text-amber-400">{stats.totalScore.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-md border border-slate-800">
              <span className="text-[9px] text-slate-500 block">ENEMIES DESTROYED</span>
              <span className="text-xs font-bold text-rose-400">{stats.enemiesDefeated}</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-md border border-slate-800">
              <span className="text-[9px] text-slate-500 block">MAX COMBO</span>
              <span className="text-xs font-bold text-sky-400">{stats.highestCombo}X</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
