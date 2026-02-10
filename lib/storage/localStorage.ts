const isBrowser = (): boolean => typeof window !== "undefined";

export function loadState<T>(key: string): T | undefined {
  if (!isBrowser()) return undefined;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;

    return JSON.parse(raw) as T;
  } catch {
    // Corrupt or inaccessible storage – fail silently and let caller fall back.
    return undefined;
  }
}

export function saveState<T>(key: string, value: T): void {
  if (!isBrowser()) return;

  try {
    const raw = JSON.stringify(value);
    window.localStorage.setItem(key, raw);
  } catch {
    // Ignore write failures (quota, serialization, etc.)
  }
}

