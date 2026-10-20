// Minimal headless-Chrome driver over the DevTools protocol (no npm packages).
// The two first-run checks and the keyboard checks in the README were run with this.
// Needs google-chrome on PATH and Node 22 (built-in fetch and WebSocket).
// Usage: node scripts/drive.mjs <profileDir> <outDir> [width height] < steps.json
//   Reuse the same profileDir to keep localStorage between runs ("coming back").
//   Steps also take {tz: "America/Chicago"} to set the local time zone.
// Steps: {go}, {click: text}, {fill: labelText, value}, {key: "Tab"|"Enter"}, {shot: name},
//        {text: true}, {eval: js}, {wait: ms}, {focus: true} (report focused element)
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const [profile, outDir, vw = "390", vh = "844"] = process.argv.slice(2);
const W = +vw, H = +vh, MOBILE = W < 700;
mkdirSync(outDir, { recursive: true });
const steps = JSON.parse(readFileSync(0, "utf8"));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn("google-chrome", [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  "--no-first-run", "--disable-gpu", `--window-size=${W},${H}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    target = list.find((t) => t.type === "page");
  } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) =>
  new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) return "EVAL ERROR: " + JSON.stringify(r.result.exceptionDetails.exception?.description);
  return r.result?.result?.value;
};

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: MOBILE ? 2 : 1, mobile: MOBILE });

const findByText = (t) => `(() => {
  const t = ${JSON.stringify(t)}.toLowerCase();
  const els = [...document.querySelectorAll('button, a, [role=button], label')];
  return els.find(e => (e.innerText||'').trim().toLowerCase() === t) || els.find(e => (e.innerText||'').toLowerCase().includes(t));
})()`;

for (const s of steps) {
  if (s.go) { await send("Page.navigate", { url: s.go }); await sleep(s.waitMs ?? 2500); console.log(`→ go ${s.go} (now at ${await evaluate("location.pathname")})`); }
  else if (s.click) {
    const ok = await evaluate(`(() => { const e = ${findByText(s.click)}; if (!e) return false; e.click(); return true; })()`);
    await sleep(800);
    console.log(`→ click "${s.click}": ${ok ? "ok" : "NOT FOUND"} (now at ${await evaluate("location.pathname")})`);
  } else if (s.fill !== undefined) {
    const ok = await evaluate(`(() => {
      const lab = [...document.querySelectorAll('label')].find(l => l.innerText.trim().toLowerCase().startsWith(${JSON.stringify(s.fill)}.toLowerCase()));
      const input = lab && (lab.htmlFor ? document.getElementById(lab.htmlFor) : lab.querySelector('input'));
      if (!input) return false;
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      set.call(input, ${JSON.stringify(s.value)});
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true; })()`);
    await sleep(300);
    console.log(`→ fill "${s.fill}" = "${s.value}": ${ok ? "ok" : "NOT FOUND"}`);
  } else if (s.key) {
    const code = { Tab: 9, Enter: 13, " ": 32 }[s.key];
    for (const type of [s.key === "Enter" ? "keyDown" : "rawKeyDown", "keyUp"]) await send("Input.dispatchKeyEvent", { type, key: s.key, code: s.key, windowsVirtualKeyCode: code, text: type === "keyDown" ? "\r" : undefined });
    await sleep(250);
    console.log(`→ key ${s.key}`);
  } else if (s.focus) {
    console.log("  focused:", await evaluate(`(() => { const e = document.activeElement; return e ? (e.tagName + ' "' + (e.getAttribute('aria-label') || e.innerText || e.value || '').trim().slice(0,60) + '"' + ' outline=' + getComputedStyle(e).outlineStyle + ' ' + getComputedStyle(e).outlineColor) : 'none'; })()`));
  } else if (s.shot) {
    const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: !!s.full });
    writeFileSync(`${outDir}/${s.shot}`, Buffer.from(r.result.data, "base64"));
    console.log(`→ screenshot ${outDir}/${s.shot}`);
  } else if (s.text) {
    console.log("---- page text ----\n" + (await evaluate("document.body.innerText")) + "\n-------------------");
  } else if (s.eval) {
    console.log(`→ eval: ${JSON.stringify(await evaluate(s.eval))}`);
  } else if (s.tz) {
    await send("Emulation.setTimezoneOverride", { timezoneId: s.tz });
    console.log(`→ timezone ${s.tz}, local time now ${await evaluate("new Date().toString()")}`);
  } else if (s.wait) await sleep(s.wait);
}
await send("Browser.close").catch(()=>{}); await sleep(1500);
ws.close();
chrome.kill();
process.exit(0);
