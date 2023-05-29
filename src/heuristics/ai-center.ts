import {
  COLUMN_LENGTH,
  ROW_LENGTH,
  checkIfWinner,
  getAvailableMoves,
} from "../shared";
import { Board } from "../types";

const scorePosition = (board: Board): number => {
  let score = 0;

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
