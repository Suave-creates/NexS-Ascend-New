const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const failures = new Map<string, number[]>();

function recent(key: string): number[] {
  const now = Date.now();
  const list = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  failures.set(key, list);
  return list;
}

export function isRateLimited(key: string): boolean {
  return recent(key).length >= MAX_ATTEMPTS;
}

export function recordFailure(key: string): void {
  recent(key).push(Date.now());
}

export function resetAttempts(key: string): void {
  failures.delete(key);
}
