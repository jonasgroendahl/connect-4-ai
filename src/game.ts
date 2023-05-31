import { Board, GameOutcome, MinimaxAlgo, Player } from "./types";
import {
  board,
  checkIfWinner,
  getAvailableMoves,
  validateUserMove,
} from "./shared";
import {
  miniMaxBest,
  miniMaxBestAlphaBeta,
} from "./heuristics/ai-minimax-best";
import inquirer from "inquirer";
import {
  miniMaxFourPositions,
  miniMaxFourPositionsAlphaBeta,
} from "./heuristics/ai-4.positions";
import { miniMaxCenter } from "./heuristics/ai-center";
import { miniMaxCheckWin } from "./heuristics/ai-check-win";
import { miniMaxCheckWinLose } from "./heuristics/ai-check-win-lose";
import { aiRandomMove } from "./heuristics/ai-random";
import { miniMaxThreePos } from "./heuristics/ai-3-positions";

const printBoard = (board: Board) => {
  console.table(board);
};

export const performIterativeDeeping = (
  board: Board,
  moves: [number, number][],
  algo: MinimaxAlgo,
  timeLimit: number
) => {
  let bestMove = moves[0];
  let bestScore = -Infinity;
  const startTime = Date.now();
  let currentDepth = 1;

  while (Date.now() - startTime < timeLimit) {
    // go through all available moves, find the one with highest score
    for (const move of moves) {
      const [x, y] = move;

      board[x][y] = "AI";

      const score = algo(board, currentDepth, false, -Infinity, Infinity);

      board[x][y] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
};

const algorithmMap = (name: string, alphaBeta: boolean) => {
  switch (name) {
    case "minimax-best":
    case "minimax-best-with-iterative-deepening":
      if (alphaBeta) {
        return miniMaxBestAlphaBeta;
      }
      return miniMaxBest;

    case "minimax-4-positions":
      if (alphaBeta) {
        return miniMaxFourPositionsAlphaBeta;
      }
      return miniMaxFourPositions;
    case "minimax-center":
      return miniMaxCenter;
    case "minimax-check-win":
      return miniMaxCheckWin;
    case "minimax-check-win-lose":
      return miniMaxCheckWinLose;
    case "minimax-3-positions":
      return miniMaxThreePos;
  }
};

const main = async () => {
  let usersTurn: Player = "AI";

  let gameIsRunning = true;
  let outcome: GameOutcome = "DRAW";

  const choices = await inquirer.prompt([
    {
      name: "heuristic",
      message: "Choose heuristic / Algorithm",
      choices: [
        "random",
        "minimax-best",
        "minimax-4-positions",
        "minimax-3-positions",
        "minimax-center",
        "minimax-check-win",
        "minimax-check-win-lose",
      ],
      type: "list",
    },
    {
      name: "alpha-beta",
      message: "Use alpha beta pruning?",
      type: "confirm",
      when: function (answer) {
        return (
          answer.heuristic === "minimax-best" ||
          answer.heuristic === "4-positions" ||
          answer.heuristic === "minimax-best-with-iterative-deepening"
        );
      },
    },
    {
      name: "iterative",
      message: "Use iterative deepening?",
      type: "confirm",
      when: function (answer) {
        return answer.heuristic === "minimax-best";
      },
    },
    {
      name: "depth",
      message: "Depth",
      type: "input",
      validate: function (value) {
        if (value >= 0 && value <= 10) {
          return true;
        }
        return "Please enter a number between 0 and 10.";
      },
      when: function (answer) {
        return answer.heuristic !== "random" && !answer.iterative;
      },
    },
    {
      name: "time",
      message:
        "Enter amount of time AI can use to make a move in milliseconds (eg. 1000 = 1 second)",
      type: "input",
      when: function (answer) {
        return answer.iterative === true;
      },
      validate: function (value) {
        if (value >= 0 && value <= 10000) {
          return true;
        }
        return "Please enter a number between 0 and 10000.";
      },
    },
  ]);

  while (gameIsRunning) {
    const moves = getAvailableMoves(board);

    let move: [number, number] = undefined;

    if (usersTurn === "HUMAN") {
      const moveCommand = await inquirer.prompt([
        {
          name: "column",
          message: `👋 Choose column (0-6): `,
          type: "input",
          validate: function (value) {
            if (value >= 0 && value <= 6) {
              return true;
            }
            return "Please enter a number between 0 and 6.";
          },
        },
      ]);

      move = validateUserMove(moves, moveCommand.column);
    } else {
      let bestMove = moves[0];
      let bestScore = -Infinity;

      const startTime = process.hrtime();

      if (choices.heuristic === "random") {
        bestMove = aiRandomMove(board);
      } else if (choices.iterative) {
        bestMove = performIterativeDeeping(
          board,
          moves,
          algorithmMap(choices.heuristic, choices?.["alpha-beta"] ?? false),
          choices.time
        );
      } else {
        // go through all available moves, find the one with highest score
        for (const move of moves) {
          const [x, y] = move;

          board[x][y] = "AI";

          const score = algorithmMap(
            choices.heuristic,
            choices?.["alpha-beta"] ?? false
          )(board, choices.depth, false, -Infinity, Infinity);

          board[x][y] = null;

          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
      }

      move = bestMove;
      const endTime = process.hrtime(startTime);
      const timeSpent = (endTime[0] * 1e9 + endTime[1]) / 1e6;

      console.log(`⏱️  ${Math.floor(timeSpent)} milliseconds elapsed`);
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

  let finalMessage = "Game over. Outcome: ";

  if (outcome === "AI") {
    finalMessage += `AI wins 🤖`;
  } else if (outcome === "HUMAN") {
    finalMessage += `Human wins 🧍`;
  } else {
    finalMessage += "Draw";
  }

  console.log(finalMessage);
};

main();
