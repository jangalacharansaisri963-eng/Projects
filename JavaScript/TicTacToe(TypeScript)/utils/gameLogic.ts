import { BoardSize, BoardValue, PlayerSymbol, WinningLine } from '../types';

/**
 * Returns win target count:
 * 3x3 => 3 in a row
 * 4x4 => 4 in a row
 * 5x5 => 4 in a row
 */
export function getWinTarget(size: BoardSize): number {
  if (size === 3) return 3;
  if (size === 4) return 4;
  return 4; // 5x5 requires 4 in a row for faster, more dynamic games
}

/**
 * Generates all winning index combinations for a board size & win target
 */
export function getWinningCombos(size: BoardSize): number[][] {
  const target = getWinTarget(size);
  const combos: number[][] = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - target; c++) {
      const combo: number[] = [];
      for (let k = 0; k < target; k++) {
        combo.push(r * size + (c + k));
      }
      combos.push(combo);
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - target; r++) {
      const combo: number[] = [];
      for (let k = 0; k < target; k++) {
        combo.push((r + k) * size + c);
      }
      combos.push(combo);
    }
  }

  // Diagonals (Main / Down-right)
  for (let r = 0; r <= size - target; r++) {
    for (let c = 0; c <= size - target; c++) {
      const combo: number[] = [];
      for (let k = 0; k < target; k++) {
        combo.push((r + k) * size + (c + k));
      }
      combos.push(combo);
    }
  }

  // Anti-Diagonals (Down-left)
  for (let r = 0; r <= size - target; r++) {
    for (let c = target - 1; c < size; c++) {
      const combo: number[] = [];
      for (let k = 0; k < target; k++) {
        combo.push((r + k) * size + (c - k));
      }
      combos.push(combo);
    }
  }

  return combos;
}

export interface WinResult {
  winner: PlayerSymbol | null;
  winningLine: WinningLine | null;
  isDraw: boolean;
}

/**
 * Checks board state for winner or draw
 */
export function checkGameResult(board: BoardValue[], size: BoardSize): WinResult {
  const combos = getWinningCombos(size);

  for (const combo of combos) {
    const first = board[combo[0]];
    if (!first) continue;

    let isWin = true;
    for (let i = 1; i < combo.length; i++) {
      if (board[combo[i]] !== first) {
        isWin = false;
        break;
      }
    }

    if (isWin) {
      // Determine direction type
      const firstIdx = combo[0];
      const secondIdx = combo[1];
      const diff = secondIdx - firstIdx;

      let direction: WinningLine['direction'] = 'horizontal';
      if (diff === 1) {
        direction = 'horizontal';
      } else if (diff === size) {
        direction = 'vertical';
      } else if (diff === size + 1) {
        direction = 'diagonal-main';
      } else if (diff === size - 1) {
        direction = 'diagonal-anti';
      }

      return {
        winner: first,
        winningLine: {
          combo,
          direction,
          lineIndex: firstIdx,
        },
        isDraw: false,
      };
    }
  }

  // Check draw (all filled)
  const isDraw = board.every((cell) => cell !== null);

  return {
    winner: null,
    winningLine: null,
    isDraw,
  };
}

/**
 * Returns available cell indices
 */
export function getAvailableMoves(board: BoardValue[]): number[] {
  const moves: number[] = [];
  board.forEach((cell, idx) => {
    if (cell === null) moves.push(idx);
  });
  return moves;
}

/**
 * Converts index to Row (1-indexed) and Col (1-indexed)
 */
export function indexToCoords(index: number, size: BoardSize): { row: number; col: number } {
  return {
    row: Math.floor(index / size) + 1,
    col: (index % size) + 1,
  };
}
