"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ActionBar } from "@/components/ActionBar";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Loading, Screen } from "@/components/Screen";
import { HOUR, remainingAt } from "@/lib/caffeine";
import { useLastCup, withNextSleep, type LastCupState } from "@/lib/storage";
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
    update((s) => withNextSleep(s, at, Date.now()));
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
      {/* The question comes first, then why it's asked (first visit) or last shift (returning). */}
      <h1 className="mb-4 font-display text-3xl font-semibold leading-tight">
        When are you sleeping next?
      </h1>

      {firstVisit && (
        <p className="mb-8 text-lg leading-relaxed text-muted">
          See how much caffeine will still be in you when you sleep, whatever time that is. No
          account, nothing leaves this phone.
        </p>
      )}

      {returning && lastSleep !== null && <WelcomeBack state={state} lastSleep={lastSleep} />}

      <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
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
                Same as last time: {clock(sameTime)} {dayLabel(sameTime, now)}
              </span>
            </Button>
          )}
          <Button full type="submit" variant={returning ? "secondary" : "primary"}>
            {firstVisit ? "Next: what are you drinking?" : returning ? "Use the time above" : "Save sleep time"}
          </Button>
        </ActionBar>
      </form>
    </div>
  );
}

/** The reason to come back: it remembers last shift and makes the next one one tap. */
function WelcomeBack({ state, lastSleep }: { state: LastCupState; lastSleep: number }) {
  const now = useNow();
  const shift = state.drinks.filter((d) => d.at <= lastSleep && d.at > lastSleep - 24 * HOUR);
  const atSleep = Math.round(remainingAt(shift, lastSleep, state.halfLifeH));
  const day = dayLabel(lastSleep, now);
  const when = day === "today" ? clock(lastSleep) : `${clock(lastSleep)} ${day}`;
  // Newest first: the sleep that just passed, then the history.
  const sleeps = [lastSleep, ...state.pastSleeps.filter((t) => t !== lastSleep)].slice(0, 7);
  return (
    <section
      aria-label="Last shift"
      className="mb-8 rounded-2xl border border-line bg-surface px-5 py-4"
    >
      <p className="font-display text-xl font-semibold">Welcome back.</p>
      <p className="mt-1 text-muted tabular-nums">
        {shift.length === 0
          ? `Your last sleep was ${when}. No drinks logged before it.`
          : `Last shift: ${shift.length} ${shift.length === 1 ? "drink" : "drinks"}, ${atSleep} mg at your ${when} sleep.`}
      </p>
      {sleeps.length > 1 && <PastSleeps state={state} sleeps={sleeps} />}
    </section>
  );
}

/** Your last few sleeps as small bars, so the pattern shows, not just last night. */
function PastSleeps({ state, sleeps }: { state: LastCupState; sleeps: number[] }) {
  const rows = sleeps
    .map((t) => ({
      t,
      mg: Math.round(
        remainingAt(
          state.drinks.filter((d) => d.at <= t),
          t,
          state.halfLifeH,
        ),
      ),
    }))
    .reverse(); // oldest on the left, like a calendar
  const over = rows.filter((r) => r.mg > state.thresholdMg).length;
  const top = Math.max(state.thresholdMg * 2, ...rows.map((r) => r.mg));
  return (
    <figure className="mt-4">
      <figcaption className="text-sm text-muted tabular-nums">
        {over === 0
          ? `Under your ${state.thresholdMg} mg line at all of your last ${rows.length} sleeps.`
          : `Over your ${state.thresholdMg} mg line at ${over} of your last ${rows.length} sleeps.`}
      </figcaption>
      <ul className="mt-3 flex h-20 items-end gap-2" aria-label="mg in you at each sleep, oldest first">
        {rows.map((r) => {
          const isOver = r.mg > state.thresholdMg;
          return (
            <li key={r.t} className="flex flex-1 flex-col items-center gap-1">
              <span className={`text-xs tabular-nums ${isOver ? "text-coral" : "text-muted"}`}>
                {r.mg}
                <span className="sr-only"> mg at the {clock(r.t)} sleep</span>
              </span>
              <span
                aria-hidden="true"
                className={`w-full rounded-t ${isOver ? "bg-coral" : "bg-amber"}`}
                style={{ height: `${Math.max(3, (r.mg / top) * 48)}px` }}
              />
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
