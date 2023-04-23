const minimaxSearch = (game, state) => {
  // returns an action
  // player <- game.toMove(state)
  // value,move <- maxValue(game, state)
  // return move
};

const maxValue = (game, state) => {
  // returns a (utility,move) pair
  // if game.isTerminal(state) return game.utility(state, player), null
  // v <- -infinite
  // for each a in game.actions(state) do
  // v2, a2 <- minValue(game,game.result(state, a))
  // if v2 < v then
  //    v,move <- v2, a
  //  return v, move
};

const minValue = (game, state) => {
  // returns a (utility,move) pair
  // if game.isTerminal(state) return game.utility(state, player), null
  // v <- +infinite
  // for each a in game.actions(state) do
  // v2, a2 <- maxValue(game,game.result(state, a))
  // if v2 < v then
  //    v,move <- v2, a
  //  return v, move
};

// from youtube vid
function minimax(position, depth, maximizingPlayer) {
  //if depth == 0 or game in position
  //   return state eval of position
  // if maximizingPlayer
  //   maxEval = -infinity
  //   for each child of position
  //     eval = minimax(child, depth - 1, false)
  //     maxEval = max(maxEval, eval)
  //   return maxEval
  // else
  //   minEval = +infinity
  //   for each child of position
  //     eval = minimax(child, depth - 1, false)
  //     minEval = min(maxEval, eval)
  //   return minEval
}
