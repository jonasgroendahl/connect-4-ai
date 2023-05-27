import {
  COLUMN_LENGTH,
  ROW_LENGTH,
  checkIfWinner,
  getAvailableMoves,
} from "./shared";
import { Board } from "./types";

const scorePosition = (board: Board) => {
  let score = 0;

  for (let i = 0; i < COLUMN_LENGTH; i++) {
    for (let j = 0; j < ROW_LENGTH; j++) {
      if (board[i][j] === "AI" && j >= 2 && j <= 4) {
        score += 2;
      }
    }
  }

  return score;
};

export const miniMaxCenter = (
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

      const score = miniMaxCenter(board, depth - 1, false);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxCenter(board, depth - 1, true);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
    }
    return valueMin;
  }
};
