import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const REQUIRED_COLUMNS = [
  'Question',
  'Option A',
  'Option B',
  'Option C',
  'Option D',
  'Correct Answer',
  'Topic',
  'Difficulty',
];

export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const OPTION_KEYS = ['A', 'B', 'C', 'D'];
const COLUMN_ALIASES = new Map(REQUIRED_COLUMNS.map((column) => [normalizeColumn(column), column]));

function normalizeColumn(columnName) {
  return String(columnName || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normalizeRow(row) {
  return Object.entries(row).reduce((normalized, [rawKey, value]) => {
    const canonicalKey = COLUMN_ALIASES.get(normalizeColumn(rawKey));
    if (canonicalKey) {
      normalized[canonicalKey] = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
    }
    return normalized;
  }, {});
}

function findMissingColumns(rows) {
  const availableColumns = new Set();
  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      const canonicalKey = COLUMN_ALIASES.get(normalizeColumn(key));
      if (canonicalKey) {
        availableColumns.add(canonicalKey);
      }
    });
  });

  return REQUIRED_COLUMNS.filter((column) => !availableColumns.has(column));
}

export function parseQuizRows(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];

  if (safeRows.length === 0) {
    return {
      questions: [],
      errors: [{ row: 0, column: 'File', message: 'Quiz file does not contain any question rows.' }],
    };
  }

  const missingColumns = findMissingColumns(safeRows);
  if (missingColumns.length > 0) {
    return {
      questions: [],
      errors: [
        {
          row: 0,
          column: 'Header',
          message: `Missing mandatory columns: ${missingColumns.join(', ')}`,
        },
      ],
    };
  }

  const errors = [];
  const questions = [];

  safeRows.forEach((rawRow, index) => {
    const rowNumber = index + 2;
    const row = normalizeRow(rawRow);
    const questionErrors = [];
    const correctAnswer = row['Correct Answer']?.toUpperCase();

    if (!row.Question) {
      questionErrors.push({
        row: rowNumber,
        column: 'Question',
        message: 'Question cannot be empty.',
      });
    }

    OPTION_KEYS.forEach((key) => {
      const column = `Option ${key}`;
      if (!row[column]) {
        questionErrors.push({
          row: rowNumber,
          column,
          message: `${column} cannot be empty.`,
        });
      }
    });

    if (!OPTION_KEYS.includes(correctAnswer)) {
      questionErrors.push({
        row: rowNumber,
        column: 'Correct Answer',
        message: 'Correct answer must be A, B, C, or D.',
      });
    }

    if (questionErrors.length > 0) {
      errors.push(...questionErrors);
      return;
    }

    questions.push({
      id: `question-${questions.length + 1}`,
      prompt: row.Question,
      options: OPTION_KEYS.map((key) => ({ key, text: row[`Option ${key}`] })),
      correctAnswer,
      topic: row.Topic,
      difficulty: row.Difficulty,
    });
  });

  return { questions, errors };
}

function parseCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          reject(new Error(errors[0].message));
          return;
        }
        resolve(data);
      },
      error: (error) => reject(error),
    });
  });
}

async function parseXlsx(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  return XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { defval: '' });
}

export async function parseQuizFile(file) {
  if (!file) {
    return { questions: [], errors: [{ row: 0, column: 'File', message: 'Please choose a quiz file.' }] };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      questions: [],
      errors: [{ row: 0, column: 'File', message: 'Quiz file must be 2 MB or smaller.' }],
    };
  }

  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!['csv', 'xlsx'].includes(extension)) {
    return {
      questions: [],
      errors: [{ row: 0, column: 'File', message: 'Only .csv and .xlsx quiz files are supported.' }],
    };
  }

  try {
    const rows = extension === 'csv' ? await parseCsv(file) : await parseXlsx(file);
    return parseQuizRows(rows);
  } catch (error) {
    return {
      questions: [],
      errors: [
        {
          row: 0,
          column: 'File',
          message: error.message || 'Unable to read this quiz file.',
        },
      ],
    };
  }
}
