import { describe, expect, test } from 'vitest';
import { shuffleQuestions } from '../utils/shuffleQuestions';

describe('shuffleQuestions', () => {
  test('returns a shuffled copy without mutating the original array', () => {
    const questions = [{ id: 'one' }, { id: 'two' }, { id: 'three' }];

    const shuffled = shuffleQuestions(questions, () => 0);

    expect(shuffled.map((question) => question.id)).toEqual(['two', 'three', 'one']);
    expect(questions.map((question) => question.id)).toEqual(['one', 'two', 'three']);
    expect(shuffled).not.toBe(questions);
  });
});
