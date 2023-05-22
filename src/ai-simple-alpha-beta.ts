import { checkIfWinner, getAvailableMoves } from "./shared";
import { Board } from "./types";

export const miniMaxSimpleAlphaBeta = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number
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

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxSimpleAlphaBeta(
        board,
        depth - 1,
        false,
        alpha,
        beta
      );

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);

      alpha = Math.max(alpha, valueMax);
      if (alpha >= beta) {
        break;
      }
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxSimpleAlphaBeta(board, depth - 1, true, alpha, beta);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);

      beta = Math.min(beta, valueMin);

      if (alpha >= beta) {
        break;
      }
    }
    return valueMin;
  }
};
