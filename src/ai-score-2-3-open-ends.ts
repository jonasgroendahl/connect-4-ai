import {
  COLUMN_LENGTH,
  ROW_LENGTH,
  checkIfWinner,
  getAvailableMoves,
} from "./shared";
import { Board, BoardPosition, Player } from "./types";

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
      score += PLAYER_SCORE;
    }

    if (postion === null) {
      score += EMPTY_SORE;
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

export const fourInALineAi = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean
): number => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 1 || depth === 0;

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

      const score = fourInALineAi(board, depth - 1, false);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = fourInALineAi(board, depth - 1, true);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
    }
    return valueMin;
  }
};
