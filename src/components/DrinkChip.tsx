/**
 * One-tap drink. It shows what the drink would leave at your sleep *before*
 * you tap, and turns coral if it would put you over your line.
 */
export function DrinkChip({
  name,
  mg,
  addsAtSleep,
  wouldCross,
  onLog,
}: {
  name: string;
  mg: number;
  addsAtSleep: number;
  wouldCross: boolean;
  onLog: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onLog}
      aria-label={`Log ${name}, ${mg} mg. Adds ${addsAtSleep} mg at your sleep${
        wouldCross ? ", which puts you over your line" : ""
      }.`}
      className={`flex min-h-16 flex-col items-start justify-center rounded-xl border bg-surface px-3 py-2 text-left hover:bg-raised ${
        wouldCross ? "border-coral/70" : "border-line"
      }`}
    >
      <span className="text-base leading-tight font-semibold text-text">{name}</span>
      <span className={`text-sm tabular-nums ${wouldCross ? "text-coral" : "text-muted"}`}>
        +{addsAtSleep} at sleep
      </span>
    </button>
  );
}
