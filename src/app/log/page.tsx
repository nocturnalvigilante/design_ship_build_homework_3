"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ActionBar } from "@/components/ActionBar";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Loading, Screen } from "@/components/Screen";
import { HOUR } from "@/lib/caffeine";
import { drinkOptions } from "@/lib/options";
import { newId, useLastCup, type LastCupState } from "@/lib/storage";

const MAX_MG = 1000;

type Errors = Partial<Record<"name" | "mg" | "at", string>>;

/** "YYYY-MM-DDTHH:MM" in local time, for <input type="datetime-local">. */
function toLocalInput(ms: number) {
  const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60_000);
  return d.toISOString().slice(0, 16);
}

function validate(
  values: { name: string; mg: string; at: string },
  now: number,
): { errors: Errors; mg?: number; at?: number } {
  const errors: Errors = {};

  if (!values.name.trim()) {
    errors.name = "Name it so it shows up as a chip next time, e.g. “Night coffee”.";
  }

  const mg = Number(values.mg.replace(/mg/i, "").trim());
  if (!values.mg.trim() || !Number.isFinite(mg) || mg <= 0) {
    errors.mg = "Enter the caffeine in mg, it’s on the can.";
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
  const [name, setName] = useState("");
  const [mg, setMg] = useState("");
  const [at, setAt] = useState(() => toLocalInput(Date.now()));
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const options = drinkOptions(state);
  // The first five are already one-tap chips on Now; offer the rest here.
  const more = options.slice(5);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const now = Date.now();
    const result = validate({ name, mg, at }, now);
    setErrors(result.errors);

    const first = (["name", "mg", "at"] as const).find((k) => result.errors[k]);
    if (first) {
      // Move focus to the first field that needs fixing; what was typed stays.
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const drinkName = name.trim();
    const isKnown = options.some((o) => o.name.toLowerCase() === drinkName.toLowerCase());
    update((s) => ({
      ...s,
      drinks: [...s.drinks, { id: newId(), name: drinkName, mg: result.mg!, at: result.at! }],
      customDrinks:
        remember && !isKnown
          ? [{ key: `custom-${newId()}`, name: drinkName, mg: result.mg! }, ...s.customDrinks]
          : s.customDrinks,
    }));
    router.push("/");
  }

  return (
    <div className="flex flex-1 flex-col">
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Field
          label="Caffeine"
          name="mg"
          inputMode="numeric"
          suffix="mg"
          placeholder="80"
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
          onChange={(e) => setAt(e.target.value)}
          error={errors.at}
          hint="Leave it as now if you just did."
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
