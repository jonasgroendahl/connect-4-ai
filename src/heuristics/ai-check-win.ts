import { checkIfWinner, getAvailableMoves } from "../shared";
import { Board, Player } from "../types";

export const miniMaxCheckWin = (
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
      if (winner === "AI" && player === "AI") {
        return 9999999;
      } else if (winner === "HUMAN" && player === "HUMAN") {
        return -9999999;
      }
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxCheckWin(board, depth - 1, false, alpha, beta, player);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxCheckWin(board, depth - 1, true, alpha, beta, player);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
    }
    return valueMin;
  }
};
