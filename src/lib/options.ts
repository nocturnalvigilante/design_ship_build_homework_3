import { BUILT_IN_DRINKS } from "./drinks";
import type { LastCupState } from "./storage";

export type DrinkOption = { key: string; name: string; mg: number; estimate?: boolean };

/** Built-in and custom drinks, the ones this person logs most first. */
export function drinkOptions(state: LastCupState): DrinkOption[] {
  const uses = new Map<string, number>();
  for (const d of state.drinks) uses.set(d.name, (uses.get(d.name) ?? 0) + 1);

  const all: DrinkOption[] = [...state.customDrinks, ...BUILT_IN_DRINKS];
  // Array.sort is stable, so ties keep the built-in order.
  return all.sort((a, b) => (uses.get(b.name) ?? 0) - (uses.get(a.name) ?? 0));
}
