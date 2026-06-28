import { describe, expect, test } from 'vitest';
import { checkWinner, isDraw, WINNING_COMBINATIONS } from '../utils/checkWinner';

describe('checkWinner', () => {
  test('detects every tic-tac-toe winning combination', () => {
    WINNING_COMBINATIONS.forEach((combo) => {
      const board = Array(9).fill(null);
      combo.forEach((index) => {
        board[index] = 'X';
      });

      expect(checkWinner(board)).toEqual({
        winner: 'X',
        combination: combo,
      });
    });
  });

  test('returns no winner when a team has only two consecutive marks', () => {
    const board = ['O', 'O', null, null, 'X', null, null, null, 'X'];

    expect(checkWinner(board)).toEqual({
      winner: null,
      combination: [],
    });
  });

  test('detects a draw only when all cells are filled without a winner', () => {
    const drawBoard = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const activeBoard = ['X', 'O', 'X', null, 'O', 'O', 'O', 'X', 'X'];

    expect(isDraw(drawBoard)).toBe(true);
    expect(isDraw(activeBoard)).toBe(false);
  });
});
