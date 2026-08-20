import React from 'react';
import { Target, PlayerStats } from '../types';
import { sound } from '../utils/audio';
import { ShieldAlert, RefreshCw, Skull, AlertOctagon, Terminal } from 'lucide-react';

interface GameOverModalProps {
  target: Target;
  playerStats: PlayerStats;
  reason: string;
  onRetry: () => void;
  onNewCareer: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  target,
  playerStats,
  reason,
  onRetry,
  onNewCareer
}) => {
  const isHardcore = playerStats.gameMode === 'hardcore';

  return (
    <div
      id="gameover-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md font-mono"
    >
      <div className="w-full max-w-lg bg-neutral-950 border border-rose-600/60 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.3)]">
        {/* Red Alert Header */}
        <div className="p-4 bg-rose-950/80 border-b border-rose-800/80 text-center space-y-1">
          <div className="inline-flex p-2.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <Skull className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
            TRACEBACK! GAME OVER
          </h2>
          <p className="text-xs text-rose-300">
            FEDERAL CYBER FORENSICS TRACED YOUR IP ADDRESS
          </p>
        </div>

        {/* Forensic Report */}
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Target:</span>
              <strong className="text-white">{target.name} ({target.ip})</strong>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Firewall Layer:</span>
              <strong className="text-rose-400">Level {target.firewall}</strong>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Cause:</span>
              <span className="text-rose-300 font-semibold">{reason}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Game Mode:</span>
              <span className="text-amber-400 font-bold uppercase">{playerStats.gameMode}</span>
            </div>
          </div>

          {isHardcore ? (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" /> PERMADEATH ENFORCED
              </div>
              <p>Your hardware, rigs, and credit balance have been confiscated by cyber squads.</p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> TRACEBACK PENALTY
              </div>
              <p>Police heat increased by +25%. Emergency proxy burnt to escape arrest.</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            {!isHardcore ? (
              <button
                id="btn-retry-heist"
                onClick={() => {
                  sound.playKeyClick();
                  onRetry();
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" /> RETRY WITH CLEAN IP
              </button>
            ) : (
              <button
                id="btn-new-career"
                onClick={() => {
                  sound.playKeyClick();
                  onNewCareer();
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600/30 border border-rose-500 text-rose-200 hover:bg-rose-600/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Skull className="w-4 h-4" /> START NEW SCRIPT KIDDIE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
