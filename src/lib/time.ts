"use client";

import { useEffect, useState } from "react";
import { HOUR } from "./caffeine";

/** The current time, refreshed every 30 s so the hero number stays live. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** "9:00" or "21:30", in the person's local time. */
export function clock(ms: number) {
  const d = new Date(ms);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** "HH:MM" for <input type="time">. */
export function toTimeInput(ms: number) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * The next time the clock reads `hhmm`, at or after `now`.
 * A bedtime is always ahead of you, so "9:00" at 2am means today and at 10am means tomorrow.
 */
export function nextOccurrence(hhmm: string, now: number): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  if (d.getTime() <= now) d.setDate(d.getDate() + 1);
  return d.getTime();
}

/**
 * A sensible first guess: the sooner of 9:00 (after a night shift) and 23:00 (a usual
 * night), skipping one under 45 min away. So 2am or 7:15am suggests 9:00, 3pm suggests 23:00.
 */
export function suggestedSleep(now: number): number {
  const options = ["9:00", "23:00"]
    .map((t) => nextOccurrence(t, now)!)
    .filter((t) => t - now >= 45 * 60_000);
  return Math.min(...options);
}

/** "today", "tomorrow", or a weekday, relative to `now`. */
export function dayLabel(ms: number, now: number) {
  const a = new Date(now);
  const b = new Date(ms);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  const days = Math.round((b.getTime() - a.getTime()) / (24 * HOUR));
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return new Date(ms).toLocaleDateString(undefined, { weekday: "long" });
}

/** "in 7 h", "in 45 min". */
export function fromNow(ms: number, now: number) {
  const mins = Math.round((ms - now) / 60_000);
  if (mins < 60) return `in ${Math.max(mins, 0)} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `in ${h} h` : `in ${h} h ${m} min`;
}
