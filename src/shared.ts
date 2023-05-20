import { Board, BoardPosition, Player } from "./types";

export const board: Board = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];

const ROW_LENGTH = board[0].length;
const COLUMN_LENGTH = board.length;

export const getAvailableMoves = (board: Board) => {
  const availableMoves: [number, number][] = [];

  for (let i = 0; i < COLUMN_LENGTH; i++) {
    for (let j = 0; j < ROW_LENGTH; j++) {
      // check if space is empty && (bottom row or item underneath spot)
      if (
        board[i][j] === null &&
        (i === board.length - 1 || board[i + 1][j] !== null)
      ) {
        availableMoves.push([i, j]);
      }
    }
  }

  return availableMoves;
};

const coordsCheck = (
  first: BoardPosition,
  second: BoardPosition,
  third: BoardPosition,
  fourth: BoardPosition
) => {
  const players: Player[] = ["AI", "HUMAN"];

  for (const player of players) {
    if (
      first === player &&
      second === player &&
      third === player &&
      fourth === player
    ) {
      return player;
    }
  }

  return undefined;
};

export const checkIfWinner = (board: Board) => {
  for (let i = 0; i < COLUMN_LENGTH; i++) {
    for (let j = 0; j < ROW_LENGTH; j++) {
      // check horizontal win - bounds check
      if (j < ROW_LENGTH - 3) {
        const horizontalWinner = coordsCheck(
          board[i][j],
          board[i][j + 1],
          board[i][j + 2],
          board[i][j + 3]
        );
        if (horizontalWinner) return horizontalWinner;
      }

      // check vertical win - bounds check
      if (i < COLUMN_LENGTH - 3) {
        const verticalWinner = coordsCheck(
          board[i][j],
          board[i + 1][j],
          board[i + 2][j],
          board[i + 3][j]
        );

        if (verticalWinner) return verticalWinner;
      }

      // check diagonal rising - bounds check
      if (j < ROW_LENGTH - 3 && i > COLUMN_LENGTH - 3) {
        const diagonalRisingWinner = coordsCheck(
          board[i][j],
          board[i - 1][j + 1],
          board[i - 2][j + 2],
          board[i - 3][j + 3]
        );

        if (diagonalRisingWinner) return diagonalRisingWinner;
      }

      // diagonal falling - bounds check
      if (j > COLUMN_LENGTH - 3 && i > COLUMN_LENGTH - 3) {
        const diagonalFaillingWinner = coordsCheck(
          board[i][j],
          board[i - 1][j - 1],
          board[i - 2][j - 2],
          board[i - 3][j - 3]
        );

        if (diagonalFaillingWinner) return diagonalFaillingWinner;
      }
    }
  }

  return undefined;
};

export const validateUserMove = (
  moves: [number, number][],
  command: string
): [number, number] | undefined => {
  const userMove = Number(command);

  const aLegitMove = moves.find(function (move) {
    if (move[1] === userMove) {
      return move;
    }

    return false;
  });

  if (aLegitMove) {
    return aLegitMove;
  }

  return undefined;
};
