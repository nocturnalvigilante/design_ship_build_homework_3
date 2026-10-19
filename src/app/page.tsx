"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { DecayCurve } from "@/components/DecayCurve";
import { DrinkChip } from "@/components/DrinkChip";
import { HeroNumber } from "@/components/HeroNumber";
import { Notice } from "@/components/Notice";
import { Loading, Screen } from "@/components/Screen";
import {
  DAILY_REFERENCE_MG,
  HOUR,
  clearBy,
  doseRemaining,
  drunkInLast24h,
  remainingAt,
  type LoggedDrink,
} from "@/lib/caffeine";
import { drinkOptions } from "@/lib/options";
import { clearLogged, newId, peekLogged, useLastCup } from "@/lib/storage";
import { clock, dayLabel, fromNow, useNow } from "@/lib/time";

export default function NowPage() {
  const router = useRouter();
  const { state, update } = useLastCup();
  const tick = useNow();
  // The clock ticks every 30 s, but a drink logged a moment ago must count as drunk.
  const now = Math.max(tick, ...(state?.drinks.map((d) => d.at) ?? []));
  // The "Logged …, Undo" / "Removed …, Undo" line, for chips, the /log form and Remove alike.
  const [toast, setToast] = useState<{ text: string; undo: () => void } | null>(null);
  // Undo is for a mis-tap, so it goes after 20 s rather than offering to undo hours later.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 20_000);
    return () => clearTimeout(id);
  }, [toast]);

  // After Undo the button goes away, so put keyboard focus back where the chips start.
  const chipsHeading = useRef<HTMLHeadingElement>(null);
  function refocus() {
    requestAnimationFrame(() => chipsHeading.current?.focus());
  }

  function drop(id: string) {
    update((s) => ({ ...s, drinks: s.drinks.filter((d) => d.id !== id) }));
    setToast(null);
  }

  useEffect(() => {
    const fromForm = peekLogged();
    if (!fromForm) return;
    clearLogged();
    setToast({ text: `Logged ${fromForm.name}, ${fromForm.mg} mg.`, undo: () => drop(fromForm.id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No upcoming sleep yet (first visit, or the last one passed): ask first.
  const needsSleep = state !== null && (state.nextSleep === null || state.nextSleep <= now);
  useEffect(() => {
    if (needsSleep) router.replace("/sleep");
  }, [needsSleep, router]);

  if (!state || needsSleep || state.nextSleep === null) {
    return (
      <Screen title="Now" hideTitle>
        <Loading />
      </Screen>
    );
  }

  const sleep = state.nextSleep;
  const { drinks, halfLifeH, thresholdMg } = state;
  const atSleep = Math.round(remainingAt(drinks, sleep, halfLifeH));
  const over = atSleep > thresholdMg;
  // The screen shows whole mg, so "under the line" means it rounds to the line or below;
  // the clear-by time uses the same rule, or 50.3 mg would read "under 50 by 9:02" at a 9:00 sleep.
  const clear = clearBy(drinks, now, halfLifeH, thresholdMg + 0.5);
  const today = drunkInLast24h(drinks, now);
  const options = drinkOptions(state).slice(0, 5);
  const inYouNow = Math.round(remainingAt(drinks, now, halfLifeH));
  // Drinks older than 24 h can still leave a little, so "in you now" may exceed "drunk".
  const fromEarlier = Math.round(
    remainingAt(drinks.filter((d) => d.at <= now - 24 * HOUR), now, halfLifeH),
  );
  const recent = drinks
    .filter((d) => d.at > now - 24 * HOUR)
    .sort((a, b) => b.at - a.at);

  function log(name: string, mg: number) {
    const id = newId();
    update((s) => ({ ...s, drinks: [...s.drinks, { id, name, mg, at: Date.now() }] }));
    setToast({ text: `Logged ${name}, ${mg} mg.`, undo: () => drop(id) });
  }

  function remove(drink: LoggedDrink) {
    drop(drink.id);
    setToast({
      text: `Removed ${drink.name}.`,
      undo: () => {
        update((s) => ({ ...s, drinks: [...s.drinks, drink] }));
        setToast(null);
      },
    });
  }

  return (
    <Screen title="Now" hideTitle wide>
      <div className="lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
        <div className="lg:sticky lg:top-8">
          <HeroNumber mg={atSleep} sleep={sleep} now={now} over={over} />

          <p className={`mt-2 text-base tabular-nums ${over ? "text-coral" : "text-muted"}`}>
            {recent.length === 0 && atSleep === 0
              ? "Nothing logged yet. Tap what you’re drinking to see what it leaves at sleep."
              : clear <= now
              ? `You're under your ${thresholdMg} mg line now.`
              : over
                ? `Over your ${thresholdMg} mg line at sleep. Under it by ${clock(clear)}, ${fromNow(clear, sleep).replace("in ", "")} after your sleep time.`
                : `Under ${thresholdMg} mg by ${clock(clear)}, before you sleep.`}
          </p>

          <div className="mt-6">
            <DecayCurve
              drinks={drinks}
              now={now}
              sleep={sleep}
              halfLifeH={halfLifeH}
              thresholdMg={thresholdMg}
              over={over}
            />
            <p className="mt-1 text-sm text-muted tabular-nums">
              An estimate, not medical advice: {halfLifeH} h half-life, counted from when you start
              drinking.{" "}
              <Link href="/settings" className="text-text underline decoration-edge underline-offset-4 hover:decoration-amber">
                Adjust
              </Link>
            </p>
          </div>
        </div>

        <div>
          <section aria-label="Log a drink" className="mt-4 lg:mt-2">
            <div className="mb-3 flex min-h-12 items-center justify-between gap-3" aria-live="polite">
              {toast ? (
                <>
                  <p className="tabular-nums">{toast.text}</p>
                  <Button
                    variant="ghost"
                    className="px-3"
                    onClick={() => {
                      toast.undo();
                      refocus();
                    }}
                  >
                    Undo
                  </Button>
                </>
              ) : (
                <h2
                  id="add"
                  ref={chipsHeading}
                  tabIndex={-1}
                  className="font-display text-lg font-semibold"
                >
                  Just had something?
                </h2>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {options.map((o) => {
                const adds = Math.round(doseRemaining(o.mg, now, sleep, halfLifeH));
                return (
                  <DrinkChip
                    key={o.key}
                    name={o.name}
                    mg={o.mg}
                    addsAtSleep={adds}
                    wouldCross={atSleep + adds > thresholdMg}
                    onLog={() => log(o.name, o.mg)}
                  />
                );
              })}
              <Button
                href="/log"
                variant="secondary"
                className="min-h-16 rounded-xl px-3 text-base"
              >
                Other…
              </Button>
            </div>
            {!over && (
            <p className="mt-3 text-sm tabular-nums">
              Room for <span className="font-semibold text-amber">{thresholdMg - atSleep} mg</span>{" "}
              more at sleep before your {thresholdMg} mg line.
            </p>
          )}
          {over ? (
              <p className="mt-2 text-sm text-muted">
                You&rsquo;re already over your {thresholdMg} mg line at sleep, so each one adds to it.
              </p>
            ) : (
              options.some((o) => atSleep + Math.round(doseRemaining(o.mg, now, sleep, halfLifeH)) > thresholdMg) && (
                <p className="mt-2 text-sm text-muted">
                  <span className="text-coral">Coral</span> ones would put you over your {thresholdMg} mg
                  line at sleep.
                </p>
              )
            )}
          </section>

          {today > DAILY_REFERENCE_MG && (
            <div className="mt-4">
              <Notice>
                <span className="tabular-nums">
                  {today} mg in the last 24 h, past the FDA&rsquo;s {DAILY_REFERENCE_MG} mg daily
                  reference for most adults.
                </span>
              </Notice>
            </div>
          )}

          {recent.length > 0 && (
            <section aria-labelledby="recent" className="mt-8">
              <h2 id="recent" className="mb-2 text-sm font-medium text-muted tabular-nums">
                Last 24 hours: {today} mg drunk. In you now: {inYouNow} mg
                {fromEarlier > 0 && ` (${fromEarlier} from before that)`}
              </h2>
              <ul className="divide-y divide-line rounded-xl border border-line">
                {recent.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-1 pr-1 pl-4">
                    <span className="tabular-nums">
                      <span className="text-muted">
                        {dayLabel(d.at, now) === "today" ? "" : `${dayLabel(d.at, now)} `}
                        {clock(d.at)}
                      </span>{" "}
                      {d.name}{" "}
                      <span className="text-muted">
                        {d.mg} mg, {Math.round(doseRemaining(d.mg, d.at, now, halfLifeH))} left
                      </span>
                    </span>
                    <Button
                      variant="ghost"
                      className="px-3 text-sm"
                      onClick={() => remove(d)}
                      aria-label={`Remove ${d.name} at ${clock(d.at)}`}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </Screen>
  );
}
