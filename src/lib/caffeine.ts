// One-compartment exponential decay: remaining = dose × 0.5^(hours / halfLife).
// Absorption is treated as instant (the UI says so). Times are epoch milliseconds.

export type LoggedDrink = {
  id: string;
  name: string;
  mg: number;
  at: number;
};

export const HOUR = 60 * 60 * 1000;

export const DEFAULT_HALF_LIFE_H = 5;
export const MIN_HALF_LIFE_H = 2;
export const MAX_HALF_LIFE_H = 10;
export const DEFAULT_THRESHOLD_MG = 50;
// FDA reference for most adults.
export const DAILY_REFERENCE_MG = 400;

/** What one dose taken at `at` leaves in the body at time `t`. */
export function doseRemaining(
  mg: number,
  at: number,
  t: number,
  halfLifeH: number,
): number {
  if (t < at) return 0;
  return mg * Math.pow(0.5, (t - at) / HOUR / halfLifeH);
}

/** Total caffeine in the body at time `t`, from every drink taken by then. */
export function remainingAt(
  drinks: LoggedDrink[],
  t: number,
  halfLifeH: number,
): number {
  return drinks.reduce((sum, d) => sum + doseRemaining(d.mg, d.at, t, halfLifeH), 0);
}

/**
 * Earliest time at or after `from` when the total drops to `thresholdMg`,
 * assuming nothing more is drunk. Every drink is at or before `from`, so the
 * total decays as one exponential and the answer is exact.
 */
export function clearBy(
  drinks: LoggedDrink[],
  from: number,
  halfLifeH: number,
  thresholdMg: number,
): number {
  const now = remainingAt(drinks, from, halfLifeH);
  if (now <= thresholdMg) return from;
  return from + halfLifeH * Math.log2(now / thresholdMg) * HOUR;
}

/** Caffeine drunk in the 24 hours before `t`, compared to the daily reference. */
export function drunkInLast24h(drinks: LoggedDrink[], t: number): number {
  return drinks
    .filter((d) => d.at <= t && d.at > t - 24 * HOUR)
    .reduce((sum, d) => sum + d.mg, 0);
}

/** Evenly spaced samples of the total, for drawing the curve. */
export function curvePoints(
  drinks: LoggedDrink[],
  start: number,
  end: number,
  halfLifeH: number,
  samples = 96,
): { t: number; mg: number }[] {
  const times: number[] = [];
  for (let i = 0; i <= samples; i++) times.push(start + ((end - start) * i) / samples);
  // Sample just before and at each dose so the jump is drawn as a step, not a slope.
  for (const d of drinks) {
    if (d.at > start && d.at <= end) times.push(d.at - 1, d.at);
  }
  return times
    .sort((a, b) => a - b)
    .map((t) => ({ t, mg: remainingAt(drinks, t, halfLifeH) }));
}
