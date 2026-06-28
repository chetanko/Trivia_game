import { describe, expect, test } from 'vitest';
import { evaluateSelectedOption } from '../utils/answerSelection';

const question = {
  correctAnswer: 'B',
};

describe('evaluateSelectedOption', () => {
  test('returns true when a selected option matches the correct answer', () => {
    expect(evaluateSelectedOption(question, 'b')).toBe(true);
  });

  test('returns false when a selected option does not match the correct answer', () => {
    expect(evaluateSelectedOption(question, 'A')).toBe(false);
  });
});
