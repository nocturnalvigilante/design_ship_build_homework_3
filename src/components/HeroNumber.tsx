import Link from "next/link";
import { clock, dayLabel } from "@/lib/time";

/** The one number that matters: mg still in you at your next sleep. */
export function HeroNumber({
  mg,
  sleep,
  now,
  over,
}: {
  mg: number;
  sleep: number;
  now: number;
  over: boolean;
}) {
  const day = dayLabel(sleep, now);
  return (
    <div aria-live="polite" aria-atomic="true">
      {/* Proportional figures here: Space Grotesk's tabular "1" has a slab foot that reads
          as a stray stroke at this size, and a lone number has nothing to align with. */}
      <p
        className={`font-display text-7xl leading-none font-semibold ${
          over ? "text-coral" : "text-amber"
        }`}
      >
        {mg}
        <span className="ml-2 text-3xl">mg</span>
      </p>
      <p className="mt-3 text-lg">
        still in you at your{" "}
        <Link
          href="/sleep"
          className="-my-3 inline-block py-3 font-semibold tabular-nums underline decoration-edge underline-offset-4 hover:decoration-amber"
        >
          {clock(sleep)} sleep{day === "today" ? "" : ` ${day}`}
        </Link>
      </p>
    </div>
  );
}
