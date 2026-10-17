"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DecayCurve } from "@/components/DecayCurve";
import { HeroNumber } from "@/components/HeroNumber";
import { Notice } from "@/components/Notice";
import { Loading, Screen } from "@/components/Screen";
import { DAILY_REFERENCE_MG, clearBy, drunkInLast24h, remainingAt } from "@/lib/caffeine";
import { useLastCup } from "@/lib/storage";
import { clock, fromNow, useNow } from "@/lib/time";

export default function NowPage() {
  const router = useRouter();
  const { state } = useLastCup();
  const now = useNow();

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
    </Screen>
  );
}
