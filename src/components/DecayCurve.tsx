import { HOUR, curvePoints, type LoggedDrink } from "@/lib/caffeine";
import { clock } from "@/lib/time";

const W = 340;
const H = 150;
const PAD = { top: 12, right: 12, bottom: 26, left: 12 };

/**
 * Hand-drawn SVG: caffeine in the body from a few hours ago to just past sleep,
 * with a "now" dot, a sleep marker, and the threshold line.
 */
export function DecayCurve({
  drinks,
  now,
  sleep,
  halfLifeH,
  thresholdMg,
  over,
}: {
  drinks: LoggedDrink[];
  now: number;
  sleep: number;
  halfLifeH: number;
  thresholdMg: number;
  over: boolean;
}) {
  const start = now - 3 * HOUR;
  const end = Math.min(Math.max(sleep, now + 3 * HOUR) + HOUR, now + 26 * HOUR);
  const points = curvePoints(drinks, start, end, halfLifeH);
  const peak = Math.max(...points.map((p) => p.mg));
  const top = Math.max(peak * 1.15, thresholdMg * 2, 100);

  const x = (t: number) => PAD.left + ((t - start) / (end - start)) * (W - PAD.left - PAD.right);
  const y = (mg: number) => PAD.top + (1 - mg / top) * (H - PAD.top - PAD.bottom);
  const base = y(0);

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.mg).toFixed(1)}`).join("");
  const area = `${line}L${x(end).toFixed(1)},${base}L${x(start).toFixed(1)},${base}Z`;
  const nowMg = points.reduce((a, b) => (Math.abs(b.t - now) < Math.abs(a.t - now) ? b : a)).mg;
  const sleepColor = over ? "var(--color-coral)" : "var(--color-amber)";
  // With sleep close by, "now" would print over "sleep 9:00"; the dot alone marks now then.
  const showNowLabel = Math.abs(x(sleep) - x(now)) > 46;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      <path d={area} fill="var(--color-amber)" opacity="0.12" />

      <line x1={PAD.left} x2={W - PAD.right} y1={y(thresholdMg)} y2={y(thresholdMg)} stroke="var(--color-muted)" strokeDasharray="4 4" strokeWidth="1" />
      <text x={PAD.left} y={y(thresholdMg) - 5} textAnchor="start" fontSize="11" fill="var(--color-muted)" className="tabular-nums">
        {thresholdMg} mg
      </text>

      <path d={line} fill="none" stroke="var(--color-amber)" strokeWidth="2.5" strokeLinejoin="round" />

      <line x1={x(sleep)} x2={x(sleep)} y1={PAD.top} y2={base} stroke={sleepColor} strokeWidth="1.5" />
      <text x={x(sleep)} y={H - 8} textAnchor="middle" fontSize="11" fill={sleepColor} className="tabular-nums">
        sleep {clock(sleep)}
      </text>

      <line x1={PAD.left} x2={W - PAD.right} y1={base} y2={base} stroke="var(--color-line)" />
      <circle cx={x(now)} cy={y(nowMg)} r="5" fill="var(--color-amber)" stroke="var(--color-bg)" strokeWidth="2" />
      {showNowLabel && (
        <text x={x(now)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--color-muted)">
          now
        </text>
      )}
    </svg>
  );
}
