import { afterEach, beforeEach } from 'vitest';

function createStorageShim() {
  const store = new Map();

  return {
    clear: () => store.clear(),
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => store.delete(key),
    setItem: (key, value) => store.set(key, String(value)),
    get length() {
      return store.size;
    },
  };
}

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: createStorageShim(),
  });
});

afterEach(() => {
  window.localStorage.clear();
});
