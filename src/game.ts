import prompt from "prompt-sync";
import { Board, BoardPosition, GameOutcome, Move, Player } from "./types";
import { aiMove } from "./ai";

const promptSync = prompt();

const board: Board = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];

const printBoard = () => {
  console.table(board);
};

const getAvailableMoves = () => {
  const availableMoves: [number, number][] = [];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
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

const checkIfWinner = () => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      // bounds check
      if (i < board.length - 3) {
        // horizontal
        const horizontalWinner = coordsCheck(
          board[i][j],
          board[i + 1][j],
          board[i + 2][j],
          board[i + 3][j]
        );
        if (horizontalWinner) return horizontalWinner;

        // diagonal downwards
        if (j < board.length - 3) {
          const diagonalDownardWinner = coordsCheck(
            board[i][j],
            board[i + 1][j + 1],
            board[i + 2][j + 2],
            board[i + 3][j + 3]
          );

          if (diagonalDownardWinner) return diagonalDownardWinner;
        }

        // diagonal upwards
        if (j > board.length - 3) {
          const diagonalUpwardWinner = coordsCheck(
            board[i][j],
            board[i + 1][j - 1],
            board[i + 2][j - 2],
            board[i + 3][j - 3]
          );

          if (diagonalUpwardWinner) return diagonalUpwardWinner;
        }
      }

      // check vertical win - bounds check
      if (j < board.length - 3) {
        const verticalWinner = coordsCheck(
          board[i][j],
          board[i][j + 1],
          board[i][j + 2],
          board[i][j + 3]
        );

        if (verticalWinner) return verticalWinner;
      }
    }
  }

  return undefined;
};

const validateUserMove = (
  moves: [number, number][],
  command: string
): { x: number; y: number } | undefined => {
  const userMove = Number(command);

  const aLegitMove = moves.find(function (move) {
    if (move[1] === userMove) {
      return move;
    }

    return false;
  });

  return aLegitMove ? { x: aLegitMove[0], y: aLegitMove[1] } : undefined;
};

const main = () => {
  let usersTurn: Player = "AI";

  console.log(
    "Welcome to Connect 4. When it is your turn, type coordinates as follows: x"
  );

  let gameIsRunning = true;
  let outcome: GameOutcome = "DRAW";

  while (gameIsRunning) {
    const moves = getAvailableMoves();

    console.log(moves);

    let move: Move | undefined = undefined;

    if (usersTurn === "HUMAN") {
      const moveCommand = promptSync(`👋 User's turn: `);
      move = validateUserMove(moves, moveCommand);
    } else {
      move = aiMove(board, moves);
    }

    if (!move) {
      console.log("Received invalid input. Try again 👇");
      continue;
    }

    board[move.x][move.y] = usersTurn;

    const winner = checkIfWinner();

    if (winner || moves.length === 1) {
      gameIsRunning = false;

      if (winner) outcome = winner;
    }

    if (usersTurn === "HUMAN") {
      usersTurn = "AI";
    } else {
      usersTurn = "HUMAN";
    }

    printBoard();
  }

  console.log(
    `Game over. Outcome: ${outcome} ${outcome !== "DRAW" && "wins"} `
  );
};

main();
