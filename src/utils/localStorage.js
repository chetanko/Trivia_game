function hasStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function loadFromStorage(key, fallbackValue) {
  if (!hasStorage()) {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? fallbackValue : JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
}

export function saveToStorage(key, value) {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromStorage(key) {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.removeItem(key);
}
