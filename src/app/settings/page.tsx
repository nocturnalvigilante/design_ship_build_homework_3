"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  clearState,
  loadThresholdDraft,
  saveThresholdDraft,
  useLastCup,
  type LastCupState,
} from "@/lib/storage";

// Checked as you type, saved when you leave the field: typing "50" shouldn't save 5 on the way.
function check(raw: string) {
  const mg = Number(raw);
  // 0 would mean "never clear", so the clear-by time could never be shown.
  return !raw.trim() || !Number.isFinite(mg) || mg < 1 || mg > 400
    ? "Enter a number of mg between 1 and 400. 50 is a common starting point."
    : undefined;
}

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
  // A value that wasn't valid when you left comes back with its error, instead of vanishing.
  const [draft] = useState(loadThresholdDraft);
  const [threshold, setThreshold] = useState(draft ?? String(state.thresholdMg));
  const [thresholdError, setThresholdError] = useState(draft === null ? undefined : check(draft));
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);

  // Each step of Clear data replaces the button you pressed, so focus moves to what replaced it.
  const yesRef = useRef<HTMLButtonElement>(null);
  const clearRef = useRef<HTMLButtonElement>(null);
  const clearedRef = useRef<HTMLParagraphElement>(null);
  const [focusNext, setFocusNext] = useState<"yes" | "clear" | "cleared" | null>(null);
  useEffect(() => {
    if (focusNext === "yes") yesRef.current?.focus();
    if (focusNext === "clear") clearRef.current?.focus();
    if (focusNext === "cleared") clearedRef.current?.focus();
    setFocusNext(null);
  }, [focusNext]);

  function onThreshold(raw: string) {
    setThreshold(raw);
    if (thresholdError) setThresholdError(check(raw));
  }

  function saveThreshold() {
    const error = check(threshold);
    setThresholdError(error);
    saveThresholdDraft(error ? threshold : null);
    if (!error) update((s) => ({ ...s, thresholdMg: Math.round(Number(threshold)) }));
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="-mt-2 text-muted">
        The half-life saves as you move it; the sleep line saves when you leave the box. Both stay
        on this device.
      </p>
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
        onBlur={saveThreshold}
        onKeyDown={(e) => {
          if (e.key === "Enter") saveThreshold();
        }}
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
                ref={yesRef}
                variant="secondary"
                className="border-coral text-coral"
                onClick={() => {
                  clearState();
                  setConfirmClear(false);
                  setCleared(true);
                  setFocusNext("cleared");
                  setThreshold(String(DEFAULT_THRESHOLD_MG));
                  setThresholdError(undefined);
                }}
              >
                Yes, clear it all
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setConfirmClear(false);
                  setFocusNext("clear");
                }}
              >
                Keep my data
              </Button>
            </div>
          </div>
        ) : (
          <>
            {cleared && (
              <p role="status" tabIndex={-1} ref={clearedRef} className="text-text">
                Cleared. Last Cup will start fresh next time you open Now.
              </p>
            )}
            <Button
              ref={clearRef}
              variant="secondary"
              onClick={() => {
                setConfirmClear(true);
                setFocusNext("yes");
              }}
            >
              Clear my data
            </Button>
          </>
        )}
      </section>
    </div>
  );
}
