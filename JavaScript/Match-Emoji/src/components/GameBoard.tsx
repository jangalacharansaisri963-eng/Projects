import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CardItem, Difficulty, GameStats } from '../types';
import { DIFFICULTY_CONFIGS, EMOJI_CATALOG } from '../data/emojis';
import { SpiralNotepad } from './SpiralNotepad';
import { EmojiCard } from './EmojiCard';
import { ArrowLeft, Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameBoardProps {
  difficulty: Difficulty;
  onBackToMenu: () => void;
  onGameEnd: (stats: GameStats, isWin: boolean) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  difficulty,
  onBackToMenu,
  onGameEnd,
}) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const totalCards = config.rows * config.cols;
  const totalPairs = totalCards / 2;

  // Sound state
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Game board state
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [comboBanner, setComboBanner] = useState<string | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState(1);

  // Timer reference
  const timerRef = useRef<number | null>(null);
  const isGameOverRef = useRef(false);

  // Calculate Stars based on performance
  const calculateStars = (currentMoves: number, currentTimeLeft: number): number => {
    const perfectMoves = totalPairs;
    const goodMoves = totalPairs * 1.6;

    if (currentMoves <= perfectMoves + 2 && currentTimeLeft > config.timeLimit * 0.35) {
      return 3;
    } else if (currentMoves <= goodMoves + 4 && currentTimeLeft > 5) {
      return 2;
    }
    return 1;
  };

  // Shuffle & Setup New Deck
  const initializeDeck = useCallback(() => {
    // Select required unique emojis from catalog
    const shuffledCatalog = [...EMOJI_CATALOG].sort(() => Math.random() - 0.5);
    const selectedEmojis = shuffledCatalog.slice(0, totalPairs);

    const deck: CardItem[] = [];
    selectedEmojis.forEach((item) => {
      // Create pair for each emoji
      deck.push({
        uid: `${item.id}-1-${Math.random()}`,
        emojiId: item.id,
        emoji: item.emoji,
        name: item.name,
        bgGradient: item.bgGradient,
        accentColor: item.accentColor,
        isFlipped: false,
        isMatched: false,
        isShaking: false,
      });
      deck.push({
        uid: `${item.id}-2-${Math.random()}`,
        emojiId: item.id,
        emoji: item.emoji,
        name: item.name,
        bgGradient: item.bgGradient,
        accentColor: item.accentColor,
        isFlipped: false,
        isMatched: false,
        isShaking: false,
      });
    });

    // Shuffle the cards
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setTimeLeft(config.timeLimit);
    setMatchedPairs(0);
    setStreak(0);
    setMaxStreak(0);
    setScore(0);
    setHintsRemaining(difficulty === 'EASY' ? 2 : 1);
    isGameOverRef.current = false;
  }, [config.timeLimit, difficulty, totalPairs]);

  // Initial Deck Mount
  useEffect(() => {
    initializeDeck();
  }, [initializeDeck]);

  // Countdown Timer
  useEffect(() => {
    if (matchedPairs === totalPairs || isGameOverRef.current) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          isGameOverRef.current = true;
          // Trigger timeout game over
          onGameEnd(
            {
              moves,
              timeLeft: 0,
              maxTime: config.timeLimit,
              score,
              matchedPairs,
              totalPairs,
              streak,
              maxStreak,
              stars: 0,
            },
            false,
          );
          return 0;
        }

        // Tick sound for urgent final 5 seconds
        if (prev <= 6) {
          sound.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [matchedPairs, totalPairs, onGameEnd, moves, config.timeLimit, score, streak, maxStreak]);

  // Handle Card Tap
  const handleCardClick = (index: number) => {
    if (isProcessing || isGameOverRef.current) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    sound.playFlip();

    // Flip the clicked card
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], isFlipped: true };
    setCards(updatedCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If this is the second card flipped
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const newMoves = moves + 1;
      setMoves(newMoves);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      // Check if match
      if (firstCard.emojiId === secondCard.emojiId) {
        // MATCH SUCCESS!
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setMaxStreak((prev) => Math.max(prev, nextStreak));
        sound.playMatch(nextStreak);

        // Calculate score with streak bonus
        const pairBaseScore = 100;
        const streakBonus = (nextStreak - 1) * 50;
        const timeBonus = Math.floor(timeLeft * 2);
        const addedScore = pairBaseScore + streakBonus + timeBonus;
        setScore((prev) => prev + addedScore);

        if (nextStreak >= 2) {
          setComboBanner(`COMBO x${nextStreak}! +${addedScore} pts`);
          setTimeout(() => setComboBanner(null), 1200);
        }

        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev];
            next[firstIdx] = { ...next[firstIdx], isMatched: true, isFlipped: true };
            next[secondIdx] = { ...next[secondIdx], isMatched: true, isFlipped: true };
            return next;
          });
          setFlippedIndices([]);
          setIsProcessing(false);

          const newMatchedCount = matchedPairs + 1;
          setMatchedPairs(newMatchedCount);

          // Check if board complete
          if (newMatchedCount === totalPairs) {
            isGameOverRef.current = true;
            if (timerRef.current) clearInterval(timerRef.current);
            const stars = calculateStars(newMoves, timeLeft);
            onGameEnd(
              {
                moves: newMoves,
                timeLeft,
                maxTime: config.timeLimit,
                score: score + addedScore,
                matchedPairs: newMatchedCount,
                totalPairs,
                streak: nextStreak,
                maxStreak: Math.max(maxStreak, nextStreak),
                stars,
              },
              true,
            );
          }
        }, 300);
      } else {
        // MISMATCH!
        setStreak(0);
        sound.playMismatch();

        // Shake the cards briefly then flip back
        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev];
            next[firstIdx] = { ...next[firstIdx], isShaking: true };
            next[secondIdx] = { ...next[secondIdx], isShaking: true };
            return next;
          });
        }, 150);

        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev];
            next[firstIdx] = { ...next[firstIdx], isFlipped: false, isShaking: false };
            next[secondIdx] = { ...next[secondIdx], isFlipped: false, isShaking: false };
            return next;
          });
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 750);
      }
    }
  };

  // Peek Hint Feature
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || isProcessing || isGameOverRef.current) return;
    sound.playClick();
    setHintsRemaining((prev) => prev - 1);
    setIsProcessing(true);

    // Reveal all unrevealed cards for 1.2 seconds
    setCards((prev) =>
      prev.map((c) => (c.isMatched ? c : { ...c, isFlipped: true })),
    );

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => (c.isMatched ? c : { ...c, isFlipped: false })),
      );
      setFlippedIndices([]);
      setIsProcessing(false);
    }, 1200);
  };

  // Responsive Grid Style
  const gridColsClass =
    config.cols === 3
      ? 'grid-cols-3 max-w-sm'
      : config.cols === 4
      ? 'grid-cols-4 max-w-md'
      : 'grid-cols-4 max-w-lg';

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between py-4 px-3 select-none overflow-x-hidden">
      {/* Background Cloud Graphic */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-32 sm:h-44 text-white/40 fill-current transform scale-105"
        >
          <path d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,234.7C840,245,960,235,1080,213.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      {/* Top Header Navigation Bar */}
      <div className="w-full max-w-lg flex items-center justify-between z-10 px-2">
        {/* Back Button (Orange circular button as seen in screenshot) */}
        <button
          id="game-btn-back"
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          title="Back to Menu"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white btn-glossy-orange cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Right side controls: Hint & Sound */}
        <div className="flex items-center gap-2">
          {hintsRemaining > 0 && (
            <button
              id="game-btn-hint"
              onClick={handleUseHint}
              disabled={isProcessing}
              title={`Use Hint (${hintsRemaining} left)`}
              className="py-1.5 px-3 rounded-full bg-white/90 hover:bg-white text-amber-700 shadow-md flex items-center gap-1.5 text-xs font-bold font-game transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-300"
            >
              <Eye className="w-4 h-4 text-amber-500" />
              <span>PEEK ({hintsRemaining})</span>
            </button>
          )}

          <button
            id="game-btn-sound-toggle"
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-sky-800 shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Top Dual Spiral Notepads: MOVES and TIME LEFT (Faithful reproduction of screenshots) */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 sm:gap-6 z-10 my-2 px-2">
        {/* MOVES Notepad Card */}
        <SpiralNotepad ringCount={4} className="py-3 sm:py-4 shadow-xl">
          <span className="text-sm sm:text-base font-game font-extrabold text-slate-700 tracking-wider">
            MOVES
          </span>
          <span className="text-3xl sm:text-4xl font-game font-black text-slate-800 mt-0.5">
            {moves}
          </span>
        </SpiralNotepad>

        {/* TIME LEFT Notepad Card */}
        <SpiralNotepad ringCount={4} className="py-3 sm:py-4 shadow-xl">
          <span className="text-sm sm:text-base font-game font-extrabold text-slate-700 tracking-wider">
            TIME LEFT
          </span>
          <span
            className={`text-3xl sm:text-4xl font-game font-black mt-0.5 transition-colors ${
              timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-slate-800'
            }`}
          >
            {timeLeft}
          </span>
        </SpiralNotepad>
      </div>

      {/* Combo Banner Alert */}
      <div className="h-6 flex items-center justify-center z-10">
        {comboBanner && (
          <div className="animate-bounce bg-amber-400 text-amber-950 font-game font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
            {comboBanner}
          </div>
        )}
      </div>

      {/* Center Emoji Cards Grid */}
      <div className="w-full flex items-center justify-center z-10 my-auto py-2">
        <div
          className={`grid ${gridColsClass} gap-2.5 sm:gap-3.5 md:gap-4 w-full p-2 sm:p-3 bg-sky-600/30 backdrop-blur-xs rounded-3xl border-2 border-white/40 shadow-xl`}
        >
          {cards.map((card, idx) => (
            <EmojiCard
              key={card.uid}
              card={card}
              onClick={() => handleCardClick(idx)}
              disabled={isProcessing || isGameOverRef.current}
            />
          ))}
        </div>
      </div>

      {/* Bottom Status Info */}
      <div className="w-full max-w-md flex items-center justify-between text-xs font-semibold text-white/90 z-10 px-4 py-1">
        <span>
          Matched: {matchedPairs} / {totalPairs}
        </span>
        <span>Score: {score} pts</span>
      </div>
    </div>
  );
};
