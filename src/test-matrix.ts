import {
  Board,
  GameOutcome,
  MainArgs,
  MainReturnType,
  MinimaxAlgo,
  Player,
} from "./types";
import {
  board as crazyBoard,
  checkIfWinner,
  getAvailableMoves,
} from "./shared";
import {
  miniMaxBest,
  miniMaxBestAlphaBeta,
  miniMaxBestAlphaBetaWithLookupTable,
  miniMaxBestAlphaBetaWithMoveOrdering,
  miniMaxBestAlphaBetaWithMoveOrderingAndLookupTable,
} from "./heuristics/ai-minimax-best";
import { miniMaxFourPositions, miniMaxFourPositionsAlphaBeta, miniMaxSecondBestTransTable } from "./heuristics/ai-4.positions";
import { miniMaxThreePos } from "./heuristics/ai-3-positions";
import { miniMaxCenter } from "./heuristics/ai-center";
import { miniMaxCheckWinLose } from "./heuristics/ai-check-win-lose";
import { miniMaxCheckWin } from "./heuristics/ai-check-win";
import { randomMove as randomMove } from "./heuristics/ai-random";

const printBoard = (board: Board) => {
  console.table(board);
};

const TIME_LIMIT = 300;

// allow the first player to use iterative deepening with this helper
const performIterativeDeeping = (
  board: Board,
  moves: [number, number][],
  algo: MinimaxAlgo
) => {
  let bestMove = moves[0];
  let bestScore = Infinity;
  const startTime = Date.now();

  for (let currentDepth = 1; ; currentDepth++) {
    if (Date.now() - startTime >= TIME_LIMIT) {
      // Time limit reached, stop searching
      break;
    }
    // go through all available moves, find the one with highest score
    for (const move of moves) {
      const [x, y] = move;

      board[x][y] = "HUMAN";

      const score = algo(board, currentDepth, true, -Infinity, Infinity);

      board[x][y] = null;

      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
};

const main = ({
  algoPlayer1,
  algoPlayer2,
  depthPlayer1,
  depthPlayer2,
  name,
  playerStarts,
  iterativePlayer1,
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

      if (iterativePlayer1) {
        bestMove = performIterativeDeeping(board, moves, algoPlayer1);
      } else if (algoPlayer1.name === randomMove.name) {
        bestMove = randomMove(board);
      } else {
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


const runTests = () => {
  console.log("Player1 Player2 Result");

  const totalScore = {};

  const tests = generateTests();
  for (const test of tests) {
    let round = 0;
    let outcomes: GameOutcome[] = [];
    let timeSpent = [0, 0];

    while (round <= 1) {
      // TODO: improve switching players and summarize score
      test.playerStarts = round % 2 == 0 ? "HUMAN" : "AI";
      const result = main(test);
      outcomes.push(result.outcome);
      timeSpent[0] += result.timeSpentPlayer1;
      timeSpent[1] += result.timeSpentPlayer2;

      round++;
    }

    let aiWins = 0;
    let humanWins = 0;
    let draw = 0;

    const name1 = test.algoPlayer1.name[0].toUpperCase() + test.algoPlayer1.name.replace(/[^A-Z]+/g, "");
    const name2 = test.algoPlayer2.name[0].toUpperCase() + test.algoPlayer2.name.replace(/[^A-Z]+/g, "");

    outcomes.forEach((outcome) => {
      if (outcome === "AI") {
        aiWins++;
        totalScore[name2] = (totalScore[name2] || 0) + 1;
      } else if (outcome === "HUMAN") {
        humanWins++;
        totalScore[name1] = (totalScore[name1] || 0) + 1;
      } else {
        draw++;
      }
    });
    
    console.log(`${name1}${test.depthPlayer1} ${name2}${test.depthPlayer2} ${humanWins},${draw},${aiWins}`);
  }

  console.log("Total scores", totalScore);
};

const algorithmsMiniMaxTest = [
  miniMaxThreePos,
  miniMaxFourPositions,
  miniMaxCenter,
  miniMaxCheckWinLose,
  miniMaxCheckWin,
  miniMaxBest,
];

const algorithmsTimeTest = [
  miniMaxBest,
  miniMaxBestAlphaBeta,
  miniMaxBestAlphaBetaWithLookupTable,
  miniMaxBestAlphaBetaWithMoveOrdering,
  miniMaxBestAlphaBetaWithMoveOrderingAndLookupTable
];

const allAlgorithms = [
  miniMaxThreePos,
  miniMaxFourPositions,
  miniMaxFourPositionsAlphaBeta,
  miniMaxSecondBestTransTable,
  miniMaxCenter,
  miniMaxCheckWinLose,
  miniMaxCheckWin,
  miniMaxBest,
  miniMaxBestAlphaBeta,
  miniMaxBestAlphaBetaWithLookupTable,
  miniMaxBestAlphaBetaWithMoveOrdering,
  randomMove
];


const generateTests = () => {
  const depths = [2,4];
  // const startPlayers = ["AI", "HUMAN"];
  const startPlayers = [""];
  const algorithms = algorithmsMiniMaxTest;
  // const algorithms = algorithmsTimeTest;

  algorithms.sort(function(a, b){
    return b.name.localeCompare(a.name); });

  const tests = [];

  for (let i1 = 0; i1 < algorithms.length; i1++) {
    const alg1 = algorithms[i1];
  // for (const alg1 of algorithms) {
  
    for (let i2 = i1; i2 < algorithms.length; i2++) {
      const alg2 = algorithms[i2];
    // for (const alg2 of algorithms) {

      for (const alt1_depth of depths) {
        for (const alt2_depth of depths) {

          if (alg1 != alg2 || alt1_depth != alt2_depth) {
            for (const startPlayer of startPlayers) {
              tests.push({
                algoPlayer1: alg1,
                algoPlayer2: alg2,
                depthPlayer1: alt1_depth,
                depthPlayer2: alt2_depth,
                playerStarts: startPlayer,
              });
            }
          }
          
        }
      }
    }
  }

  return tests;
}

runTests();
