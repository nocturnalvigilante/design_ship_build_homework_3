"use client";

// Everything Last Cup remembers lives in one localStorage key, on this device only.

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_HALF_LIFE_H,
  DEFAULT_THRESHOLD_MG,
  HOUR,
  type LoggedDrink,
} from "./caffeine";

const KEY = "lastcup:v1";
// Older drinks no longer affect anything, so we stop keeping them.
const KEEP_FOR = 30 * 24 * HOUR;

export type CustomDrink = { key: string; name: string; mg: number };

export type LastCupState = {
  drinks: LoggedDrink[];
  /** The sleep the person is planning around next, or null before the first answer. */
  nextSleep: number | null;
  halfLifeH: number;
  thresholdMg: number;
  customDrinks: CustomDrink[];
};

export const EMPTY_STATE: LastCupState = {
  drinks: [],
  nextSleep: null,
  halfLifeH: DEFAULT_HALF_LIFE_H,
  thresholdMg: DEFAULT_THRESHOLD_MG,
  customDrinks: [],
};

function parse(raw: string | null): LastCupState {
  if (!raw) return EMPTY_STATE;
  try {
    const data = JSON.parse(raw) as Partial<LastCupState>;
    return {
      drinks: Array.isArray(data.drinks) ? data.drinks : [],
      nextSleep: typeof data.nextSleep === "number" ? data.nextSleep : null,
      halfLifeH:
        typeof data.halfLifeH === "number" ? data.halfLifeH : DEFAULT_HALF_LIFE_H,
      thresholdMg:
        typeof data.thresholdMg === "number" ? data.thresholdMg : DEFAULT_THRESHOLD_MG,
      customDrinks: Array.isArray(data.customDrinks) ? data.customDrinks : [],
    };
  } catch {
    // Corrupt data shouldn't lock someone out at 3am; start fresh.
    return EMPTY_STATE;
  }
}

// Used only when localStorage refuses a write (full, or blocked in private mode).
let memoryRaw: string | null = null;

function readRaw(): string | null {
  if (memoryRaw !== null) return memoryRaw;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

// useSyncExternalStore needs the same object back while nothing changed.
let cachedRaw: string | null | undefined;
let cachedState: LastCupState = EMPTY_STATE;

function getSnapshot(): LastCupState {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedState = parse(raw);
  }
  return cachedState;
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed it.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function saveState(next: LastCupState) {
  const cutoff = Date.now() - KEEP_FOR;
  const pruned = { ...next, drinks: next.drinks.filter((d) => d.at > cutoff) };
  const raw = JSON.stringify(pruned);
  try {
    window.localStorage.setItem(KEY, raw);
    memoryRaw = null;
  } catch {
    // Keep working for this visit even if it can't be remembered.
    memoryRaw = raw;
  }
  listeners.forEach((l) => l());
}

export function clearState() {
  memoryRaw = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

/**
 * The saved state, or null during server render and the first client paint,
 * so pages never flash the wrong screen before localStorage is read.
 */
export function useLastCup() {
  const state = useSyncExternalStore<LastCupState | null>(
    subscribe,
    getSnapshot,
    () => null,
  );
  const update = useCallback((change: (s: LastCupState) => LastCupState) => {
    saveState(change(getSnapshot()));
  }, []);
  return { state, update };
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
