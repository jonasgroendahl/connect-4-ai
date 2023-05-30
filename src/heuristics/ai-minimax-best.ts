import {
  COLUMN_LENGTH,
  ROW_LENGTH,
  checkIfWinner,
  getAvailableMoves,
} from "../shared";
import { Board, Player } from "../types";

const scorePosition = (board: Board): number => {
  let score = 0;

  // Evaluate horizontally
  for (let row = 0; row < COLUMN_LENGTH; row++) {
    for (let col = 0; col < ROW_LENGTH - 3; col++) {
      const slice = board[row].slice(col, col + 4);
      score += evaluateSlice(slice);
    }
  }

  // Evaluate vertically
  for (let col = 0; col < ROW_LENGTH; col++) {
    for (let row = 0; row < COLUMN_LENGTH - 3; row++) {
      const slice = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
      ];
      score += evaluateSlice(slice);
    }
  }

  // Evaluate diagonally (top-left to bottom-right)
  for (let row = 0; row < COLUMN_LENGTH - 3; row++) {
    for (let col = 0; col < ROW_LENGTH - 3; col++) {
      const slice = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ];
      score += evaluateSlice(slice);
    }
  }

  // Evaluate diagonally (top-right to bottom-left)
  for (let row = 0; row < COLUMN_LENGTH - 3; row++) {
    for (let col = 3; col < ROW_LENGTH; col++) {
      const slice = [
        board[row][col],
        board[row + 1][col - 1],
        board[row + 2][col - 2],
        board[row + 3][col - 3],
      ];
      score += evaluateSlice(slice);
    }
  }

  // Bonus score for center column
  const centerCol = Math.floor(ROW_LENGTH / 2);
  for (let row = 0; row < COLUMN_LENGTH; row++) {
    const cell = board[row][centerCol];
    if (cell === "AI") {
      score += 5;
    } else if (cell === "HUMAN") {
      score -= 5;
    }
  }

  return score;
};

const evaluateSlice = (slice: (Player | null)[]): number => {
  let aiCount = 0;
  let humanCount = 0;
  let emptyCount = 0;

  for (const cell of slice) {
    if (cell === "AI") {
      aiCount++;
    } else if (cell === "HUMAN") {
      humanCount++;
    } else {
      emptyCount++;
    }
  }

  if (aiCount === 4) {
    return 1000000;
  } else if (aiCount === 3 && emptyCount === 1) {
    return 100;
  } else if (aiCount === 2 && emptyCount === 2) {
    return 10;
  } else if (aiCount === 1 && emptyCount === 3) {
    return 1;
  } else if (humanCount === 4) {
    return -1000000;
  } else if (humanCount === 3 && emptyCount === 1) {
    return -100;
  } else if (humanCount === 2 && emptyCount === 2) {
    return -10;
  } else if (humanCount === 1 && emptyCount === 3) {
    return -1;
  }

  return 0; // Empty slice or no immediate advantage for either player
};

export const miniMaxBest = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean
): number => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 0 || depth === 0;

  if (isTerminal) {
    // check for winners
    if (winner) {
      if (winner === "AI") {
        return 9999999;
      } else {
        return -99999999;
      }
    }

    if (depth === 0) {
      return scorePosition(board);
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxBest(board, depth - 1, false);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxBest(board, depth - 1, true);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
    }
    return valueMin;
  }
};

export const miniMaxBestAlphaBeta = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number
): number => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 0 || depth === 0;

  if (isTerminal) {
    // check for winners
    if (winner) {
      if (winner === "AI") {
        return 9999999;
      } else {
        return -99999999;
      }
    }

    if (depth === 0) {
      return scorePosition(board);
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxBestAlphaBeta(board, depth - 1, false, alpha, beta);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
      alpha = Math.max(alpha, valueMax);

      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxBestAlphaBeta(board, depth - 1, true, alpha, beta);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
      beta = Math.min(beta, valueMin);

      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return valueMin;
  }
};

const transTable = new Map();

export const miniMaxBestAlphaBetaWithLookupTable = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number
) => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 0 || depth === 0;

  if (isTerminal) {
    // check for winners
    if (winner) {
      if (winner === "AI") {
        return 9999999;
      } else {
        return -99999999;
      }
    }

    if (depth === 0) {
      return scorePosition(board);
    }

    return 0;
  }

  const boardKey = JSON.stringify(board);

  if (transTable.has(boardKey)) {
    return transTable.get(boardKey);
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxBestAlphaBetaWithLookupTable(board, depth - 1, false, alpha, beta);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
      alpha = Math.max(alpha, valueMax);

      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }

    // Cache the computed score for the current board position
    transTable.set(boardKey, valueMax);
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxBestAlphaBetaWithLookupTable(board, depth - 1, true, alpha, beta);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
      beta = Math.min(beta, valueMin);

      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }

    // Cache the computed score for the current board position
    transTable.set(boardKey, valueMin);
    return valueMin;
  }
};

let weights = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 2,
  5: 1,
  6: 0,
};

const sortByCenter = (x: [number, number], y: [number, number]) => {
  return weights[y[1]] - weights[x[1]];
};

export const miniMaxBestAlphaBetaWithMoveOrdering = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number
) => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 0 || depth === 0;

  if (isTerminal) {
    // check for winners
    if (winner) {
      if (winner === "AI") {
        return 9999999;
      } else {
        return -99999999;
      }
    }

    if (depth === 0) {
      return scorePosition(board);
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves.sort(sortByCenter)) {
      board[x][y] = "AI";

      const score = miniMaxBestAlphaBetaWithMoveOrdering(board, depth - 1, false, alpha, beta);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
      alpha = Math.max(alpha, valueMax);

      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }

    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves.sort(sortByCenter)) {
      board[x][y] = "HUMAN";

      const score = miniMaxBestAlphaBetaWithMoveOrdering(board, depth - 1, true, alpha, beta);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
      beta = Math.min(beta, valueMin);

      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }

    return valueMin;
  }
};

const transTableMoveOrdering = new Map();

export const miniMaxBestAlphaBetaWithMoveOrderingAndLookupTable = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number
) => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 0 || depth === 0;

  if (isTerminal) {
    // check for winners
    if (winner) {
      if (winner === "AI") {
        return 9999999;
      } else {
        return -99999999;
      }
    }

    if (depth === 0) {
      return scorePosition(board);
    }

    return 0;
  }

  const boardKey = JSON.stringify(board);

  if (transTableMoveOrdering.has(boardKey)) {
    return transTableMoveOrdering.get(boardKey);
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves.sort(sortByCenter)) {
      board[x][y] = "AI";

      const score = miniMaxBestAlphaBetaWithMoveOrderingAndLookupTable(board, depth - 1, false, alpha, beta);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
      alpha = Math.max(alpha, valueMax);

      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }

    transTableMoveOrdering.set(boardKey, valueMax);
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves.sort(sortByCenter)) {
      board[x][y] = "HUMAN";

      const score = miniMaxBestAlphaBetaWithMoveOrderingAndLookupTable(board, depth - 1, true, alpha, beta);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
      beta = Math.min(beta, valueMin);

      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }

    transTableMoveOrdering.set(boardKey, valueMin);
    return valueMin;
  }
};


