import { Board, Player } from "./types";

// TODO: this function is rather dumb so far
const scorePosition = (
  board: Board,
  position: [number, number],
  player: Player
) => {
  let score = 0;

  // count amount of player's nodes in a horizontal row, the more the better
  for (let j = 0; j < board[position[0]].length; j++) {
    if (board[position[0]][j] === player) {
      score += 1;
    }
  }

  return score;
};

export const aiMove = (board: Board, availableMoves: [number, number][]) => {
  // run the score position function for all available moves to determine best choice
  const bestMove = availableMoves.sort(
    (x, y) => scorePosition(board, y, "AI") - scorePosition(board, x, "AI")
  )[0];

  // TODO: minimax algorithm to look ahead to determine best move

  return { x: bestMove[0], y: bestMove[1] };
};
