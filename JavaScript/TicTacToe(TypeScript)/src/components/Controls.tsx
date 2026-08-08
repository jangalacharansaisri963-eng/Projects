import React from 'react';
import { RotateCcw, Undo2, Play, History, Trash2 } from 'lucide-react';
import { ThemeConfig } from '../utils/themes';

interface ControlsProps {
  theme: ThemeConfig;
  onRestart: () => void;
  onUndo: () => void;
  onToggleHistory: () => void;
  onResetScores: () => void;
  canUndo: boolean;
  hasMoveHistory: boolean;
  showHistory: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  theme,
  onRestart,
  onUndo,
  onToggleHistory,
  onResetScores,
  canUndo,
  hasMoveHistory,
  showHistory,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-between gap-2 px-2">
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
          theme.cardClass
        } ${
          canUndo
            ? 'hover:bg-slate-800/80 active:scale-95'
            : 'opacity-40 cursor-not-allowed'
        }`}
      >
        <Undo2 className="w-4 h-4 text-slate-400" />
        <span>Undo</span>
      </button>

      {/* Restart / New Match Button */}
      <button
        onClick={onRestart}
        className={`flex-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${theme.accent} active:scale-95 shadow-md`}
      >
        <RotateCcw className="w-4 h-4" />
        <span>New Match</span>
      </button>

      {/* History Log Toggle */}
      <button
        onClick={onToggleHistory}
        disabled={!hasMoveHistory}
        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
          theme.cardClass
        } ${
          hasMoveHistory
            ? 'hover:bg-slate-800/80 active:scale-95'
            : 'opacity-40 cursor-not-allowed'
        } ${showHistory ? 'ring-2 ring-indigo-500' : ''}`}
      >
        <History className="w-4 h-4 text-indigo-400" />
        <span>History</span>
      </button>
    </div>
  );
};
