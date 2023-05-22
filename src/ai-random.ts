import { Board } from "./types";

export const aiRandomMove = (board: Board, moves: [number, number][]) => {
  const numberOfMoves = moves.length;

  const randomInteger = Math.floor(Math.random() * numberOfMoves);

  console.log(moves, randomInteger);

  return moves[randomInteger];
};
