# Flows

Main task, as one sentence:

> I log a Red Bull at 2am on my night shift → it shows how much will still be in me when I sleep at 9am → I come back on my next shift, and it remembers my drinks and my sleep times.

Worked out with the agent in plan mode on 16 October 2026, then revised after two first-run checks and a strict review against the brief. The labels below are the app's actual wording. What the agent proposed, and what we kept or cut, is in the README under [Plan mode](README.md#plan-mode-what-the-agent-proposed-and-what-we-kept).

## Routes and navigation

One route per step. Every route sits in the same `Screen` frame, with the shared bottom nav (the current tab is amber and marked `aria-current="page"`) and the "Last Cup" wordmark, which links back to Now.

```mermaid
flowchart LR
  subgraph nav["Shared bottom nav, on every route"]
    direction LR
    N1["Now  /"] --- N2["Sleep  /sleep"] --- N3["Log  /log"] --- N4["Settings  /settings"]
  end
  S["/sleep<br/>When are you sleeping next?"] -- "Next / Same as last time" --> H["/ Now<br/>mg at your sleep · curve · drink chips"]
  H -- "Other…" --> L["/log<br/>Log a drink (the form)"]
  L -- "Log drink" --> H
  H -- "the sleep time in the hero" --> S
  H -- "Adjust" --> T["/settings<br/>half-life · sleep line · clear data"]
  X["any unknown URL<br/>There's nothing on this page"] -- "Back to Now" --> H
```

## 1. First visit: useful right away

```mermaid
flowchart TD
  A([Open Last Cup, nothing saved]) --> B["/sleep<br/>When are you sleeping next?<br/>a time is already filled in:<br/>the sooner of 9:00 AM and 11:00 PM"]
  B -- "time cleared" --> E1["Next to the field:<br/>Pick a time, like 09:00. Any hour works,<br/>including mornings after a night shift."]
  E1 --> B
  B -- "Next: what are you drinking?" --> C["/ Now<br/>0 mg still in you at your 9:00 AM sleep<br/>Nothing logged yet. Tap what you're drinking<br/>to see what it leaves at sleep."]
  C --> D["Each chip previews itself before you tap:<br/>Red Bull · 80 mg · +30 at sleep<br/>coral if it would put you over your line"]
  D -- "tap Red Bull" --> F(["30 mg still in you at your 9:00 AM sleep<br/>Logged Red Bull, 80 mg. Undo"])
```

Two taps from opening the app to the answer. No account, no quiz, no tour, and never an empty chart.

## 2. Main task: log a drink

```mermaid
flowchart TD
  A["/ Now"] --> B{"Is the drink<br/>a chip?"}
  B -- yes --> C["Tap the chip"]
  C --> D{"Over your line<br/>at sleep?"}
  D -- no --> E["Amber hero<br/>Under 50 mg by 7:30 AM, before you sleep."]
  D -- yes --> F["Coral hero<br/>Over your 50 mg line at sleep.<br/>Clear by 1:01 PM, 4 h after your sleep time."]
  E & F --> U["Logged Red Bull, 80 mg. Undo<br/>(for 20 s; Remove stays on each drink)"]
  B -- "no: Other…" --> L["/log  Log a drink<br/>(the form, below)"]
  L -- "Log drink" --> A
  A -. "over 400 mg in the last 24 h" .-> N["Note: past the FDA's<br/>400 mg daily reference"]
```

### The form and its errors (`/log`)

Fields: **Drink** (optional for a one-off) · **Caffeine, in mg** · **When did you start it?** (defaults to now) · ☐ **Add it to my one-tap drinks** (unticked).

```mermaid
flowchart LR
  L["/log<br/>Log drink"] -- "mg empty" --> L1["Enter the caffeine in mg, like 180.<br/>It's on the can or the café's menu."]
  L -- "'2 shots'" --> L2["Enter just the number of mg, like 180.<br/>For two shots of espresso, that's 126."]
  L -- "over 1000 mg" --> L3["That's more than any single drink we know.<br/>Check the mg, or log it as two drinks."]
  L -- "in the future" --> L4["That time hasn't happened yet.<br/>Pick when you started drinking it."]
  L -- "over a day ago" --> L5["That's over a day ago, so it won't change your<br/>next sleep. Pick a time in the last 24 hours."]
  L -- "ticked, no name" --> L6["Name it to keep it as a one-tap drink,<br/>like 'Night coffee'. Or untick the box below."]
  L -- "ticked, name taken" --> L7["You already have Coffee (95 mg) as a one-tap<br/>drink. Call this one something else."]
  L1 & L2 & L3 & L4 & L5 & L6 & L7 --> K["Under its own field · focus moves to the first ·<br/>nothing typed is cleared · goes as you edit"]
```

"180", "180 mg", "180mg large" and "1,000" are all read as numbers. Leave mid-form and come back, and the form says "Kept what you typed last time" with a **Start over** button.

## 3. Coming back: it remembers

```mermaid
flowchart TD
  A([Open on the next shift]) --> B{"Is the saved sleep<br/>still ahead?"}
  B -- "yes" --> N["/ Now<br/>your drinks from the last 24 h,<br/>the chips you use most first"]
  B -- "no, it passed" --> S["/sleep<br/>Welcome back.<br/>Last shift: 2 drinks, and 93 mg still in you<br/>when you slept yesterday at 9:00 AM."]
  S --> P["Over your 50 mg line at 4 of your last 6 sleeps.<br/>one bar per sleep, Tue … Sun"]
  P -- "Same as last time: 9:00 AM today" --> N
  P -- "pick a new time, Use the time above" --> N
```

Everything lives in `localStorage` on this device (`lastcup:v1`, plus `lastcup:draft` for a half-filled form): drinks for 30 days, the next sleep, the last 14 sleeps, settings and custom chips.

## States

| State | What you see |
|---|---|
| First visit, nothing saved | The sleep question with a time filled in, then chips that preview their effect. No empty chart. |
| Nothing logged yet | "0 mg" and "Nothing logged yet. Tap what you're drinking…" right above the chips |
| Under your line at sleep | Amber hero, "Under 50 mg by 7:30 AM, before you sleep." |
| Over your line at sleep | Coral hero, "Over your 50 mg line at sleep. Clear by …" |
| A chip would push you over | That chip turns coral before you tap, with a one-line key |
| Already over | "You're already over your 50 mg line at sleep, so each one adds to it." |
| Just logged or removed | "Logged Red Bull, 80 mg. Undo" for 20 s |
| Past 400 mg in 24 h | A muted note (a reference, not advice) |
| Returning, sleep passed | Welcome back, last shift, bars for recent sleeps, one-tap "Same as last time" |
| Returning, sleep still ahead | Straight to Now |
| Half-filled form | "Kept what you typed last time. Start over" |
| Unknown URL | "There's nothing on this page", with Back to Now |
| Storage blocked (private mode) | Works for the visit, kept in memory |

**A sleep time can't be in the past, by design.** "9:00" means the next time the clock reads 9:00, and the hint spells it out ("That's 9:00 AM today, in 4 h 49 min"). That removed an error we had planned, which is simpler than catching it.
