import {
  COLUMN_LENGTH,
  ROW_LENGTH,
  checkIfWinner,
  getAvailableMoves,
} from "./shared";
import { Board, Player } from "./types";

const scorePosition = (board: Board): number => {
  let score = 0;

  // Evaluate horizontally
  for (let row = 0; row < COLUMN_LENGTH; row++) {
    for (let col = 0; col < ROW_LENGTH - 3; col++) {
      const slice = board[row].slice(col, col + 4);
      score += evaluateSlice(slice);
    }
  }

  // Evaluate vertically
  for (let col = 0; col < ROW_LENGTH; col++) {
    for (let row = 0; row < COLUMN_LENGTH - 3; row++) {
      const slice = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
      ];
      score += evaluateSlice(slice);
    }
  }

  // Evaluate diagonally (top-left to bottom-right)
  for (let row = 0; row < COLUMN_LENGTH - 3; row++) {
    for (let col = 0; col < ROW_LENGTH - 3; col++) {
      const slice = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ];
      score += evaluateSlice(slice);
    }
  }

  // Evaluate diagonally (top-right to bottom-left)
  for (let row = 0; row < COLUMN_LENGTH - 3; row++) {
    for (let col = 3; col < ROW_LENGTH; col++) {
      const slice = [
        board[row][col],
        board[row + 1][col - 1],
        board[row + 2][col - 2],
        board[row + 3][col - 3],
      ];
      score += evaluateSlice(slice);
    }
  }

  // Bonus score for center column
  const centerCol = Math.floor(ROW_LENGTH / 2);
  for (let row = 0; row < COLUMN_LENGTH; row++) {
    const cell = board[row][centerCol];
    if (cell === "AI") {
      score += 5;
    } else if (cell === "HUMAN") {
      score -= 5;
    }
  }

  return score;
};

const evaluateSlice = (slice: (Player | null)[]): number => {
  let aiCount = 0;
  let humanCount = 0;
  let emptyCount = 0;

  for (const cell of slice) {
    if (cell === "AI") {
      aiCount++;
    } else if (cell === "HUMAN") {
      humanCount++;
    } else {
      emptyCount++;
    }
  }

  if (aiCount === 4) {
    return 1000000;
  } else if (aiCount === 3 && emptyCount === 1) {
    return 100;
  } else if (aiCount === 2 && emptyCount === 2) {
    return 10;
  } else if (aiCount === 1 && emptyCount === 3) {
    return 1;
  } else if (humanCount === 4) {
    return -1000000;
  } else if (humanCount === 3 && emptyCount === 1) {
    return -100;
  } else if (humanCount === 2 && emptyCount === 2) {
    return -10;
  } else if (humanCount === 1 && emptyCount === 3) {
    return -1;
  }

  return 0; // Empty slice or no immediate advantage for either player
};

export const miniMaxBest = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean
): number => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 0 || depth === 0;

  if (isTerminal) {
    // check for winners
    if (winner) {
      if (winner === "AI") {
        return 9999999;
      } else {
        return -99999999;
      }
    }

    if (depth === 0) {
      return scorePosition(board);
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxBest(board, depth - 1, false);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxBest(board, depth - 1, true);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
    }
    return valueMin;
  }
};

export const miniMaxBestAlphaBeta = (
  board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number
): number => {
  const moves = getAvailableMoves(board);
  const winner = checkIfWinner(board);

  const isTerminal = winner || moves.length === 0 || depth === 0;

  if (isTerminal) {
    // check for winners
    if (winner) {
      if (winner === "AI") {
        return 9999999;
      } else {
        return -99999999;
      }
    }

    if (depth === 0) {
      return scorePosition(board);
    }

    return 0;
  }

  if (isMaximizingPlayer) {
    let valueMax = -Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "AI";

      const score = miniMaxBestAlphaBeta(board, depth - 1, false, alpha, beta);

      board[x][y] = null;

      valueMax = Math.max(score, valueMax);
      alpha = Math.max(alpha, valueMax);

      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    return valueMax;
  } else {
    let valueMin = Infinity;

    for (const [x, y] of moves) {
      board[x][y] = "HUMAN";

      const score = miniMaxBestAlphaBeta(board, depth - 1, true, alpha, beta);

      board[x][y] = null;

      valueMin = Math.min(score, valueMin);
      beta = Math.min(beta, valueMin);

      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    return valueMin;
  }
};

/*

To summarize the heuristics that we've tried:

[1] Center column

[2] Consider a slice of 4 positions:
Count amount of player positions

[3] Consider a slice of 4 positions:
Count amount of player positions and empty slots
If other player detected, set score to 0 
  otherwise +2 for each player position and +0.5 for each empty
  
[4] Consider a slice of 4 positions:
Count amount of player positions and empty slots
Score 100 if 3 player and 1 empty
Score 10 if 2 player and 2 empty
Score 1 if 1 player and 3 empty

[5] Combine [1] and [4] ai-minimax-best
  

Other things that can be done:

[x] Iterative Deepening: Instead of using a fixed depth for the minimax algorithm, you can implement an iterative deepening approach. Start with a depth of 1 and gradually increase it until a certain time limit is reached. This allows the AI to explore deeper levels of the game tree within the given time constraints.

[-] Move Ordering: Implement move ordering heuristics to improve the effectiveness of alpha-beta pruning. Start by evaluating moves that are more likely to be good moves first. For example, prioritize moves in the center columns or moves that connect to existing AI pieces. This can help prune more branches early and improve the AI's decision-making process.

We could do this one by sorting the moves in the minimax algorithm - example heuristic:

"The heuristic used prioritizes moves in the center columns of the board, as they are generally considered more strategically advantageous."

[x] Transposition Table: Use a transposition table to store previously evaluated board positions and their associated scores. This can help avoid redundant evaluations and improve the efficiency of the AI's search. Ensure that you implement proper hash functions to generate unique keys for each board position.

[x] Evaluation Function: Enhance the evaluation function (scorePosition) to consider more advanced patterns and strategic elements. For example, assign higher scores to positions that create multiple potential winning opportunities or positions that block the opponent's potential wins. Additionally, consider factors like mobility, central control, and open columns when evaluating the board state.

[] Monte Carlo Tree Search (MCTS): Consider implementing Monte Carlo Tree Search, which combines tree search and random simulations to make decisions. MCTS can be particularly effective in games with large branching factors like Connect 4. It allows the AI to explore different lines of play more effectively and make smarter decisions.

[] Machine Learning: Train a neural network or other machine learning models to learn from large datasets of Connect 4 games. The AI can use the learned knowledge to make smarter decisions based on patterns and strategies observed during training.

By combining these strategies and enhancements, you can create an even smarter Connect 4 AI that can make strategic decisions, explore the game tree efficiently, and adapt to different gameplay scenarios.
*/
