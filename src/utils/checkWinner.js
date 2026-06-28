export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board) {
  const winningCombination = WINNING_COMBINATIONS.find(([a, b, c]) => {
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });

  if (!winningCombination) {
    return { winner: null, combination: [] };
  }

  return {
    winner: board[winningCombination[0]],
    combination: winningCombination,
  };
}

export function isDraw(board) {
  return board.every(Boolean) && !checkWinner(board).winner;
}
