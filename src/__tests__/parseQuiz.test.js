import { describe, expect, test } from 'vitest';
import { MAX_FILE_SIZE_BYTES, parseQuizFile, parseQuizRows, REQUIRED_COLUMNS } from '../utils/parseQuiz';

const validRow = {
  Question: 'What is 2+2?',
  'Option A': '3',
  'Option B': '4',
  'Option C': '5',
  'Option D': '6',
  'Correct Answer': 'B',
  Topic: 'Math',
  Difficulty: 'Easy',
};

describe('parseQuizRows', () => {
  test('normalizes valid quiz rows into classroom question objects', () => {
    const result = parseQuizRows([validRow]);

    expect(result.errors).toEqual([]);
    expect(result.questions).toEqual([
      {
        id: 'question-1',
        prompt: 'What is 2+2?',
        options: [
          { key: 'A', text: '3' },
          { key: 'B', text: '4' },
          { key: 'C', text: '5' },
          { key: 'D', text: '6' },
        ],
        correctAnswer: 'B',
        topic: 'Math',
        difficulty: 'Easy',
      },
    ]);
  });

  test('reports missing mandatory columns before parsing rows', () => {
    const { errors, questions } = parseQuizRows([{ Question: 'Only a prompt' }]);

    expect(questions).toEqual([]);
    expect(errors.map((error) => error.message)).toContain(
      `Missing mandatory columns: ${REQUIRED_COLUMNS.slice(1).join(', ')}`,
    );
  });

  test('reports invalid correct-answer values', () => {
    const { errors, questions } = parseQuizRows([{ ...validRow, 'Correct Answer': 'E' }]);

    expect(questions).toEqual([]);
    expect(errors).toEqual([
      {
        row: 2,
        column: 'Correct Answer',
        message: 'Correct answer must be A, B, C, or D.',
      },
    ]);
  });

  test('reports empty questions clearly', () => {
    const { errors, questions } = parseQuizRows([{ ...validRow, Question: '   ' }]);

    expect(questions).toEqual([]);
    expect(errors).toEqual([
      {
        row: 2,
        column: 'Question',
        message: 'Question cannot be empty.',
      },
    ]);
  });

  test('rejects oversized quiz files before parsing content', async () => {
    const oversizedFile = new File([new Uint8Array(MAX_FILE_SIZE_BYTES + 1)], 'huge.csv', {
      type: 'text/csv',
    });

    const { errors, questions } = await parseQuizFile(oversizedFile);

    expect(questions).toEqual([]);
    expect(errors).toEqual([
      {
        row: 0,
        column: 'File',
        message: 'Quiz file must be 2 MB or smaller.',
      },
    ]);
  });
});
