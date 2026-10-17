"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "@/lib/caffeine";
import { drinkOptions } from "@/lib/options";
import { newId, useLastCup } from "@/lib/storage";
import { clock, fromNow, useNow } from "@/lib/time";

export default function NowPage() {
  const router = useRouter();
  const { state, update } = useLastCup();
  const tick = useNow();
  // The clock ticks every 30 s, but a drink logged a moment ago must count as drunk.
  const now = Math.max(tick, ...(state?.drinks.map((d) => d.at) ?? []));
  const [justLogged, setJustLogged] = useState<{ id: string; name: string } | null>(null);

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
  const clear = clearBy(drinks, now, halfLifeH, thresholdMg);
  const today = drunkInLast24h(drinks, now);
  const options = drinkOptions(state).slice(0, 5);
  const recent = drinks
    .filter((d) => d.at > now - 24 * HOUR)
    .sort((a, b) => b.at - a.at);

  function log(name: string, mg: number) {
    const id = newId();
    update((s) => ({ ...s, drinks: [...s.drinks, { id, name, mg, at: Date.now() }] }));
    setJustLogged({ id, name });
  }

  function remove(id: string) {
    update((s) => ({ ...s, drinks: s.drinks.filter((d) => d.id !== id) }));
    setJustLogged(null);
  }

  return (
    <Screen title="Now" hideTitle>
      <HeroNumber mg={atSleep} sleep={sleep} now={now} over={over} />

      <p className={`mt-2 text-base tabular-nums ${over ? "text-coral" : "text-muted"}`}>
        {clear <= now
          ? `You're under your ${thresholdMg} mg line now.`
          : over
            ? `Over your ${thresholdMg} mg line at sleep. Clear by ${clock(clear)}, ${fromNow(clear, sleep).replace("in ", "")} after your sleep time.`
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
      </div>

      <section aria-label="Log a drink" className="mt-4">
        <div className="mb-3 flex min-h-12 items-center justify-between gap-3" aria-live="polite">
          {justLogged ? (
            <>
              <p>Logged {justLogged.name}.</p>
              <Button variant="ghost" className="px-3" onClick={() => remove(justLogged.id)}>
                Undo
              </Button>
            </>
          ) : (
            <h2 id="add" className="font-display text-lg font-semibold">
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
          <h2 id="recent" className="mb-2 text-sm font-medium text-muted">
            Last 24 hours
          </h2>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {recent.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-1 pr-1 pl-4">
                <span className="tabular-nums">
                  <span className="text-muted">{clock(d.at)}</span> {d.name}{" "}
                  <span className="text-muted">
                    {d.mg} mg, {Math.round(doseRemaining(d.mg, d.at, now, halfLifeH))} left
                  </span>
                </span>
                <Button
                  variant="ghost"
                  className="px-3 text-sm"
                  onClick={() => remove(d.id)}
                  aria-label={`Remove ${d.name} at ${clock(d.at)}`}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

    </Screen>
  );
}
