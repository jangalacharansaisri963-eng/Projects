import React from 'react';
import { Move, BoardSize } from '../types';
import { ThemeConfig } from '../utils/themes';
import { indexToCoords } from '../utils/gameLogic';
import { Play, Pause, ChevronRight, History } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
  boardSize: BoardSize;
  theme: ThemeConfig;
  onSelectMoveStep?: (stepIndex: number) => void;
  activeStep?: number;
  isReplaying?: boolean;
  onToggleReplay?: () => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  boardSize,
  theme,
  onSelectMoveStep,
  activeStep,
  isReplaying,
  onToggleReplay,
}) => {
  if (moves.length === 0) return null;

  return (
    <div className={`w-full max-w-md mx-auto p-3 rounded-2xl ${theme.cardClass} space-y-2`}>
      <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span>Move History ({moves.length})</span>
        </div>

        {onToggleReplay && (
          <button
            onClick={onToggleReplay}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isReplaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isReplaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Replay Match</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {moves.map((m, idx) => {
          const coords = indexToCoords(m.index, boardSize);
          const isCurrent = activeStep === idx + 1;

          return (
            <button
              key={idx}
              onClick={() => onSelectMoveStep && onSelectMoveStep(idx + 1)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                isCurrent
                  ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'hover:bg-slate-800/50 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-60 w-5">#{idx + 1}</span>
                <span
                  className={`font-black ${
                    m.player === 'X' ? theme.colorX : theme.colorO
                  }`}
                >
                  {m.player}
                </span>
                <span>
                  Row {coords.row}, Col {coords.col}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-40" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
