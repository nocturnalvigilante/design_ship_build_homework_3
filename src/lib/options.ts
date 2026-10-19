import { BUILT_IN_DRINKS } from "./drinks";
import type { LastCupState } from "./storage";

export type DrinkOption = { key: string; name: string; mg: number; estimate?: boolean };

/** Built-in and custom drinks, the ones this person logs most first. */
export function drinkOptions(state: LastCupState): DrinkOption[] {
  const uses = new Map<string, number>();
  // By name, ignoring case, so a "red bull" typed on /log still counts for the Red Bull chip.
  for (const d of state.drinks) {
    const k = d.name.toLowerCase();
    uses.set(k, (uses.get(k) ?? 0) + 1);
  }

  const all: DrinkOption[] = [...state.customDrinks, ...BUILT_IN_DRINKS];
  // Array.sort is stable, so ties keep the built-in order.
  const count = (o: DrinkOption) => uses.get(o.name.toLowerCase()) ?? 0;
  return all.sort((a, b) => count(b) - count(a));
}
