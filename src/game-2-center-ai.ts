import prompt from "prompt-sync";
import { Board, GameOutcome, Player } from "./types";
import { board, checkIfWinner, getAvailableMoves } from "./shared";
import { miniMaxCenterAi } from "./ai-score-center-ai";

const printBoard = (board: Board) => {
  console.table(board);
};

const main = () => {
  let usersTurn: Player = "AI";

  let gameIsRunning = true;
  let outcome: GameOutcome = "DRAW";

  while (gameIsRunning) {
    const moves = getAvailableMoves(board);

    let move: [number, number] = undefined;

    let bestMove = moves[0];

    if (usersTurn === "HUMAN") {
      let bestScore = Infinity;

      // go through all available moves, find the one with highest score
      for (const move of moves) {
        const [x, y] = move;

        board[x][y] = "HUMAN";

        console.log(move);
        const score = miniMaxCenterAi(board, 2, false, "HUMAN");
        console.log(score);

        board[x][y] = null;

        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = -Infinity;

      // go through all available moves, find the one with highest score
      for (const move of moves) {
        const [x, y] = move;

        board[x][y] = "AI";

        const score = miniMaxCenterAi(board, 2, false, "AI");

        board[x][y] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      //move = aiRandomMove(moves);
    }
    move = bestMove;

    if (!move) {
      console.log("Received invalid input. Try again 👇");
      continue;
    }

    const [x, y] = move;

    board[x][y] = usersTurn;

    const winner = checkIfWinner(board);

    if (winner || moves.length === 1) {
      gameIsRunning = false;

      if (winner) outcome = winner;
    }

    if (usersTurn === "HUMAN") {
      usersTurn = "AI";
    } else {
      usersTurn = "HUMAN";
    }

    printBoard(board);
  }

  console.log(
    `Game over. Outcome: ${outcome} ${outcome !== "DRAW" && "wins"} `
  );
};

main();
