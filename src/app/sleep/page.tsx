"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ActionBar } from "@/components/ActionBar";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Loading, Screen } from "@/components/Screen";
import { HOUR, remainingAt } from "@/lib/caffeine";
import { useLastCup, type LastCupState } from "@/lib/storage";
import {
  clock,
  dayLabel,
  fromNow,
  nextOccurrence,
  suggestedSleep,
  toTimeInput,
  useNow,
} from "@/lib/time";

export default function SleepPage() {
  const { state, update } = useLastCup();
  return (
    <Screen title="When are you sleeping next?" pageHasHeading>
      {state ? <SleepForm state={state} update={update} /> : <Loading />}
    </Screen>
  );
}

function SleepForm({
  state,
  update,
}: {
  state: LastCupState;
  update: ReturnType<typeof useLastCup>["update"];
}) {
  const router = useRouter();
  const now = useNow();
  const firstVisit = state.nextSleep === null && state.drinks.length === 0;
  const lastSleep = state.nextSleep;
  const returning = lastSleep !== null && lastSleep <= now;

  // Same clock time as last sleep, moved to its next occurrence.
  const sameTime = lastSleep !== null ? nextOccurrence(toTimeInput(lastSleep), now) : null;
  const initial = lastSleep !== null && !returning ? lastSleep : (sameTime ?? suggestedSleep(now));
  const [value, setValue] = useState(toTimeInput(initial));
  const [error, setError] = useState<string>();

  const picked = nextOccurrence(value, now);

  function save(at: number) {
    update((s) => ({ ...s, nextSleep: at }));
    router.push("/");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (picked === null) {
      setError("Pick a time, like 09:00. Any hour works, including mornings after a night shift.");
      return;
    }
    save(picked);
  }

  return (
    <div className="flex flex-1 flex-col">
      {firstVisit && (
        <p className="mb-8 text-lg leading-relaxed text-muted">
          See how much caffeine will still be in you when you sleep, whatever time that is. No
          account, nothing leaves this phone.
        </p>
      )}

      {returning && lastSleep !== null && <WelcomeBack state={state} lastSleep={lastSleep} />}

      <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
        <h1 className="mb-6 font-display text-3xl font-semibold leading-tight">
          When are you sleeping next?
        </h1>

        <Field
          label="I'm going to sleep at"
          type="time"
          name="sleep"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(undefined);
          }}
          error={error}
          hint={
            picked !== null ? (
              <span className="tabular-nums">
                That&rsquo;s {clock(picked)} {dayLabel(picked, now)}, {fromNow(picked, now)}.
              </span>
            ) : undefined
          }
        />

        <ActionBar>
          {returning && sameTime !== null && (
            <Button full onClick={() => save(sameTime)}>
              <span className="tabular-nums">
                Same time: {clock(sameTime)} {dayLabel(sameTime, now)}
              </span>
            </Button>
          )}
          <Button full type="submit" variant={returning ? "secondary" : "primary"}>
            {firstVisit ? "Next: what are you drinking?" : "Save sleep time"}
          </Button>
        </ActionBar>
      </form>
    </div>
  );
}

/** The reason to come back: it remembers last shift and makes the next one one tap. */
function WelcomeBack({ state, lastSleep }: { state: LastCupState; lastSleep: number }) {
  const shift = state.drinks.filter((d) => d.at <= lastSleep && d.at > lastSleep - 24 * HOUR);
  const atSleep = Math.round(remainingAt(shift, lastSleep, state.halfLifeH));
  return (
    <section
      aria-label="Last shift"
      className="mb-8 rounded-2xl border border-line bg-surface px-5 py-4"
    >
      <p className="font-display text-xl font-semibold">Welcome back.</p>
      <p className="mt-1 text-muted tabular-nums">
        {shift.length === 0
          ? `Last sleep was ${clock(lastSleep)}. No drinks logged before it.`
          : `Last shift: ${shift.length} ${shift.length === 1 ? "drink" : "drinks"}, ${atSleep} mg at your ${clock(lastSleep)} sleep.`}
      </p>
    </section>
  );
}
