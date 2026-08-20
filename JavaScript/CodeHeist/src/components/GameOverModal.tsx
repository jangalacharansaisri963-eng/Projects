import React from 'react';
import { Target, PlayerStats } from '../types';
import { sound } from '../utils/audio';
import {
  Skull,
  AlertTriangle,
  RefreshCw,
  Flame,
  Radio,
  FileWarning,
  ShieldOff
} from 'lucide-react';

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
      id="game-over-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md font-mono overflow-y-auto"
    >
      <div className="w-full max-w-lg my-auto bg-neutral-950 border border-rose-600/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.3)]">
        
        {/* Banner */}
        <div className="bg-rose-950/80 border-b border-rose-900/60 p-4 text-center">
          <div className="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 mb-2 animate-bounce">
            <Skull className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-rose-400 tracking-wider">
            TRACEBACK DETECTED!
          </h2>
          <p className="text-xs text-rose-300/80 font-bold uppercase tracking-widest mt-0.5">
            FEDERAL FORENSICS INTRUSION
          </p>
        </div>

        {/* Details Content */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <FileWarning className="w-4 h-4" />
              <span>INCIDENT REPORT</span>
            </div>
            <p className="leading-relaxed">
              {reason || `Your connection to ${target.name} (${target.ip}) was backtraced by cyber authorities before decryption completed.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-400">Target</div>
              <div className="font-bold text-neutral-200 truncate">{target.name}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
              <div className="text-[10px] text-neutral-400">Heat Penalty</div>
              <div className="font-bold text-rose-400">+25% Heat</div>
            </div>
          </div>

          {isHardcore ? (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                HARDCORE MODE PERMADEATH:
              </span>
              <p>Rig seized, all credits wiped, scripts deleted by federal agents.</p>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400">
              <p>Police heat increased by +25%. Emergency proxy burnt to escape arrest.</p>
            </div>
          )}

          {/* Action buttons with min 44px height for mobile */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            {!isHardcore ? (
              <button
                id="btn-retry-heist"
                onClick={() => {
                  sound.playKeyClick();
                  onRetry();
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] min-h-[46px] active:scale-98"
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
                className="flex-1 py-3 px-4 rounded-lg bg-rose-600/30 border border-rose-500 text-rose-200 hover:bg-rose-600/40 text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[46px] active:scale-98"
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
