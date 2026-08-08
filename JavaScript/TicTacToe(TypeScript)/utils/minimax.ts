import { AIDifficulty, BoardSize, BoardValue, PlayerSymbol } from '../types';
import { checkGameResult, getAvailableMoves, getWinningCombos } from './gameLogic';

/**
 * Main AI decision engine
 */
export function getAIMove(
  board: BoardValue[],
  aiSymbol: PlayerSymbol,
  difficulty: AIDifficulty,
  boardSize: BoardSize
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;

  const humanSymbol: PlayerSymbol = aiSymbol === 'X' ? 'O' : 'X';

  // 1. Easy Difficulty: Casual / Novice AI
  // Makes frequent mistakes and plays mostly random open spots
  if (difficulty === 'easy') {
    // 20% chance to take an immediate win if available, otherwise pick purely random
    if (Math.random() < 0.2) {
      const winMove = findImmediateWinningMove(board, aiSymbol, boardSize);
      if (winMove !== -1) return winMove;
    }
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // 2. Medium Difficulty: Tactical / Intermediate AI
  // Always takes immediate winning move and blocks immediate human wins, otherwise uses positional priority
  if (difficulty === 'medium') {
    // Take win
    const winMove = findImmediateWinningMove(board, aiSymbol, boardSize);
    if (winMove !== -1) return winMove;

    // Block human win
    const blockMove = findImmediateWinningMove(board, humanSymbol, boardSize);
    if (blockMove !== -1) return blockMove;

    // Favor center or corners on 3x3
    if (boardSize === 3) {
      const center = 4;
      if (board[center] === null && Math.random() < 0.7) {
        return center;
      }
      const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
      if (corners.length > 0 && Math.random() < 0.6) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }

    // Otherwise random move
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // 3. Hard / Unbeatable Difficulty: Perfect Minimax with Alpha-Beta Pruning
  // Guaranteed mathematically optimal play - impossible to defeat on 3x3
  const winMove = findImmediateWinningMove(board, aiSymbol, boardSize);
  if (winMove !== -1) return winMove;

  const blockMove = findImmediateWinningMove(board, humanSymbol, boardSize);
  if (blockMove !== -1) return blockMove;

  if (boardSize === 3) {
    // Standard 3x3 Minimax depth = 9 (full board evaluation)
    return getBestMinimaxMove(board, aiSymbol, humanSymbol, boardSize, 9);
  } else {
    // 4x4 or 5x5: Heuristic Depth 4 Minimax
    return getBestMinimaxMove(board, aiSymbol, humanSymbol, boardSize, 4);
  }
}

/**
 * Checks if a player can win in 1 move
 */
function findImmediateWinningMove(
  board: BoardValue[],
  player: PlayerSymbol,
  boardSize: BoardSize
): number {
  const available = getAvailableMoves(board);
  for (const move of available) {
    const boardCopy = [...board];
    boardCopy[move] = player;
    const result = checkGameResult(boardCopy, boardSize);
    if (result.winner === player) {
      return move;
    }
  }
  return -1;
}

/**
 * Minimax with Alpha-Beta Pruning
 */
function getBestMinimaxMove(
  board: BoardValue[],
  aiSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol,
  boardSize: BoardSize,
  maxDepth: number
): number {
  const available = getAvailableMoves(board);

  // If first move on empty 3x3 board, pick center or corner for variety & instant speed
  if (boardSize === 3 && available.length === 9) {
    const choices = [4, 0, 2, 6, 8];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  let bestScore = -Infinity;
  let bestMoves: number[] = [];

  for (const move of available) {
    board[move] = aiSymbol;
    const score = minimax(
      board,
      0,
      false,
      -Infinity,
      Infinity,
      aiSymbol,
      humanSymbol,
      boardSize,
      maxDepth
    );
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  // Pick randomly among moves tied for best score for natural gameplay
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function minimax(
  board: BoardValue[],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol,
  boardSize: BoardSize,
  maxDepth: number
): number {
  const result = checkGameResult(board, boardSize);

  if (result.winner === aiSymbol) return 10 - depth;
  if (result.winner === humanSymbol) return depth - 10;
  if (result.isDraw) return 0;
  if (depth >= maxDepth) {
    return evaluateBoardHeuristic(board, aiSymbol, humanSymbol, boardSize);
  }

  const available = getAvailableMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of available) {
      board[move] = aiSymbol;
      const evaluation = minimax(
        board,
        depth + 1,
        false,
        alpha,
        beta,
        aiSymbol,
        humanSymbol,
        boardSize,
        maxDepth
      );
      board[move] = null;

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of available) {
      board[move] = humanSymbol;
      const evaluation = minimax(
        board,
        depth + 1,
        true,
        alpha,
        beta,
        aiSymbol,
        humanSymbol,
        boardSize,
        maxDepth
      );
      board[move] = null;

      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
}

/**
 * Heuristic evaluation for board state when depth limit is reached (for 4x4 / 5x5)
 */
function evaluateBoardHeuristic(
  board: BoardValue[],
  aiSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol,
  boardSize: BoardSize
): number {
  const combos = getWinningCombos(boardSize);
  let score = 0;

  for (const combo of combos) {
    let aiCount = 0;
    let humanCount = 0;

    for (const idx of combo) {
      if (board[idx] === aiSymbol) aiCount++;
      else if (board[idx] === humanSymbol) humanCount++;
    }

    if (aiCount > 0 && humanCount === 0) {
      score += Math.pow(10, aiCount - 1);
    } else if (humanCount > 0 && aiCount === 0) {
      score -= Math.pow(10, humanCount - 1);
    }
  }

  return score;
}
