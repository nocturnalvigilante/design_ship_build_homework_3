# Flows

Main task, as one sentence:

> I log a Red Bull at 2am on my night shift → it shows how much will still be in me when I sleep at 9am → I come back on my next shift, and it remembers my drinks and my sleep times.

Worked out in plan mode on 16 October 2026. The agent proposed the steps, states and errors below; the user reviewed them and chose to go with the agent's recommendations.

## Steps (one route each, shared bottom nav)

| Route | Step |
|---|---|
| `/sleep` | When are you sleeping next? |
| `/` | Now: what will still be in you at sleep, plus one-tap drinks |
| `/log` | Log a drink that isn't a chip |
| `/settings` | Half-life, sleep threshold, clear data |

## 1. First visit

```mermaid
flowchart TD
  A([Open Last Cup]) --> B{Anything saved?}
  B -- no --> C["/sleep<br/>When are you sleeping next?<br/>suggested time preselected"]
  C -- no time picked --> E1["Error next to field:<br/>Pick a time, like 09:00. Any hour works."]
  E1 --> C
  C -- Save --> D["/ Now<br/>0 mg at your 9:00 sleep<br/>drink chips at the bottom"]
  D --> F["Each chip shows its impact<br/>+30 mg at sleep"]
  F -- tap Red Bull --> G([Hero updates at once:<br/>30 mg still in you at 9:00])
```

## 2. Main task: log a drink

```mermaid
flowchart TD
  A["/ Now"] --> B{Drink is a chip?}
  B -- yes --> C[Tap chip]
  C --> D{Over threshold at sleep?}
  D -- no --> E[Hero amber + clear by HH:MM]
  D -- yes --> F[Hero coral: over your 50 mg line<br/>+ clear by HH:MM]
  E & F --> U[Undo available on the new entry]
  B -- no --> L["/log<br/>name · mg · when you started it"]
  L -- mg missing / not a number --> L1[Enter the caffeine in mg, it's on the can.]
  L -- mg over 1000 --> L2[That's more than any single drink we know.]
  L -- time in the future --> L3[That time hasn't happened yet.]
  L -- over a day ago --> L5[That won't change your next sleep. Pick a time in the last 24 hours.]
  L -- name empty --> L4[Name it so it shows up as a chip next time.]
  L1 & L2 & L3 & L4 & L5 --> L
  L -- Save --> A
  A -. over 400 mg today .-> N[Muted note: past the FDA's 400 mg day reference]
```

## 3. Coming back

```mermaid
flowchart TD
  A([Open on next shift]) --> B{Saved sleep still ahead?}
  B -- yes --> N["/ Now<br/>remembered drinks, usual drinks first"]
  B -- no, it passed --> S["/sleep<br/>Welcome back. Last shift: 3 drinks, 64 mg at your 9:00 sleep"]
  S -- tap Same time --> N
  S -- pick a new time --> N
```

## States

- **First visit, nothing saved:** go straight to the sleep question, then the chips. No empty chart.
- **Under the threshold at sleep:** amber hero.
- **Over the threshold at sleep:** coral hero and "clear by HH:MM".
- **Chip would cross the threshold:** the chip's preview turns coral before you tap.
- **Returning, sleep passed:** welcome-back summary and a one-tap "Same time".
- **Returning, sleep ahead:** straight to Now.
- **Past 400 mg in 24 h:** a muted note (reference, not advice).
- **Sleep times can't be in the past:** "9:00" means the next time the clock reads 9:00, and the hint spells it out ("That's 9:00 tomorrow, in 7 h"). That removed an error we'd planned, which is simpler than catching it.
