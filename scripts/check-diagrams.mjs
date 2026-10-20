// Renders every ```mermaid block in README.md and flows.md with Mermaid 10.9 in
// headless Chrome and reports any that fail to parse. No packages; Mermaid is
// loaded from a CDN only while checking. Needs google-chrome on PATH.
// Run: node scripts/check-diagrams.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let failed = 0;
for (const file of ["README.md", "flows.md"]) {
  const blocks = [...readFileSync(file, "utf8").matchAll(/```mermaid\n([\s\S]*?)```/g)].map((m) => m[1]);
  const page = `<html><body><script type="module">
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.esm.min.mjs";
mermaid.initialize({ startOnLoad: false });
const out = [];
for (const [i, b] of ${JSON.stringify(blocks)}.entries()) {
  try { await mermaid.render("m" + i, b); out.push(i + 1 + ": ok"); }
  catch (e) { out.push(i + 1 + ": FAIL " + e.message); }
}
document.title = "DONE " + out.join(" | ");
</script></body></html>`;
  const html = join(mkdtempSync(join(tmpdir(), "diagrams-")), "check.html");
  writeFileSync(html, page);
  const dom = execFileSync("google-chrome", ["--headless=new", "--disable-gpu", "--virtual-time-budget=15000", "--dump-dom", `file://${html}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const result = /<title>DONE ([^<]*)/.exec(dom)?.[1] ?? "no result (network?)";
  if (!result.includes("ok") || result.includes("FAIL")) failed++;
  console.log(`${file}: ${blocks.length} diagrams · ${result}`);
}
process.exit(failed ? 1 : 0);
