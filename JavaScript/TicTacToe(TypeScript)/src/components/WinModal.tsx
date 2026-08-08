import React from 'react';
import { motion } from 'motion/react';
import { PlayerSymbol, GameMode, AIDifficulty } from '../types';
import { ThemeConfig } from '../utils/themes';
import { Trophy, RefreshCw, RotateCcw, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WinModalProps {
  theme: ThemeConfig;
  winner: PlayerSymbol | null;
  isDraw: boolean;
  mode: GameMode;
  difficulty: AIDifficulty;
  userSymbol: PlayerSymbol;
  onRematch: () => void;
  onReview: () => void;
  isOpen: boolean;
}

export const WinModal: React.FC<WinModalProps> = ({
  theme,
  winner,
  isDraw,
  mode,
  difficulty,
  userSymbol,
  onRematch,
  onReview,
  isOpen,
}) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && winner) {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#818cf8', '#f43f5e', '#22d3ee', '#34d399', '#fbbf24'],
        });
      } catch {
        // Fallback if confetti fails
      }
    }
  }, [isOpen, winner]);

  if (!isOpen) return null;

  const getWinnerTitle = () => {
    if (isDraw) return "It's a Draw!";
    if (mode === 'pvp') return `Player ${winner} Wins!`;
    if (winner === userSymbol) return 'You Won!';
    return `AI (${difficulty}) Won!`;
  };

  const handleShare = () => {
    const text = isDraw
      ? `We played Tic Tac Toe and it ended in a draw! ⚔️`
      : `I just ${
          winner === userSymbol ? 'defeated the AI' : 'played Tic Tac Toe'
        } on Tic Tac Toe! 🎮`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`w-full max-w-sm rounded-3xl p-6 border text-center shadow-2xl ${theme.cardClass}`}
      >
        {/* Top Trophy Icon or Draw Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-500/20">
          {isDraw ? (
            <RotateCcw className="w-8 h-8" />
          ) : (
            <Trophy className="w-8 h-8" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black tracking-tight mb-1">
          {getWinnerTitle()}
        </h2>

        {/* Subtitle */}
        <p className={`text-xs ${theme.textSecondary} mb-6`}>
          {isDraw
            ? 'Both players played brilliantly. Well matched!'
            : winner === 'X'
            ? 'X performed flawless tactics this round!'
            : 'O executed a brilliant line to claim victory!'}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onRematch}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${theme.accent} shadow-lg active:scale-95`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReview}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${theme.cardClass} hover:bg-slate-800/80`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Review Moves</span>
            </button>

            <button
              onClick={handleShare}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${theme.cardClass} hover:bg-slate-800/80`}
            >
              <Share2 className="w-3.5 h-3.5 text-rose-400" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
