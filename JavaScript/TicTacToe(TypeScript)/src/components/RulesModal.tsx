import React from 'react';
import { motion } from 'motion/react';
import { ThemeConfig } from '../utils/themes';
import { X, CheckCircle2, HelpCircle } from 'lucide-react';

interface RulesModalProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ theme, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative max-h-[85vh] overflow-y-auto ${theme.cardClass}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">How to Play</h2>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Objective</span>
            </div>
            <p className={theme.textSecondary}>
              Be the first player to get 3 of your symbols in a row (horizontally, vertically, or diagonally).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Game Modes</span>
            </div>
            <ul className={`list-disc list-inside space-y-1 ${theme.textSecondary}`}>
              <li><strong className="text-slate-200">vs AI Computer:</strong> Play single player against Easy, Medium, or Unbeatable Minimax AI.</li>
              <li><strong className="text-slate-200">2 Players:</strong> Pass and play locally with a friend on the same device.</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Grid Variations</span>
            </div>
            <p className={theme.textSecondary}>
              • <strong>3x3 Board:</strong> Get 3 in a row.<br />
              • <strong>4x4 & 5x5 Boards:</strong> Get 4 in a row to win!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Pro Controls</span>
            </div>
            <p className={theme.textSecondary}>
              Use Arrow Keys to navigate grid cells and press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">Enter</kbd> or <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">Space</kbd> to place your mark!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold ${theme.accent}`}
        >
          Got It!
        </button>
      </motion.div>
    </div>
  );
};
