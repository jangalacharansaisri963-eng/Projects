import React from 'react';
import { GameStats } from '../types/game';
import { 
  RotateCcw, 
  Wrench, 
  Coins, 
  Trophy, 
  Flame, 
  Gauge, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  stats: GameStats;
  reason: string;
  onRestart: () => void;
  onOpenGarage: () => void;
  bestDistance: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  stats,
  reason,
  onRestart,
  onOpenGarage,
  bestDistance,
}) => {
  if (!isOpen) return null;

  const isNewRecord = stats.distance > bestDistance && stats.distance > 0;

  return (
    <div id="game-over-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Crash Icon & Banner */}
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border-2 border-red-500 flex items-center justify-center mb-3 shadow-red-500/30 shadow-lg">
          <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
        </div>

        <h2 className="text-3xl font-display text-white tracking-wide">VEHICLE WRECKED</h2>
        <p className="text-xs text-red-400 font-semibold mt-1 uppercase tracking-wider">{reason}</p>

        {/* New Record Banner */}
        {isNewRecord && (
          <div className="my-3 px-4 py-1.5 bg-amber-500/20 border border-amber-400 rounded-full flex items-center gap-2 text-amber-300 text-xs font-bold animate-bounce">
            <Trophy className="w-4 h-4" /> NEW DISTANCE RECORD!
          </div>
        )}

        {/* Run Performance Grid */}
        <div className="w-full grid grid-cols-2 gap-3 my-5">
          <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">DISTANCE</span>
            <span className="text-xl font-display text-white font-mono-race mt-0.5">
              {stats.distance} <span className="text-xs text-zinc-400">m</span>
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">CASH EARNED</span>
            <span className="text-xl font-display text-amber-400 font-mono-race mt-0.5 flex items-center gap-1">
              <Coins className="w-4 h-4" /> +${stats.coinsEarned}
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">TOP SPEED</span>
            <span className="text-xl font-display text-cyan-400 font-mono-race mt-0.5 flex items-center gap-1">
              <Gauge className="w-4 h-4" /> {stats.topSpeedReached} <span className="text-xs">km/h</span>
            </span>
          </div>

          <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">CLOSE CALLS</span>
            <span className="text-xl font-display text-blue-400 font-mono-race mt-0.5 flex items-center gap-1">
              <Zap className="w-4 h-4" /> {stats.nearMisses}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-display text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-5 h-5" /> PLAY AGAIN
          </button>

          <button
            onClick={onOpenGarage}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-cyan-400" /> UPGRADE IN GARAGE
          </button>
        </div>
      </div>
    </div>
  );
};
