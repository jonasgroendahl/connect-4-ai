import prompt from "prompt-sync";
import { Board, BoardPosition, GameOutcome, Player } from "./types";
import {
  board,
  checkIfWinner,
  getAvailableMoves,
  validateUserMove,
} from "./shared";
import { miniMax } from "./ai";
import { aiRandomMove } from "./ai-random";
import { miniMaxSimple } from "./ai-simple";
import { miniMaxSimpleAlphaBeta } from "./ai-simple-alpha-beta";
import { miniMaxCenter } from "./ai-score-center";
import { miniMaxCenterFirstMoves } from "./ai-score-center-first-moves";

const promptSync = prompt();

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

    if (usersTurn === "HUMAN") {
      const moveCommand = promptSync(`👋 Choose column (0-6): `);
      move = validateUserMove(moves, moveCommand);
    } else {
      let bestMove = moves[0];
      let bestScore = -Infinity;

      // go through all available moves, find the one with highest score
      for (const move of moves) {
        const [x, y] = move;

        board[x][y] = "AI";

        console.log("move", move);
        const score = miniMaxCenter(board, 1, false);
        console.log("score", score);

        board[x][y] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      move = bestMove;

      //move = aiRandomMove(moves);
    }

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
