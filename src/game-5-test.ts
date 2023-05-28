import { Board, GameOutcome, MainArgs, MainReturnType, Player } from "./types";
import {
  board as crazyBoard,
  checkIfWinner,
  getAvailableMoves,
} from "./shared";
import { miniMaxBest, miniMaxBestAlphaBeta } from "./ai-minimax-best";
import { fourInALineAi } from "./ai-score-2-3-open-ends";

const printBoard = (board: Board) => {
  console.table(board);
};

const main = ({
  algoPlayer1,
  algoPlayer2,
  depthPlayer1,
  depthPlayer2,
  name,
  playerStarts,
}: MainArgs): MainReturnType => {
  const board = JSON.parse(JSON.stringify(crazyBoard)) as Board;

  const timeSpent = [0, 0];

  let usersTurn: Player = playerStarts ?? "HUMAN";

  let gameIsRunning = true;
  let outcome: GameOutcome = "DRAW";

  while (gameIsRunning) {
    const moves = getAvailableMoves(board);

    let move: [number, number] = undefined;

    let bestMove = moves[0];

    if (usersTurn === "HUMAN") {
      let bestScore = Infinity;

      const startTime = process.hrtime();

      // go through all available moves, find the one with highest score
      for (const move of moves) {
        const [x, y] = move;

        board[x][y] = "HUMAN";

        const score = algoPlayer1(
          board,
          depthPlayer1,
          true,
          -Infinity,
          Infinity
        );

        board[x][y] = null;

        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      const endTime = process.hrtime(startTime);
      timeSpent[0] += (endTime[0] * 1e9 + endTime[1]) / 1e6;
    } else {
      let bestScore = -Infinity;

      const startTime = process.hrtime();

      // go through all available moves, find the one with highest score
      for (const move of moves) {
        const [x, y] = move;

        board[x][y] = "AI";

        const score = algoPlayer2(
          board,
          depthPlayer2,
          false,
          -Infinity,
          Infinity
        );

        board[x][y] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      const endTime = process.hrtime(startTime);
      timeSpent[1] += (endTime[0] * 1e9 + endTime[1]) / 1e6;
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

    // printBoard(board);
  }

  return {
    outcome: outcome,
    timeSpentPlayer1: timeSpent[0],
    timeSpentPlayer2: timeSpent[1],
  };
};

const tests: MainArgs[] = [
  {
    name: "Minimax vs Minimax Alpha Beta - Best minimax - Depth 3",
    algoPlayer1: miniMaxBest,
    algoPlayer2: miniMaxBestAlphaBeta,
    depthPlayer1: 3,
    depthPlayer2: 3,
    playerStarts: "HUMAN",
  },
  {
    name: "Minimax vs Minimax Alpha Beta - Best minimax - Depth 2",
    algoPlayer1: miniMaxBest,
    algoPlayer2: miniMaxBestAlphaBeta,
    depthPlayer1: 1,
    depthPlayer2: 1,
    playerStarts: "HUMAN",
  },
  {
    name: "Minimax best vs 2-3-opens-ends - Depth 3 vs depth 3",
    algoPlayer1: miniMaxBest,
    algoPlayer2: fourInALineAi,
    depthPlayer1: 3,
    depthPlayer2: 3,
    playerStarts: "HUMAN",
  },
  {
    name: "Minimax best vs 2-3-opens-ends - Depth 3 vs depth 4",
    algoPlayer1: miniMaxBest,
    algoPlayer2: fourInALineAi,
    depthPlayer1: 3,
    depthPlayer2: 4,
    playerStarts: "HUMAN",
  },
  {
    name: "Minimax best vs 2-3-opens-ends - Depth 2 vs depth 4",
    algoPlayer1: miniMaxBest,
    algoPlayer2: fourInALineAi,
    depthPlayer1: 2,
    depthPlayer2: 4,
    playerStarts: "HUMAN",
  },
  {
    name: "Minimax best vs 2-3-opens-ends - Depth 3 vs depth 2",
    algoPlayer1: miniMaxBest,
    algoPlayer2: fourInALineAi,
    depthPlayer1: 3,
    depthPlayer2: 2,
    playerStarts: "HUMAN",
  },
];

const runTests = () => {
  for (const test of tests) {
    console.log("Running test", test.name);

    let round = 0;
    let outcomes: GameOutcome[] = [];
    let timeSpent = [0, 0];

    while (round <= 10) {
      const result = main(test);
      outcomes.push(result.outcome);
      timeSpent[0] += result.timeSpentPlayer1;
      timeSpent[1] += result.timeSpentPlayer2;

      round++;
    }

    let aiWins = 0;
    let humanWins = 0;
    let draw = 0;

    outcomes.forEach((outcome) => {
      if (outcome === "AI") {
        aiWins++;
      } else if (outcome === "HUMAN") {
        humanWins++;
      } else {
        draw++;
      }
    });

    console.log("Result for", test.name);
    console.log({
      player: "AI",
      wins: aiWins,
      time: timeSpent[1],
    });
    console.log({
      player: "HUMAN",
      wins: humanWins,
      timeSpent: timeSpent[0],
    });
    console.log("draws", draw);
    console.log("\n\n");
  }
};

runTests();
