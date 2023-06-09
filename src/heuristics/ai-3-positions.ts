import {
  COLUMN_LENGTH,
  ROW_LENGTH,
  checkIfWinner,
  getAvailableMoves,
} from "../shared";
import { Board, BoardPosition, Player } from "../types";

const coordsCheckThree = (
  first: BoardPosition,
  second: BoardPosition,
  third: BoardPosition | undefined,
  player: Player
) => {
  if (first === player && second === player && third === player) {
    return player === "AI" ? 8 : -8;
  } else if (first === player && second === player) {
    return player === "AI" ? 2 : -2;
  }

  return 0;
};

export const checkIfTwoOrThreeInRow = (board: Board, player: Player) => {
  let score = 0;

  for (let i = 0; i < COLUMN_LENGTH; i++) {
    for (let j = 0; j < ROW_LENGTH; j++) {
      // check horizontal win - bounds check
      if (j < ROW_LENGTH - 2) {
        score += coordsCheckThree(
          board[i][j],
          board[i][j + 1],
          board[i][j + 2],
          player
        );
      }

      // check vertical win - bounds check
      if (i < COLUMN_LENGTH - 2) {
        score += coordsCheckThree(
          board[i][j],
          board[i + 1][j],
          board[i + 2][j],
          player
        );
      }

      // check diagonal rising - bounds check
      if (j < ROW_LENGTH - 2 && i > COLUMN_LENGTH - 2) {
        score += coordsCheckThree(
          board[i][j],
          board[i - 1][j + 1],
          board[i - 2][j + 2],
          player
        );
      }

      // diagonal falling - bounds check
      if (j > COLUMN_LENGTH - 2 && i > COLUMN_LENGTH - 2) {
        score += coordsCheckThree(
          board[i][j],
          board[i - 1][j - 1],
          board[i - 2][j - 2],
          player
        );
      }
    }
  }

  return score;
};

export const miniMaxThreePos = (
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
      return checkIfTwoOrThreeInRow(board, player);
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxThreePos(board, depth - 1, false, alpha, beta, player);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxThreePos(board, depth - 1, true, alpha, beta, player);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
    }
    return valueMin;
  }
};
