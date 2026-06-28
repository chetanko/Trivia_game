import { describe, expect, test } from 'vitest';
import { resolveIncorrectAnswer } from '../context/GameContext.jsx';

function createQuestionState(overrides = {}) {
  return {
    status: 'playing',
    board: Array(9).fill(null),
    winningCombination: [],
    currentTeam: 'X',
    selectedCell: 0,
    activeQuestion: { id: 'q1', prompt: 'Question?' },
    currentResponder: 'X',
    stealFor: null,
    answerVisible: false,
    timerRemaining: 30,
    settings: {
      timerDuration: 30,
      stealEnabled: true,
    },
    teams: {
      X: { mark: 'X', name: 'Team X', score: 0 },
      O: { mark: 'O', name: 'Team O', score: 0 },
    },
    stats: {
      totalAsked: 1,
      correct: 0,
      incorrect: 0,
      skipped: 0,
    },
    result: null,
    ...overrides,
  };
}

describe('resolveIncorrectAnswer', () => {
  test('claims the selected cell for the opponent when the current team is incorrect', () => {
    const resolved = resolveIncorrectAnswer(createQuestionState());

    expect(resolved.board[0]).toBe('O');
    expect(resolved.teams.O.score).toBe(1);
    expect(resolved.stats.incorrect).toBe(1);
    expect(resolved.currentTeam).toBe('O');
    expect(resolved.activeQuestion).toBeNull();
    expect(resolved.selectedCell).toBeNull();
    expect(resolved.stealFor).toBeNull();
  });
});
