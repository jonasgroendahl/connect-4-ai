import { checkIfWinner, getAvailableMoves } from "./shared";
import { Board, Player } from "./types";

// this scoring function is generated
function scorePositionGpt(
  board: Board,
  position: [number, number],
  player: Player
) {
  const [x, y] = position;
  const numRows = board.length;
  const numCols = board[0].length;

  // Define the directions to check for winning patterns
  const directions: [number, number][] = [
    [1, 0], // Horizontal
    [0, 1], // Vertical
    [1, 1], // Diagonal (top-left to bottom-right)
    [-1, 1], // Diagonal (bottom-left to top-right)
  ];

  let score = 0;

  // Check for patterns in all directions
  for (const [dx, dy] of directions) {
    let count = 0; // Number of consecutive pieces of the player in a direction
    let openEnds = 1; // Number of open ends in a direction

    // Check in both directions from the current position
    for (let direction = -1; direction <= 1; direction += 2) {
      let i = x + direction * dx;
      let j = y + direction * dy;

      while (
        i >= 0 &&
        i < numRows &&
        j >= 0 &&
        j < numCols &&
        board[i][j] === player
      ) {
        count++;
        i += direction * dx;
        j += direction * dy;
      }

      if (
        i >= 0 &&
        i < numRows &&
        j >= 0 &&
        j < numCols &&
        board[i][j] === null
      ) {
        openEnds++;
      }
    }

    // Score the pattern based on the count and open ends
    if (count >= 4) {
      score += player === "AI" ? 1000 : -1000; // Winning pattern
    } else if (count === 3 && openEnds === 2) {
      score += player === "AI" ? 100 : -100; // Potential winning pattern
    } else if (count === 2 && openEnds === 2) {
      score += player === "AI" ? 10 : -10; // Potential two-in-a-row pattern
    } else if (count === 1 && openEnds === 2) {
      score += player === "AI" ? 1 : -1; // Potential one-in-a-row pattern
    }
  }

  return score;
}

export const miniMaxAlphaBeta = (
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
        return 99999;
      } else {
        return -99999;
      }
    }

    if (depth === 0) {
      return scorePositionGpt(
        board,
        moves[0],
        isMaximizingPlayer ? "HUMAN" : "AI"
      );
    }

    // last move, draw, return 0
    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxAlphaBeta(board, depth - 1, false, alpha, beta);

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

      const score = miniMaxAlphaBeta(board, depth - 1, true, alpha, beta);

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
