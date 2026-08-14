import React, { useEffect } from 'react';
import { SpiralNotepad } from './SpiralNotepad';
import { GameStats, Difficulty } from '../types';
import { RotateCcw, Home, Star, Trophy, Clock, Zap } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface GameOverModalProps {
  isOpen: boolean;
  isWin: boolean;
  stats: GameStats;
  difficulty: Difficulty;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isWin,
  stats,
  difficulty,
  onRestart,
  onHome,
}) => {
  useEffect(() => {
    if (isOpen && isWin) {
      sound.playWin();
      // Burst celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffb326', '#40c416', '#38bdf8', '#ff5252', '#a855f7'],
        });
      } catch {
        // ignore
      }
    } else if (isOpen && !isWin) {
      sound.playGameOver();
    }
  }, [isOpen, isWin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm transform transition-all scale-100">
        <SpiralNotepad ringCount={7} className="shadow-2xl py-6 px-6">
          {/* Main Status Emoji */}
          <div className="relative my-2 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 p-1 shadow-lg flex items-center justify-center border-4 border-white">
              <span className="text-4xl sm:text-5xl select-none">
                {isWin ? '😄' : '😢'}
              </span>
            </div>
          </div>

          {/* Heading Text */}
          <h2 className="text-3xl sm:text-4xl font-game font-extrabold text-slate-800 tracking-wider mt-1 text-center">
            {isWin ? 'PERFECT!' : "TIME'S UP!"}
          </h2>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">
            {difficulty} MODE • {isWin ? 'Puzzle Solved!' : 'Try Again!'}
          </p>

          {/* Star Rating for Victory */}
          {isWin && (
            <div className="flex items-center justify-center gap-2 my-3">
              {[1, 2, 3].map((starNum) => {
                const filled = starNum <= stats.stars;
                return (
                  <div
                    key={starNum}
                    className={`transform transition-all duration-300 ${
                      filled ? 'scale-110 text-amber-400 drop-shadow-md' : 'text-slate-300'
                    }`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 ${
                        filled ? 'fill-amber-400' : 'fill-slate-200'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Stats Breakdown Card */}
          <div className="w-full bg-sky-50 rounded-2xl p-3.5 my-3 border border-sky-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Zap className="w-4 h-4 text-amber-500" /> Moves:
              </span>
              <span className="font-game text-base text-slate-800">{stats.moves}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-4 h-4 text-sky-500" /> Time Remaining:
              </span>
              <span className="font-game text-base text-slate-800">{stats.timeLeft}s</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 pt-1 border-t border-sky-200/60">
              <span className="flex items-center gap-1.5 text-amber-700 font-bold">
                <Trophy className="w-4 h-4 text-amber-500" /> Total Score:
              </span>
              <span className="font-game text-lg text-amber-600">{stats.score} pts</span>
            </div>
          </div>

          {/* Action Buttons (Restart & Home) as seen in screenshot */}
          <div className="flex items-center justify-center gap-6 mt-4 w-full">
            {/* Restart / Play Again Button (Green with circular arrow icon) */}
            <button
              id="game-modal-restart-btn"
              onClick={() => {
                sound.playClick();
                onRestart();
              }}
              title="Play Again"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white btn-glossy-green cursor-pointer"
            >
              <RotateCcw className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            </button>

            {/* Home / Menu Button (Red with house icon) */}
            <button
              id="game-modal-home-btn"
              onClick={() => {
                sound.playClick();
                onHome();
              }}
              title="Return to Menu"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white btn-glossy-red cursor-pointer"
            >
              <Home className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
            </button>
          </div>
        </SpiralNotepad>
      </div>
    </div>
  );
};
