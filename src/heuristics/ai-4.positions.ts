import {
  COLUMN_LENGTH,
  ROW_LENGTH,
  checkIfWinner,
  getAvailableMoves,
} from "../shared";
import { Board, BoardPosition, Player } from "../types";

const PLAYER_SCORE = 2;
const EMPTY_SORE = 0.5;

const coordsCheckFourPositions = (
  first: BoardPosition,
  second: BoardPosition,
  third: BoardPosition | undefined,
  fourth: BoardPosition | undefined,
  player: Player
) => {
  let score = 0;

  for (const postion of [first, second, third, fourth]) {
    if (postion !== null && postion !== player) {
      // another player
      return 0;
    }

    if (postion === player) {
      if (player === "AI") {
        score += PLAYER_SCORE;
      } else if (player === "HUMAN") {
        score -= PLAYER_SCORE;
      }
    }

    if (postion === null) {
      if (player === "AI") {
        score += EMPTY_SORE;
      } else if (player === "HUMAN") {
        score -= EMPTY_SORE;
      }
    }
  }

  return score;
};

export const checkAllFour = (board: Board, player: Player) => {
  let score = 0;

  for (let i = 0; i < COLUMN_LENGTH; i++) {
    for (let j = 0; j < ROW_LENGTH; j++) {
      // check horizontal win - bounds check
      if (j < ROW_LENGTH - 3) {
        score += coordsCheckFourPositions(
          board[i][j],
          board[i][j + 1],
          board[i][j + 2],
          board[i][j + 3],
          player
        );
      }

      // check vertical win - bounds check
      if (i < COLUMN_LENGTH - 3) {
        score += coordsCheckFourPositions(
          board[i][j],
          board[i + 1][j],
          board[i + 2][j],
          board[i + 3][j],
          player
        );
      }

      // check diagonal rising - bounds check
      if (j < ROW_LENGTH - 3 && i > COLUMN_LENGTH - 3) {
        score += coordsCheckFourPositions(
          board[i][j],
          board[i - 1][j + 1],
          board[i - 2][j + 2],
          board[i - 3][j + 3],
          player
        );
      }

      // diagonal falling - bounds check
      if (j > COLUMN_LENGTH - 3 && i > COLUMN_LENGTH - 3) {
        score += coordsCheckFourPositions(
          board[i][j],
          board[i - 1][j - 1],
          board[i - 2][j - 2],
          board[i - 3][j - 3],
          player
        );
      }
    }
  }

  return score;
};

export const miniMaxFourPositions = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number,
  player: Player
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
      return checkAllFour(board, player);
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxFourPositions(board, depth - 1, false, alpha, beta, player);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxFourPositions(board, depth - 1, true, alpha, beta, player);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
    }
    return valueMin;
  }
};

export const miniMaxFourPositionsAlphaBeta = (
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
      return checkAllFour(board, "AI");
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxFourPositionsAlphaBeta(
        board,
        depth - 1,
        false,
        alpha,
        beta
      );

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

      const score = miniMaxFourPositionsAlphaBeta(
        board,
        depth - 1,
        true,
        alpha,
        beta
      );

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

export const miniMaxSecondBestTransTable = (
  board: Board,
  maxDepth: number,
  isMaximizingPlayer: boolean
): number => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 0 || maxDepth === 0;

  if (isTerminal) {
    // check for winners
    if (winner) {
      if (winner === "AI") {
        return 9999999;
      } else {
        return -99999999;
      }
    }

    if (maxDepth === 0) {
      return checkAllFour(board, "AI");
    }

    return 0;
  }

  // should be hashed instead of storing this big of an object.
  const boardKey = JSON.stringify(board);

  if (transTable.has(boardKey)) {
    return transTable.get(boardKey);
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxSecondBestTransTable(board, maxDepth - 1, false);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
    }
    // Cache the computed score for the current board position
    transTable.set(boardKey, valueMax);
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxSecondBestTransTable(board, maxDepth - 1, true);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
    }

    // Cache the computed score for the current board position
    transTable.set(boardKey, valueMin);

    return valueMin;
  }
};
