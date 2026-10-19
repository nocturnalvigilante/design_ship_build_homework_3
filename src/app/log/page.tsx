"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ActionBar } from "@/components/ActionBar";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Loading, Screen } from "@/components/Screen";
import { HOUR } from "@/lib/caffeine";
import { drinkOptions } from "@/lib/options";
import {
  announceLogged,
  clearDraft,
  loadDraft,
  newId,
  saveDraft,
  useLastCup,
  type LastCupState,
} from "@/lib/storage";

const MAX_MG = 1000;

type Errors = Partial<Record<"name" | "mg" | "at", string>>;

/** "YYYY-MM-DDTHH:MM" in local time, for <input type="datetime-local">. */
function toLocalInput(ms: number) {
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000);
  return d.toISOString().slice(0, 16);
}

function validate(
  values: { name: string; mg: string; at: string; remember: boolean },
  now: number,
): { errors: Errors; mg?: number; at?: number } {
  const errors: Errors = {};

  // A one-off doesn't need a name; one saved as a chip does.
  if (!values.name.trim() && values.remember) {
    errors.name = "Name it to keep it as a one-tap drink, e.g. “Night coffee”. Or untick the box below.";
  }

  // Tired typing like "180mg large" still means 180.
  const leading = /^\s*(\d+(?:\.\d+)?)/.exec(values.mg);
  const mg = leading ? Number(leading[1]) : NaN;
  if (!Number.isFinite(mg) || mg <= 0) {
    errors.mg = "Enter just the number of mg, like 180. It’s on the can or the café’s menu.";
  } else if (mg > MAX_MG) {
    errors.mg = `That’s more than any single drink we know. Check the mg, or log it as two drinks.`;
  }

  const at = values.at ? new Date(values.at).getTime() : NaN;
  if (!Number.isFinite(at)) {
    errors.at = "Pick when you started drinking it. Leave it as now if you just did.";
  } else if (at > now + 60_000) {
    errors.at = "That time hasn’t happened yet. Pick when you started drinking it.";
  } else if (at < now - 24 * HOUR) {
    errors.at = "That’s over a day ago, so it won’t change your next sleep. Pick a time in the last 24 hours.";
  }

  return { errors, mg, at };
}

export default function LogPage() {
  const { state, update } = useLastCup();
  return (
    <Screen title="Log a drink">
      {state ? <LogForm state={state} update={update} /> : <Loading />}
    </Screen>
  );
}

function LogForm({
  state,
  update,
}: {
  state: LastCupState;
  update: ReturnType<typeof useLastCup>["update"];
}) {
  const router = useRouter();
  // Anything typed earlier and not logged yet comes back (this only renders on the client).
  const [draft] = useState(loadDraft);
  const [name, setName] = useState(draft?.name ?? "");
  const [mg, setMg] = useState(draft?.mg ?? "");
  // The input only holds whole minutes; if it's untouched, "now" means the moment of saving.
  const [atTouched, setAtTouched] = useState(draft?.atTouched ?? false);
  const [at, setAt] = useState(() =>
    draft?.atTouched && draft.at ? draft.at : toLocalInput(Date.now()),
  );
  const [remember, setRemember] = useState(draft?.remember ?? true);
  const [errors, setErrors] = useState<Errors>({});
  const [restored, setRestored] = useState(draft !== null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    saveDraft({ name, mg, at, atTouched, remember });
  }, [name, mg, at, atTouched, remember]);

  const options = drinkOptions(state);
  // The first five are already one-tap chips on Now; offer the rest here.
  const more = options.slice(5);

  function startOver() {
    setName("");
    setMg("");
    setAt(toLocalInput(Date.now()));
    setAtTouched(false);
    setRemember(true);
    setErrors({});
    setRestored(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const now = Date.now();
    const result = validate({ name, mg, at, remember }, now);
    setErrors(result.errors);

    const first = (["name", "mg", "at"] as const).find((k) => result.errors[k]);
    if (first) {
      // Move focus to the first field that needs fixing; what was typed stays.
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const drinkName = name.trim() || "Drink";
    const isKnown = options.some((o) => o.name.toLowerCase() === drinkName.toLowerCase());
    const drink = { id: newId(), name: drinkName, mg: result.mg!, at: atTouched ? result.at! : now };
    update((s) => ({
      ...s,
      drinks: [...s.drinks, drink],
      customDrinks:
        remember && name.trim() && !isKnown
          ? [{ key: `custom-${newId()}`, name: drinkName, mg: result.mg! }, ...s.customDrinks]
          : s.customDrinks,
    }));
    clearDraft();
    announceLogged(drink);
    router.push("/");
  }

  return (
    <div className="flex flex-1 flex-col">
      {restored && (
        <div className="-mt-2 mb-6 flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line px-4">
          <p className="text-sm text-muted">Kept what you typed last time.</p>
          <Button variant="ghost" className="px-2 text-sm" onClick={startOver}>
            Start over
          </Button>
        </div>
      )}

      <section aria-labelledby="start-from" className="mb-8">
        <h2 id="start-from" className="mb-3 text-sm font-medium text-muted">
          More drinks
        </h2>
        <ul className="flex flex-wrap gap-2">
          {more.map((o) => (
            <li key={o.key}>
              <button
                type="button"
                onClick={() => {
                  setName(o.name);
                  setMg(String(o.mg));
                  setErrors((e) => ({ ...e, name: undefined, mg: undefined }));
                }}
                className="min-h-11 rounded-full border border-line bg-surface px-4 text-sm hover:bg-raised"
              >
                {o.name} <span className="text-muted tabular-nums">{o.mg} mg</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-1 flex-col gap-6">
        <Field
          label="Drink"
          name="name"
          autoComplete="off"
          placeholder="e.g. Night coffee"
          hint="Optional for a one-off."
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Field
          label="Caffeine"
          name="mg"
          inputMode="numeric"
          suffix="mg"
          value={mg}
          onChange={(e) => setMg(e.target.value)}
          error={errors.mg}
          hint="It’s on the can or the café’s menu. A Red Bull is 80 mg."
        />
        <Field
          label="When did you start it?"
          name="at"
          type="datetime-local"
          value={at}
          max={toLocalInput(Date.now())}
          onChange={(e) => {
            setAt(e.target.value);
            setAtTouched(true);
          }}
          error={errors.at}
          hint="When you started drinking it; close enough is fine. Leave it as now if you just did."
        />

        <label className="flex min-h-11 items-center gap-3 text-base">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-5 accent-amber"
          />
          Add it to my one-tap drinks
        </label>

        <ActionBar>
          <Button full type="submit">
            Log drink
          </Button>
        </ActionBar>
      </form>
    </div>
  );
}
