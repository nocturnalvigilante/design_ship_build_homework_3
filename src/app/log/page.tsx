"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ActionBar } from "@/components/ActionBar";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Field } from "@/components/Field";
import { Pill } from "@/components/Pill";
import { Loading, Screen } from "@/components/Screen";
import { HOUR } from "@/lib/caffeine";
import { drinkOptions, type DrinkOption } from "@/lib/options";
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
  options: DrinkOption[],
): { errors: Errors; mg?: number; at?: number } {
  const errors: Errors = {};

  // A one-off doesn't need a name; one saved as a chip does, and it can't clash with one.
  const clash = options.find((o) => o.name.toLowerCase() === values.name.trim().toLowerCase());
  if (values.remember && !values.name.trim()) {
    errors.name = "Name it to keep it as a one-tap drink, like “Night coffee”. Or untick the box below.";
  } else if (values.remember && clash) {
    errors.name = `You already have ${clash.name} (${clash.mg} mg) as a one-tap drink. Call this one something else, like “Big ${clash.name.toLowerCase()}”, or untick the box below.`;
  }

  // "180", "180 mg", "180mg large" and "1,000" all mean a number of mg. "2 shots" doesn't
  // say mg, so it's an error rather than a silent 2 mg.
  const typed = /^\s*(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?\s*(mg\b.*)?$/i.exec(values.mg);
  const mg = typed ? Math.round(Number(typed[0].replace(/mg\b.*$/i, "").replace(/,/g, ""))) : NaN;
  if (!values.mg.trim()) {
    errors.mg = "Enter the caffeine in mg, like 180. It’s on the can or the café’s menu.";
  } else if (!Number.isFinite(mg) || mg <= 0) {
    errors.mg = /\d/.test(values.mg)
      ? "Enter just the number of mg, like 180. For two shots of espresso, that’s 126."
      : "Enter the caffeine as a number of mg, like 180. It’s on the can or the café’s menu.";
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
  // Off by default: most drinks typed here are one-offs, and those don't need a name.
  const [remember, setRemember] = useState(draft?.remember ?? false);
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
    setRemember(false);
    setErrors({});
    setRestored(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const now = Date.now();
    const result = validate({ name, mg, at, remember }, now, options);
    setErrors(result.errors);

    const first = (["name", "mg", "at"] as const).find((k) => result.errors[k]);
    if (first) {
      // Move focus to the first field that needs fixing; what was typed stays.
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const drinkName = name.trim() || "Drink";
    const drink = { id: newId(), name: drinkName, mg: result.mg!, at: atTouched ? result.at! : now };
    update((s) => ({
      ...s,
      drinks: [...s.drinks, drink],
      customDrinks:
        remember && name.trim()
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
              <Pill
                onClick={() => {
                  setName(o.name);
                  setMg(String(o.mg));
                  // It's already a drink we know, so there's no chip to save.
                  setRemember(false);
                  setErrors((e) => ({ ...e, name: undefined, mg: undefined }));
                }}
              >
                {o.name} <span className="text-muted tabular-nums">{o.mg} mg</span>
              </Pill>
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
          hint="Optional for a one-off. Needed to keep it as a one-tap drink."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((er) => ({ ...er, name: undefined }));
          }}
          error={errors.name}
        />
        <Field
          label="Caffeine"
          name="mg"
          inputMode="numeric"
          suffix="mg"
          value={mg}
          onChange={(e) => {
            setMg(e.target.value);
            setErrors((er) => ({ ...er, mg: undefined }));
          }}
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
            setErrors((er) => ({ ...er, at: undefined }));
          }}
          error={errors.at}
          hint="When you started drinking it; close enough is fine. Leave it as now if you just did."
        />

        <Checkbox
          label="Add it to my one-tap drinks"
          hint="It shows up on Now, next to Red Bull and the rest."
          checked={remember}
          onChange={(e) => {
            setRemember(e.target.checked);
            setErrors((er) => ({ ...er, name: undefined }));
          }}
        />

        <ActionBar>
          <Button full type="submit">
            Log drink
          </Button>
        </ActionBar>
      </form>
    </div>
  );
}
