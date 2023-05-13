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
