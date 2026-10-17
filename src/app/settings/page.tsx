"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Notice } from "@/components/Notice";
import { Loading, Screen } from "@/components/Screen";
import { Slider } from "@/components/Slider";
import {
  DEFAULT_HALF_LIFE_H,
  DEFAULT_THRESHOLD_MG,
  MAX_HALF_LIFE_H,
  MIN_HALF_LIFE_H,
} from "@/lib/caffeine";
import { clearState, useLastCup, type LastCupState } from "@/lib/storage";

export default function SettingsPage() {
  const { state, update } = useLastCup();
  return (
    <Screen title="Settings">
      {state ? <SettingsForm state={state} update={update} /> : <Loading />}
    </Screen>
  );
}

function SettingsForm({
  state,
  update,
}: {
  state: LastCupState;
  update: ReturnType<typeof useLastCup>["update"];
}) {
  const [threshold, setThreshold] = useState(String(state.thresholdMg));
  const [thresholdError, setThresholdError] = useState<string>();
  const [confirmClear, setConfirmClear] = useState(false);

  function onThreshold(raw: string) {
    setThreshold(raw);
    const mg = Number(raw);
    // 0 would mean "never clear", so the clear-by time could never be shown.
    if (!raw.trim() || !Number.isFinite(mg) || mg < 1 || mg > 400) {
      setThresholdError("Enter a number of mg between 1 and 400. 50 is a common starting point.");
      return;
    }
    setThresholdError(undefined);
    update((s) => ({ ...s, thresholdMg: Math.round(mg) }));
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="-mt-2 text-muted">Changes save as you make them.</p>
      <Slider
        label="Caffeine half-life"
        value={state.halfLifeH}
        min={MIN_HALF_LIFE_H}
        max={MAX_HALF_LIFE_H}
        step={0.5}
        display={`${state.halfLifeH} h`}
        onChange={(h) => update((s) => ({ ...s, halfLifeH: h }))}
        hint={`How long your body takes to clear half of it. ${DEFAULT_HALF_LIFE_H} h is average; most people are between 3 and 7. Pregnancy, smoking and some medications change it.`}
      />

      <Field
        label="My sleep line"
        name="threshold"
        inputMode="numeric"
        suffix="mg"
        value={threshold}
        onChange={(e) => onThreshold(e.target.value)}
        error={thresholdError}
        hint={`Under this at bedtime, you're shown amber; over it, coral. Default ${DEFAULT_THRESHOLD_MG} mg.`}
      />

      <Notice>
        Last Cup is a guide, not medical advice. It treats absorption as instant and uses the
        half-life you set here. Drink values come from labels and the USDA; a few are
        estimates.
      </Notice>

      <section aria-labelledby="data" className="flex flex-col gap-3">
        <h2 id="data" className="font-display text-lg font-semibold">
          Your data
        </h2>
        <p className="text-muted">
          Everything stays in this browser. There&rsquo;s no account and nothing is sent anywhere.
        </p>
        {confirmClear ? (
          <div className="flex flex-col gap-3">
            <p className="text-coral">This deletes every drink, sleep time and setting.</p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="border-coral text-coral"
                onClick={() => {
                  clearState();
                  setConfirmClear(false);
                  setThreshold(String(DEFAULT_THRESHOLD_MG));
                }}
              >
                Yes, clear it all
              </Button>
              <Button variant="ghost" onClick={() => setConfirmClear(false)}>
                Keep my data
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirmClear(true)}>
            Clear my data
          </Button>
        )}
      </section>
    </div>
  );
}
