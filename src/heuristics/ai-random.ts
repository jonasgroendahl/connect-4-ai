import { getAvailableMoves } from "../shared";
import { Board } from "../types";

export const aiRandomMove = (board: Board) => {
  const moves = getAvailableMoves(board);

  const numberOfMoves = moves.length;

  const randomInteger = Math.floor(Math.random() * numberOfMoves);

  console.log(moves, randomInteger);

  return moves[randomInteger];
};
