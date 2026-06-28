import { describe, expect, test } from 'vitest';
import { loadFromStorage, removeFromStorage, saveToStorage } from '../utils/localStorage';

describe('localStorage utilities', () => {
  test('saves and loads JSON values with a fallback', () => {
    saveToStorage('classroom:test', { ready: true });

    expect(loadFromStorage('classroom:test', { ready: false })).toEqual({ ready: true });
    expect(loadFromStorage('classroom:missing', ['fallback'])).toEqual(['fallback']);
  });

  test('returns fallback values when stored JSON is invalid', () => {
    window.localStorage.setItem('classroom:broken', '{not valid json');

    expect(loadFromStorage('classroom:broken', { safe: true })).toEqual({ safe: true });
  });

  test('removes stored values', () => {
    saveToStorage('classroom:test', 'saved');
    removeFromStorage('classroom:test');

    expect(loadFromStorage('classroom:test', null)).toBeNull();
  });
});
