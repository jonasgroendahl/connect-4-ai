import prompt from "prompt-sync";

const promptSync = prompt();

type Player = "X" | "O";

type GameOutcome = Player | "DRAW";

type BoardPosition = null | Player;

type Board = [
  [BoardPosition, BoardPosition, BoardPosition, BoardPosition],
  [BoardPosition, BoardPosition, BoardPosition, BoardPosition],
  [BoardPosition, BoardPosition, BoardPosition, BoardPosition],
  [BoardPosition, BoardPosition, BoardPosition, BoardPosition],
  [BoardPosition, BoardPosition, BoardPosition, BoardPosition]
];

const board: Board = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

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
  for (const player of ["X", "O"]) {
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

const main = () => {
  let usersTurn: Player = "O";

  console.log(
    "Welcome to Connect 4. When it is your turn, type coordinates as follows: x,y "
  );

  let gameIsRunning = true;
  let outcome: GameOutcome = "DRAW";

  while (gameIsRunning) {
    const move = promptSync(`${usersTurn}'s turn: `);

    const moves = getAvailableMoves();

    const userMove = move.split(",").map((coord) => Number(coord));

    if (moves.find((m) => userMove[0] === m[0] && userMove[1] === m[1])) {
      board[userMove[0]][userMove[1]] = usersTurn;

      const winner = checkIfWinner();

      if (winner || moves.length === 1) {
        gameIsRunning = false;

        if (winner) outcome = winner;
      }

      if (usersTurn === "O") {
        usersTurn = "X";
      } else {
        usersTurn = "O";
      }
    } else {
      console.log("Received invalid input. Try again");
    }
  }

  console.log(
    `Game over. Outcome: ${outcome} ${outcome !== "DRAW" && "wins"} `
  );
};

main();
