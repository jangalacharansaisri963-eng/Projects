import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BoardSize, BoardValue, PlayerSymbol, WinningLine } from '../types';
import { ThemeConfig } from '../utils/themes';

interface BoardProps {
  board: BoardValue[];
  boardSize: BoardSize;
  theme: ThemeConfig;
  turn: PlayerSymbol;
  winningLine: WinningLine | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
  lastMoveIndex: number | null;
}

export const Board: React.FC<BoardProps> = ({
  board,
  boardSize,
  theme,
  turn,
  winningLine,
  onCellClick,
  disabled,
  lastMoveIndex,
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Keyboard navigation state
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (disabled) return;

    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % board.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + board.length) % board.length;
    } else if (e.key === 'ArrowDown') {
      nextIndex = (index + boardSize) % board.length;
    } else if (e.key === 'ArrowUp') {
      nextIndex = (index - boardSize + board.length) % board.length;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCellClick(index);
      return;
    }

    if (nextIndex !== index) {
      e.preventDefault();
      setFocusedIndex(nextIndex);
      const el = document.getElementById(`cell-${nextIndex}`);
      if (el) el.focus();
    }
  };

  // Helper to check if a cell index is part of the winning combination
  const isWinningCell = (index: number) => {
    return winningLine?.combo.includes(index) ?? false;
  };

  // Calculate coordinates for SVG winning line overlay
  const getLineCoordinates = () => {
    if (!winningLine || winningLine.combo.length < 2) return null;

    const startIdx = winningLine.combo[0];
    const endIdx = winningLine.combo[winningLine.combo.length - 1];

    const startRow = Math.floor(startIdx / boardSize);
    const startCol = startIdx % boardSize;
    const endRow = Math.floor(endIdx / boardSize);
    const endCol = endIdx % boardSize;

    // Convert to percentage (0% to 100%) inside the SVG viewbox
    const cellSizePct = 100 / boardSize;
    const x1 = startCol * cellSizePct + cellSizePct / 2;
    const y1 = startRow * cellSizePct + cellSizePct / 2;
    const x2 = endCol * cellSizePct + cellSizePct / 2;
    const y2 = endRow * cellSizePct + cellSizePct / 2;

    return { x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%` };
  };

  const lineCoords = getLineCoordinates();

  const getGridColsClass = () => {
    if (boardSize === 4) return 'grid-cols-4';
    if (boardSize === 5) return 'grid-cols-5';
    return 'grid-cols-3';
  };

  return (
    <div className="w-full max-w-xs sm:max-w-md mx-auto aspect-square relative p-3 sm:p-4 rounded-3xl transition-all">
      {/* Board Container */}
      <div
        className={`w-full h-full rounded-2xl grid ${getGridColsClass()} gap-2 sm:gap-3 p-2.5 sm:p-3 relative ${theme.boardBg}`}
      >
        {/* SVG Overlay for Animated Win Line */}
        {lineCoords && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            <motion.line
              x1={lineCoords.x1}
              y1={lineCoords.y1}
              x2={lineCoords.x2}
              y2={lineCoords.y2}
              stroke={theme.winLineColor}
              strokeWidth={boardSize === 3 ? '10' : '8'}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </svg>
        )}

        {/* Board Cells */}
        {board.map((cellValue, idx) => {
          const isWinning = isWinningCell(idx);
          const isLastMove = idx === lastMoveIndex;
          const isEmpty = cellValue === null;

          return (
            <motion.button
              key={idx}
              id={`cell-${idx}`}
              tabIndex={focusedIndex === idx ? 0 : -1}
              onClick={() => onCellClick(idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              disabled={disabled || !isEmpty}
              whileHover={{ scale: isEmpty && !disabled ? 1.03 : 1 }}
              whileTap={{ scale: isEmpty && !disabled ? 0.95 : 1 }}
              className={`relative rounded-xl flex items-center justify-center font-black transition-all select-none outline-none focus:ring-2 focus:ring-indigo-400 ${
                theme.cellClass
              } ${isEmpty && !disabled ? theme.cellHover : ''} ${
                isWinning
                  ? 'bg-emerald-500/20 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20 scale-105 z-10'
                  : ''
              } ${isLastMove && !isWinning ? 'ring-1 ring-indigo-400/50' : ''}`}
            >
              <AnimatePresence mode="wait">
                {cellValue ? (
                  <motion.span
                    key={cellValue}
                    initial={{ scale: 0, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 22,
                    }}
                    className={`leading-none ${
                      boardSize === 3
                        ? 'text-4xl sm:text-6xl'
                        : boardSize === 4
                        ? 'text-3xl sm:text-4xl'
                        : 'text-2xl sm:text-3xl'
                    } ${cellValue === 'X' ? theme.colorX : theme.colorO}`}
                  >
                    {cellValue}
                  </motion.span>
                ) : (
                  /* Ghost Preview on Hover */
                  hoveredIndex === idx &&
                  !disabled && (
                    <span
                      className={`opacity-25 font-bold ${
                        boardSize === 3 ? 'text-4xl' : 'text-2xl'
                      } ${turn === 'X' ? theme.colorX : theme.colorO}`}
                    >
                      {turn}
                    </span>
                  )
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
    
