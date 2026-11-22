// Used by both the wall and the phone so they always agree.
export const DECAY_MS = 5 * 60 * 1000;
export const MAX_DAMAGE = 0.2;
export const EASE_POWER = 0.5;

export function damageForSquare(squares, startedAt, n) {
  const square = squares[n];
  const restoredAt = square && square.restoredAt ? square.restoredAt : 0;
  const lastReset = Math.max(startedAt, restoredAt);
  const progress = Math.min(1, Math.max(0, (Date.now() - lastReset) / DECAY_MS));
  return MAX_DAMAGE * Math.pow(progress, EASE_POWER);
}