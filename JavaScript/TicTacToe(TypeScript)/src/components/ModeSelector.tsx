import React from 'react';
import { GameMode, AIDifficulty, PlayerSymbol, BoardSize } from '../types';
import { ThemeConfig } from '../utils/themes';
import { Users, Bot, Sliders, ShieldAlert, Sparkles, Brain } from 'lucide-react';

interface ModeSelectorProps {
  theme: ThemeConfig;
  mode: GameMode;
  difficulty: AIDifficulty;
  userSymbol: PlayerSymbol;
  boardSize: BoardSize;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (diff: AIDifficulty) => void;
  onSymbolChange: (sym: PlayerSymbol) => void;
  onBoardSizeChange: (size: BoardSize) => void;
  disabled: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  theme,
  mode,
  difficulty,
  userSymbol,
  boardSize,
  onModeChange,
  onDifficultyChange,
  onSymbolChange,
  onBoardSizeChange,
  disabled,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const getDifficultyInfo = (diff: AIDifficulty) => {
    switch (diff) {
      case 'easy':
        return {
          label: 'Casual Novice',
          desc: 'Plays casually with frequent mistakes. Great for beginners!',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        };
      case 'medium':
        return {
          label: 'Tactical Competitor',
          desc: 'Blocks immediate winning lines and takes strategic positions.',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        };
      case 'hard':
        return {
          label: 'Unbeatable Minimax',
          desc: '100% Optimal Alpha-Beta Minimax. Mathematically impossible to defeat on 3x3!',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        };
    }
  };

  const diffInfo = getDifficultyInfo(difficulty);

  return (
    <div className={`w-full max-w-md mx-auto p-3 rounded-2xl ${theme.cardClass} space-y-3 shadow-xl backdrop-blur-md`}>
      {/* Primary Mode Tabs (1 Player vs 2 Player) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-800/50">
        <button
          disabled={disabled}
          onClick={() => onModeChange('ai')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            mode === 'ai'
              ? `${theme.accent} shadow-md`
              : `${theme.textSecondary} hover:${theme.textPrimary}`
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Bot className="w-4 h-4" />
          <span>vs AI Computer</span>
        </button>

        <button
          disabled={disabled}
          onClick={() => onModeChange('pvp')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            mode === 'pvp'
              ? `${theme.accent} shadow-md`
              : `${theme.textSecondary} hover:${theme.textPrimary}`
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Users className="w-4 h-4" />
          <span>2 Players (Pass & Play)</span>
        </button>
      </div>

      {/* AI Controls (If AI Mode is active) */}
      {mode === 'ai' && (
        <div className="space-y-2 pt-1 border-t border-slate-800/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <span className={`text-[11px] font-semibold ${theme.textSecondary} mr-1 flex items-center gap-1`}>
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                Level:
              </span>
              {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  disabled={disabled}
                  onClick={() => onDifficultyChange(diff)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    difficulty === diff
                      ? diff === 'hard'
                        ? 'bg-rose-600 text-white shadow-md ring-1 ring-rose-400/50'
                        : diff === 'medium'
                        ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-400/50'
                        : 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400/50'
                      : `bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70`
                  }`}
                >
                  {diff === 'hard' ? 'Unbeatable' : diff}
                </button>
              ))}
            </div>

            {/* Symbol Choice */}
            <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
              <span className={`text-[11px] font-semibold ${theme.textSecondary} mr-1`}>
                Play as:
              </span>
              {(['X', 'O'] as PlayerSymbol[]).map((sym) => (
                <button
                  key={sym}
                  disabled={disabled}
                  onClick={() => onSymbolChange(sym)}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                    userSymbol === sym
                      ? sym === 'X'
                        ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400'
                        : 'bg-rose-600 text-white shadow-md ring-1 ring-rose-400'
                      : 'bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* AI Strategy Description Badge */}
          <div
            className={`p-2 rounded-xl text-[11px] border flex items-center justify-between gap-2 ${diffInfo.color}`}
          >
            <div className="flex items-center gap-1.5">
              {difficulty === 'hard' ? (
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-400 animate-pulse" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              )}
              <span className="font-semibold">{diffInfo.desc}</span>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings Toggle (Board Grid Size) */}
      <div className="flex items-center justify-between pt-1 text-[11px]">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1 font-semibold ${theme.textSecondary} hover:${theme.textPrimary} transition-colors`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Board Options' : 'Board Grid Options'}</span>
        </button>

        {showAdvanced && (
          <div className="flex items-center gap-1">
            <span className={`font-semibold ${theme.textSecondary} mr-1`}>
              Grid Size:
            </span>
            {([3, 4, 5] as BoardSize[]).map((size) => (
              <button
                key={size}
                disabled={disabled}
                onClick={() => onBoardSizeChange(size)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  boardSize === size
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {size}x{size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
