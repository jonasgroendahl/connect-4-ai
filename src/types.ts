export type Player = "HUMAN" | "AI";

export type GameOutcome = Player | "DRAW";

export type BoardPosition = null | Player;

export type Board = [
  [
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition
  ],
  [
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition
  ],
  [
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition
  ],
  [
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition
  ],
  [
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition
  ],
  [
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition,
    BoardPosition
  ]
];

export type Move = { x: number; y: number };

export type MinimaxAlgo = (
  Board: Board,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha?: number,
  beta?: number,
  currentPlayer?: Player
) => number;

export type MainArgs = {
  name: string;
  algoPlayer1: MinimaxAlgo;
  algoPlayer2: MinimaxAlgo;
  depthPlayer1: number;
  depthPlayer2: number;
  playerStarts?: Player;
  iterativePlayer1?: boolean;
};

export type MainReturnType = {
  outcome: GameOutcome;
  timeSpentPlayer1: number;
  timeSpentPlayer2: number;
  movesPlayer1: number;
  movesPlayer2: number;
};
