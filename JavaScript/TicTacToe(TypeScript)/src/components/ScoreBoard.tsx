import React from 'react';
import { motion } from 'motion/react';
import { PlayerSymbol, GameMode, AIDifficulty, GameStats } from '../types';
import { ThemeConfig } from '../utils/themes';
import { Zap } from 'lucide-react';

interface ScoreBoardProps {
  theme: ThemeConfig;
  turn: PlayerSymbol;
  mode: GameMode;
  difficulty: AIDifficulty;
  userSymbol: PlayerSymbol;
  stats: GameStats;
  isGameOver: boolean;
  winner: PlayerSymbol | null;
  isThinkingAI: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  theme,
  turn,
  mode,
  difficulty,
  userSymbol,
  stats,
  isGameOver,
  winner,
  isThinkingAI,
}) => {
  const getLabelX = () => {
    if (mode === 'pvp') return 'Player X';
    return userSymbol === 'X' ? 'Player (X)' : `AI (${difficulty})`;
  };

  const getLabelO = () => {
    if (mode === 'pvp') return 'Player O';
    return userSymbol === 'O' ? 'Player (O)' : `AI (${difficulty})`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3 px-2">
      {/* Current Turn Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isGameOver ? (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${theme.cardClass}`}>
              <span className={`w-2 h-2 rounded-full ${turn === 'X' ? 'bg-indigo-500' : 'bg-rose-500'} animate-pulse`} />
              <span>
                {isThinkingAI ? (
                  <span className="flex items-center gap-1 text-amber-400">
                    AI is thinking...
                  </span>
                ) : (
                  <span>
                    Turn: <span className={turn === 'X' ? theme.colorX : theme.colorO}>{turn}</span> ({turn === 'X' ? getLabelX() : getLabelO()})
                  </span>
                )}
              </span>
            </div>
          ) : (
            <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${theme.cardClass} text-emerald-400`}>
              {winner ? `Winner: ${winner}!` : "It's a Draw!"}
            </div>
          )}
        </div>

        {/* Win Streak Indicator */}
        {stats.currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>{stats.currentStreak} Win Streak!</span>
          </motion.div>
        )}
      </div>

      {/* Score Grid Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* X Score Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-3 rounded-2xl text-center border transition-all ${
            turn === 'X' && !isGameOver
              ? 'border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-lg'
              : 'border-slate-800/40'
          } ${theme.cardClass}`}
        >
          <div className="text-xs font-semibold text-indigo-400 truncate mb-0.5">
            {getLabelX()}
          </div>
          <div className={`text-xl sm:text-2xl font-black ${theme.colorX}`}>
            {mode === 'pvp' ? stats.pvpWinsX : userSymbol === 'X' ? stats.aiPlayerWins : stats.aiLosses}
          </div>
        </motion.div>

        {/* Draws Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-3 rounded-2xl text-center border border-slate-800/40 ${theme.cardClass}`}
        >
          <div className={`text-xs font-semibold ${theme.textSecondary} mb-0.5`}>
            Draws
          </div>
          <div className={`text-xl sm:text-2xl font-black ${theme.textPrimary}`}>
            {mode === 'pvp' ? stats.pvpDraws : stats.aiDraws}
          </div>
        </motion.div>

        {/* O Score Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-3 rounded-2xl text-center border transition-all ${
            turn === 'O' && !isGameOver
              ? 'border-rose-500/60 ring-2 ring-rose-500/20 shadow-lg'
              : 'border-slate-800/40'
          } ${theme.cardClass}`}
        >
          <div className="text-xs font-semibold text-rose-400 truncate mb-0.5">
            {getLabelO()}
          </div>
          <div className={`text-xl sm:text-2xl font-black ${theme.colorO}`}>
            {mode === 'pvp' ? stats.pvpWinsO : userSymbol === 'O' ? stats.aiPlayerWins : stats.aiLosses}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
