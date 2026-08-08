import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardSize,
  BoardValue,
  GameMode,
  AIDifficulty,
  PlayerSymbol,
  Move,
  WinningLine,
  ThemeMode,
  GameStats,
} from './types';
import { THEMES } from './utils/themes';
import { checkGameResult, indexToCoords } from './utils/gameLogic';
import { getAIMove } from './utils/minimax';
import { soundManager } from './utils/sound';

import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { ModeSelector } from './components/ModeSelector';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { MoveHistory } from './components/MoveHistory';
import { WinModal } from './components/WinModal';
import { RulesModal } from './components/RulesModal';
import { StatsModal } from './components/StatsModal';

const INITIAL_STATS: GameStats = {
  pvpWinsX: 0,
  pvpWinsO: 0,
  pvpDraws: 0,
  aiPlayerWins: 0,
  aiLosses: 0,
  aiDraws: 0,
  totalGames: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export default function App() {
  // --- Persistent Settings & Stats ---
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('xo_theme') as ThemeMode) || 'dark';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('xo_sound') !== 'false';
  });

  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('xo_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  // --- Game Settings ---
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [mode, setMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('hard');
  const [userSymbol, setUserSymbol] = useState<PlayerSymbol>('X');

  // --- Board State ---
  const [board, setBoard] = useState<BoardValue[]>(() =>
    Array(3 * 3).fill(null)
  );
  const [turn, setTurn] = useState<PlayerSymbol>('X');
  const [moves, setMoves] = useState<Move[]>([]);
  const [lastMoveIndex, setLastMoveIndex] = useState<number | null>(null);

  // --- Game Status ---
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<PlayerSymbol | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isThinkingAI, setIsThinkingAI] = useState<boolean>(false);

  // --- Modals & Views ---
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // --- Replay Mode ---
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [activeReplayStep, setActiveReplayStep] = useState<number | null>(null);
  const replayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const theme = THEMES[themeMode] || THEMES.dark;

  // Sync sound setting with soundManager
  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
    localStorage.setItem('xo_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('xo_theme', themeMode);
  }, [themeMode]);

  // Sync stats
  useEffect(() => {
    localStorage.setItem('xo_stats', JSON.stringify(stats));
  }, [stats]);

  // --- Reset Match ---
  const resetMatch = useCallback(
    (newBoardSize = boardSize) => {
      setBoard(Array(newBoardSize * newBoardSize).fill(null));
      setTurn('X');
      setMoves([]);
      setLastMoveIndex(null);
      setIsGameOver(false);
      setWinner(null);
      setWinningLine(null);
      setIsDraw(false);
      setIsThinkingAI(false);
      setShowWinModal(false);
      setIsReplaying(false);
      setActiveReplayStep(null);
      if (replayTimerRef.current) clearInterval(replayTimerRef.current);
    },
    [boardSize]
  );

  // Change Board Size
  const handleBoardSizeChange = (newSize: BoardSize) => {
    setBoardSize(newSize);
    resetMatch(newSize);
  };

  // Change Game Mode
  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    resetMatch();
  };

  // Change Difficulty
  const handleDifficultyChange = (newDiff: AIDifficulty) => {
    setDifficulty(newDiff);
    resetMatch();
  };

  // Change Player Symbol
  const handleSymbolChange = (newSym: PlayerSymbol) => {
    setUserSymbol(newSym);
    resetMatch();
  };

  // --- Execute Move ---
  const makeMove = useCallback(
    (index: number, player: PlayerSymbol) => {
      if (board[index] !== null || isGameOver) return;

      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      setLastMoveIndex(index);

      // Record move
      const coords = indexToCoords(index, boardSize);
      const newMove: Move = {
        index,
        row: coords.row,
        col: coords.col,
        player,
        timestamp: Date.now(),
      };
      const updatedMoves = [...moves, newMove];
      setMoves(updatedMoves);

      // Play move sound
      soundManager.playMove(player);

      // Check result
      const result = checkGameResult(newBoard, boardSize);

      if (result.winner) {
        setIsGameOver(true);
        setWinner(result.winner);
        setWinningLine(result.winningLine);
        soundManager.playWin();

        // Update stats
        setStats((prev) => {
          let pvpWinsX = prev.pvpWinsX;
          let pvpWinsO = prev.pvpWinsO;
          let aiPlayerWins = prev.aiPlayerWins;
          let aiLosses = prev.aiLosses;

          let newStreak = prev.currentStreak;

          if (mode === 'pvp') {
            if (result.winner === 'X') pvpWinsX++;
            else pvpWinsO++;
          } else {
            if (result.winner === userSymbol) {
              aiPlayerWins++;
              newStreak++;
            } else {
              aiLosses++;
              newStreak = 0;
            }
          }

          const bestStreak = Math.max(prev.bestStreak, newStreak);

          return {
            ...prev,
            pvpWinsX,
            pvpWinsO,
            aiPlayerWins,
            aiLosses,
            totalGames: prev.totalGames + 1,
            currentStreak: newStreak,
            bestStreak,
          };
        });

        setTimeout(() => setShowWinModal(true), 600);
      } else if (result.isDraw) {
        setIsGameOver(true);
        setIsDraw(true);
        soundManager.playDraw();

        setStats((prev) => ({
          ...prev,
          pvpDraws: mode === 'pvp' ? prev.pvpDraws + 1 : prev.pvpDraws,
          aiDraws: mode === 'ai' ? prev.aiDraws + 1 : prev.aiDraws,
          totalGames: prev.totalGames + 1,
          currentStreak: 0,
        }));

        setTimeout(() => setShowWinModal(true), 600);
      } else {
        // Toggle turn
        setTurn(player === 'X' ? 'O' : 'X');
      }
    },
    [board, boardSize, isGameOver, mode, moves, userSymbol]
  );

  // --- AI Turn Handler ---
  useEffect(() => {
    if (mode !== 'ai' || isGameOver || turn === userSymbol) {
      setIsThinkingAI(false);
      return;
    }

    setIsThinkingAI(true);

    const timer = setTimeout(() => {
      const aiSymbol: PlayerSymbol = userSymbol === 'X' ? 'O' : 'X';
      const aiMoveIndex = getAIMove(board, aiSymbol, difficulty, boardSize);

      if (aiMoveIndex !== -1) {
        makeMove(aiMoveIndex, aiSymbol);
      }
      setIsThinkingAI(false);
    }, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, mode, isGameOver, userSymbol, boardSize, difficulty]);

  // --- Cell Click Handler ---
  const handleCellClick = (index: number) => {
    if (isGameOver || isThinkingAI || isReplaying) return;
    if (mode === 'ai' && turn !== userSymbol) return;

    makeMove(index, turn);
  };

  // --- Undo Handler ---
  const handleUndo = () => {
    if (moves.length === 0 || isReplaying) return;

    soundManager.playClick();

    // Determine how many steps to pop
    let stepsToPop = 1;
    if (mode === 'ai') {
      // In AI mode, pop 2 moves if last move was AI, or 1 if human played last
      const lastMove = moves[moves.length - 1];
      if (lastMove.player !== userSymbol && moves.length >= 2) {
        stepsToPop = 2;
      }
    }

    const newMoves = moves.slice(0, moves.length - stepsToPop);
    setMoves(newMoves);

    // Reconstruct board from moves
    const newBoard = Array(boardSize * boardSize).fill(null);
    newMoves.forEach((m) => {
      newBoard[m.index] = m.player;
    });

    setBoard(newBoard);
    setIsGameOver(false);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setShowWinModal(false);

    if (newMoves.length > 0) {
      const last = newMoves[newMoves.length - 1];
      setLastMoveIndex(last.index);
      setTurn(last.player === 'X' ? 'O' : 'X');
    } else {
      setLastMoveIndex(null);
      setTurn('X');
    }
  };

  // --- Replay Feature ---
  const handleToggleReplay = () => {
    if (moves.length === 0) return;

    if (isReplaying) {
      setIsReplaying(false);
      if (replayTimerRef.current) clearInterval(replayTimerRef.current);
    } else {
      setIsReplaying(true);
      setShowWinModal(false);

      let step = 0;
      setActiveReplayStep(0);

      // Clear current board for step replay
      setBoard(Array(boardSize * boardSize).fill(null));

      replayTimerRef.current = setInterval(() => {
        step++;
        if (step > moves.length) {
          setIsReplaying(false);
          setActiveReplayStep(null);
          if (replayTimerRef.current) clearInterval(replayTimerRef.current);

          // Restore full state result
          const finalBoard = Array(boardSize * boardSize).fill(null);
          moves.forEach((m) => {
            finalBoard[m.index] = m.player;
          });
          setBoard(finalBoard);
          const res = checkGameResult(finalBoard, boardSize);
          if (res.winner) {
            setIsGameOver(true);
            setWinner(res.winner);
            setWinningLine(res.winningLine);
          }
          return;
        }

        setActiveReplayStep(step);
        const subMoves = moves.slice(0, step);
        const tempBoard = Array(boardSize * boardSize).fill(null);
        subMoves.forEach((m) => {
          tempBoard[m.index] = m.player;
        });
        setBoard(tempBoard);

        const lastMove = subMoves[subMoves.length - 1];
        soundManager.playMove(lastMove.player);
      }, 650);
    }
  };

  const handleSelectMoveStep = (stepIndex: number) => {
    setActiveReplayStep(stepIndex);
    const subMoves = moves.slice(0, stepIndex);
    const tempBoard = Array(boardSize * boardSize).fill(null);
    subMoves.forEach((m) => {
      tempBoard[m.index] = m.player;
    });
    setBoard(tempBoard);
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 flex flex-col font-sans select-none ${theme.bgClass}`}
    >
      {/* App Header */}
      <Header
        theme={theme}
        onThemeChange={setThemeMode}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        onOpenStats={() => setShowStatsModal(true)}
        onOpenRules={() => setShowRulesModal(true)}
        onResetAll={() => resetMatch()}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 py-2 flex flex-col justify-between gap-3 sm:gap-4">
        {/* Game Mode & Options Bar */}
        <ModeSelector
          theme={theme}
          mode={mode}
          difficulty={difficulty}
          userSymbol={userSymbol}
          boardSize={boardSize}
          onModeChange={handleModeChange}
          onDifficultyChange={handleDifficultyChange}
          onSymbolChange={handleSymbolChange}
          onBoardSizeChange={handleBoardSizeChange}
          disabled={moves.length > 0 && !isGameOver}
        />

        {/* Score & Turn Bar */}
        <ScoreBoard
          theme={theme}
          turn={turn}
          mode={mode}
          difficulty={difficulty}
          userSymbol={userSymbol}
          stats={stats}
          isGameOver={isGameOver}
          winner={winner}
          isThinkingAI={isThinkingAI}
        />

        {/* Tic Tac Toe Grid Canvas */}
        <Board
          board={board}
          boardSize={boardSize}
          theme={theme}
          turn={turn}
          winningLine={winningLine}
          onCellClick={handleCellClick}
          disabled={isGameOver || isThinkingAI || isReplaying}
          lastMoveIndex={lastMoveIndex}
        />

        {/* Main Controls Bar */}
        <Controls
          theme={theme}
          onRestart={() => resetMatch()}
          onUndo={handleUndo}
          onToggleHistory={() => setShowHistory(!showHistory)}
          onResetScores={() => setStats(INITIAL_STATS)}
          canUndo={moves.length > 0 && !isGameOver && !isReplaying}
          hasMoveHistory={moves.length > 0}
          showHistory={showHistory}
        />

        {/* Move History Drawer */}
        {showHistory && (
          <MoveHistory
            moves={moves}
            boardSize={boardSize}
            theme={theme}
            onSelectMoveStep={handleSelectMoveStep}
            activeStep={activeReplayStep ?? moves.length}
            isReplaying={isReplaying}
            onToggleReplay={handleToggleReplay}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-2 text-center text-[11px] opacity-60">
        Tic Tac Toe &bull; Built with React & Tailwind
      </footer>

      {/* Dialog Modals */}
      <WinModal
        theme={theme}
        winner={winner}
        isDraw={isDraw}
        mode={mode}
        difficulty={difficulty}
        userSymbol={userSymbol}
        onRematch={() => resetMatch()}
        onReview={() => {
          setShowWinModal(false);
          setShowHistory(true);
        }}
        isOpen={showWinModal}
      />

      <RulesModal
        theme={theme}
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      <StatsModal
        theme={theme}
        stats={stats}
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        onResetStats={() => setStats(INITIAL_STATS)}
      />
    </div>
  );
}
