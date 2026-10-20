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
const MAX_PAST_SLEEPS = 14;

export type CustomDrink = { key: string; name: string; mg: number };

export type LastCupState = {
  drinks: LoggedDrink[];
  /** The sleep the person is planning around next, or null before the first answer. */
  nextSleep: number | null;
  /** Sleeps that have passed, newest first, so coming back can show a pattern across shifts. */
  pastSleeps: number[];
  halfLifeH: number;
  thresholdMg: number;
  customDrinks: CustomDrink[];
};

export const EMPTY_STATE: LastCupState = {
  drinks: [],
  nextSleep: null,
  pastSleeps: [],
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
      pastSleeps: Array.isArray(data.pastSleeps)
        ? data.pastSleeps.filter((t): t is number => typeof t === "number")
        : [],
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
  const pruned = {
    ...next,
    drinks: next.drinks.filter((d) => d.at > cutoff),
    pastSleeps: next.pastSleeps.filter((t) => t > cutoff).slice(0, MAX_PAST_SLEEPS),
  };
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

/**
 * Plan the next sleep. If the one before it has already passed, it moves into
 * the history, which is what the welcome-back card draws.
 */
export function withNextSleep(s: LastCupState, at: number, now: number): LastCupState {
  const passed = s.nextSleep !== null && s.nextSleep <= now;
  return {
    ...s,
    nextSleep: at,
    pastSleeps: passed && !s.pastSleeps.includes(s.nextSleep!) ? [s.nextSleep!, ...s.pastSleeps] : s.pastSleeps,
  };
}

export function clearState() {
  memoryRaw = null;
  clearDraft();
  saveThresholdDraft(null);
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

/**
 * What's typed on /log but not logged yet, so checking Now mid-form (or a
 * phone that reloads the tab) doesn't lose it. Cleared once the drink is logged.
 */
export type LogDraft = { name: string; mg: string; at: string; atTouched: boolean; remember: boolean };

const DRAFT_KEY = "lastcup:draft";

export function loadDraft(): LogDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    const d = raw ? (JSON.parse(raw) as Partial<LogDraft>) : null;
    if (!d || typeof d.name !== "string" || typeof d.mg !== "string") return null;
    return {
      name: d.name,
      mg: d.mg,
      at: typeof d.at === "string" ? d.at : "",
      atTouched: d.atTouched === true,
      remember: d.remember !== false,
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: LogDraft) {
  try {
    if (!draft.name && !draft.mg && !draft.atTouched) window.localStorage.removeItem(DRAFT_KEY);
    else window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

/** A sleep line typed in Settings that isn't valid yet, kept (with its error) until it's fixed. */
const THRESHOLD_DRAFT_KEY = "lastcup:threshold-draft";

export function loadThresholdDraft(): string | null {
  try {
    return window.localStorage.getItem(THRESHOLD_DRAFT_KEY);
  } catch {
    return null;
  }
}

export function saveThresholdDraft(raw: string | null) {
  try {
    if (raw === null) window.localStorage.removeItem(THRESHOLD_DRAFT_KEY);
    else window.localStorage.setItem(THRESHOLD_DRAFT_KEY, raw);
  } catch {}
}

/**
 * A drink just logged on another route (the /log form), so Now can confirm it
 * with the same "Logged …, Undo" line a chip gets. In memory only, on purpose.
 */
let justLoggedElsewhere: LoggedDrink | null = null;

export function announceLogged(drink: LoggedDrink) {
  justLoggedElsewhere = drink;
}

export function peekLogged() {
  return justLoggedElsewhere;
}

export function clearLogged() {
  justLoggedElsewhere = null;
}
