import { getAvailableMoves } from "../shared";
import { Board } from "../types";

export const randomMove = (board: Board) => {
  const moves = getAvailableMoves(board);

  const numberOfMoves = moves.length;

  const randomInteger = Math.floor(Math.random() * numberOfMoves);

  return moves[randomInteger];
};
