import prompt from "prompt-sync";
import { Board, GameOutcome, Player } from "./types";
import {
  board,
  checkIfWinner,
  getAvailableMoves,
  validateUserMove,
} from "./shared";
import { miniMaxBest } from "./heuristics/ai-minimax-best";

const promptSync = prompt();

const printBoard = (board: Board) => {
  console.table(board);
};

const TIME_LIMIT = 2000; // Time limit in milliseconds

const main = () => {
  let usersTurn: Player = "AI";

  let gameIsRunning = true;
  let outcome: GameOutcome = "DRAW";

  while (gameIsRunning) {
    const moves = getAvailableMoves(board);
    let currentDepth = 1;
    const startTime = Date.now();

    let move: [number, number] = undefined;

    if (usersTurn === "HUMAN") {
      const moveCommand = promptSync(`👋 Choose column (0-6): `);
      move = validateUserMove(moves, moveCommand);
    } else {
      let bestMove = moves[0];
      let bestScore = -Infinity;

      while (Date.now() - startTime < TIME_LIMIT) {
        // go through all available moves, find the one with highest score
        for (const move of moves) {
          const [x, y] = move;

          board[x][y] = "AI";

          const score = miniMaxBest(board, currentDepth, false);

          board[x][y] = null;

          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
        currentDepth++; // Increase the search depth

        move = bestMove;

        //move = aiRandomMove(moves);
      }
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
