// WCAG 2.1 contrast for every text/background pair the app uses.
// Run: node scripts/contrast.mjs   (no packages; exits 1 if any pair fails)
// Colours are the tokens in src/app/globals.css.

const T = {
  bg: "#14110f",
  surface: "#1f1a16",
  raised: "#2a231d",
  line: "#3a3029",
  edge: "#7a6b5d",
  text: "#e8dccb",
  muted: "#a8998a",
  amber: "#f2a541",
  coral: "#e0705a",
};

// [foreground, background, minimum, where it's used]
// 4.5 = body text (AA), 3 = large text (24px+, or 19px bold) and UI edges (1.4.11).
const PAIRS = [
  ["text", "bg", 4.5, "body text, headings, drink names in the list"],
  ["text", "surface", 4.5, "drink chip names, typed input text"],
  ["text", "raised", 4.5, "secondary buttons (Other…, Clear my data)"],
  ["muted", "bg", 4.5, "hints, captions, inactive nav tabs"],
  ["muted", "surface", 4.5, "chip mg, input placeholder and unit, welcome-back text"],
  ["muted", "raised", 4.5, "chip text on hover"],
  ["amber", "bg", 4.5, "hero number, wordmark, Undo/Remove, active nav tab"],
  ["amber", "surface", 4.5, "half-life value"],
  ["coral", "bg", 4.5, "field errors, over-the-line hero and text"],
  ["coral", "surface", 4.5, "'+78 at sleep' on a chip that would cross the line"],
  ["coral", "raised", 4.5, "chip hover while coral"],
  ["bg", "amber", 4.5, "primary button label"],
  ["edge", "surface", 3, "input borders (non-text UI)"],
  ["edge", "bg", 3, "secondary button border (non-text UI)"],
];

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = 0;
console.log("| Text | On | Ratio | Needs | Used for |\n|---|---|---|---|---|");
for (const [fg, bg, min, use] of PAIRS) {
  const r = ratio(T[fg], T[bg]);
  if (r < min) failed++;
  console.log(
    `| ${fg} \`${T[fg]}\` | ${bg} \`${T[bg]}\` | ${r.toFixed(1)} ${r >= min ? "✓" : "✗ FAIL"} | ${min} | ${use} |`,
  );
}
console.log(failed ? `\n${failed} pair(s) fail.` : `\nAll ${PAIRS.length} pairs pass.`);
process.exit(failed ? 1 : 0);
