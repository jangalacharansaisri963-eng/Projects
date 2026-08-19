import { useState, useEffect } from 'react';
import { Difficulty, GameScreen, GameStats, BestScores } from './types';
import { MenuScreen } from './components/MenuScreen';
import { GameBoard } from './components/GameBoard';
import { GameOverModal } from './components/GameOverModal';
import { ExitConfirmModal } from './components/ExitConfirmModal';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [gameSessionId, setGameSessionId] = useState<number>(1);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isGameWin, setIsGameWin] = useState(false);
  const [lastGameStats, setLastGameStats] = useState<GameStats>({
    moves: 0,
    timeLeft: 0,
    maxTime: 60,
    score: 0,
    matchedPairs: 0,
    totalPairs: 6,
    streak: 0,
    maxStreak: 0,
    stars: 0,
  });

  // Best scores persistence
  const [bestScores, setBestScores] = useState<BestScores>(() => {
    try {
      const saved = localStorage.getItem('match_emoji_highscores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save best scores
  useEffect(() => {
    try {
      localStorage.setItem('match_emoji_highscores', JSON.stringify(bestScores));
    } catch {
      // ignore
    }
  }, [bestScores]);

  // Handle selecting difficulty
  const handleSelectDifficulty = (selectedMode: Difficulty) => {
    setDifficulty(selectedMode);
    setGameSessionId((prev) => prev + 1);
    setIsGameOverModalOpen(false);
    setIsExitModalOpen(false);
    setScreen('PLAYING');
  };

  // Handle game completion
  const handleGameEnd = (stats: GameStats, isWin: boolean) => {
    setLastGameStats(stats);
    setIsGameWin(isWin);
    setIsGameOverModalOpen(true);

    if (isWin) {
      setBestScores((prev) => {
        const current = prev[difficulty];
        const isBetterMoves = !current || stats.moves < current.bestMoves;
        const isBetterScore = !current || stats.score > current.highScore;

        return {
          ...prev,
          [difficulty]: {
            bestMoves: isBetterMoves ? stats.moves : current.bestMoves,
            bestTime: current ? Math.max(current.bestTime, stats.timeLeft) : stats.timeLeft,
            highScore: isBetterScore ? stats.score : current.highScore,
            stars: current ? Math.max(current.stars, stats.stars) : stats.stars,
          },
        };
      });
    }
  };

  // Restart game
  const handleRestart = () => {
    setGameSessionId((prev) => prev + 1);
    setIsGameOverModalOpen(false);
    setScreen('PLAYING');
  };

  // Return to Menu
  const handleHome = () => {
    setIsGameOverModalOpen(false);
    setIsExitModalOpen(false);
    setScreen('MENU');
  };

  // Exit Game action
  const handleRequestExit = () => {
    setIsExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    setIsGameOverModalOpen(false);
    // Exits the game application completely by redirecting the URL
    window.location.href = '/';
  };

  const handleCancelExit = () => {
    setIsExitModalOpen(false);
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-sky-400 via-sky-400 to-sky-500 text-slate-800 flex flex-col items-center justify-center relative overflow-hidden font-game select-none">
      {screen === 'MENU' && (
        <MenuScreen
          onSelectDifficulty={handleSelectDifficulty}
          onRequestExit={handleRequestExit}
          bestScores={bestScores}
        />
      )}

      {screen === 'PLAYING' && (
        <GameBoard
          key={`${difficulty}-${gameSessionId}`}
          difficulty={difficulty}
          onBackToMenu={handleHome}
          onGameEnd={handleGameEnd}
        />
      )}

      {/* Exit Confirmation Modal */}
      <ExitConfirmModal
        isOpen={isExitModalOpen}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />

      {/* Game Over / Win Modal */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        isWin={isGameWin}
        stats={lastGameStats}
        difficulty={difficulty}
        onRestart={handleRestart}
        onHome={handleHome}
      />
    </main>
  );
}
