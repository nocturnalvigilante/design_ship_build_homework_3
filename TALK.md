# Talking points for class

The five things the brief says to be ready to explain. About a minute each. Open the live site on your phone, and have the README strip ready as a backup.

## 1. Design process: the tool, the user, what brings them back

- **The tool:** Last Cup tells you how much caffeine will still be in you when you next sleep.
- **The user:** people whose bedtime moves, like night-shift nurses (sleep at 9am) and PhD students (sleep at 1am, or 3am).
- **The gap:** every caffeine app I found assumes a fixed bedtime. RISE's own help centre says it isn't reliable on rotating shifts. Timeshifter wants an account and your whole shift calendar first.
- **The idea:** ask one question, "When are you sleeping next?", every time, and make it one tap to keep the last answer. Then each drink shows what it'll leave at sleep before you tap it.
- **Process:** I wrote the main task as one sentence with arrows, worked out the flows in plan mode, had subagents study three tools, built one route per step, then tested it with agents and fixed what they found.

## 2. Onboarding: what someone new sees, and how they get value right away

- No account, no quiz, no tour. The first screen is one question, with a sensible answer already filled in: at 4am it suggests 9:00 AM.
- Tap Next, and you see chips that preview their effect, "Red Bull · 80 mg · +30 at sleep". So before logging anything you've already learned something.
- One tap on Red Bull: "30 mg still in you at your 9:00 AM sleep", a curve, and "Under 50 mg by 7:30 AM". That's 2 taps and about 10 seconds.
- Never an empty screen. With nothing logged, it says "Tap what you're drinking to see what it leaves at sleep" right above the chips.
- **Research behind it:** RISE asks 30+ questions before anything useful. I took the opposite path: learn by doing.

## 3. Retention: what brings someone back, and what it remembers

- **The trigger is real:** every shift you're deciding "can I have another coffee?" That's the moment to open it.
- **Coming back after your sleep:** "Welcome back. Last shift: 2 drinks, and 93 mg still in you when you slept yesterday at 9:00 AM." Then a bar per recent sleep: "Over your 50 mg line at 4 of your last 6 sleeps." That pattern is the reason to keep logging.
- **One tap:** "Same as last time: 9:00 AM today".
- **What it remembers, in localStorage only:** drinks for 30 days, the last 14 sleeps, the next sleep, the half-life and sleep line, custom one-tap drinks (most-used float to the front), and even a half-typed form.

## 4. The agent's feedback: what I learned, what changed

- **Round 1, as a night-shift nurse:** the Log button was hidden behind the nav. Chips didn't show their mg. The "now" dot sat at 0 right after a drink. A one-off drink shouldn't need a name. 15 items, each fixed in its own commit.
- **The strict-grader review:** the biggest lesson. My README claimed the name was optional, but the checkbox defaulted to ticked, so it wasn't. "2 shots" silently logged 2 mg. Leaving the form lost what you typed, which the brief explicitly asks about. Agents are good at finding gaps between what you *say* the app does and what it *does*.
- **Round 2, as a PhD student:** see the README for what it found and what changed.
- **What I learned:** test as a specific person at a specific time of day. Most bugs only showed up for "a nurse at 7:15am" or "a student at 3:30pm", not for "a user".

## 5. Agentic workflow: how I worked with the agent; what was easy and hard

- `AGENTS.md` held the brief's hard rules and the design tokens, so every session started from them, and the agent pushed back on extra packages: no chart library, no date library.
- Plan mode for flows, then small commits. Subagents in parallel for research, testing and review.
- I made the agent prove things: contrast is a script, the flows and the keyboard order were checked in headless Chrome, and the checklist only gets ticked after verification.
- **Easy:** shared components first (Button, Field, Chip), so most fixes touched one file.
- **Hard:** things that only break in a real browser, like fonts not loading, timing (a drink logged in the same 30 s didn't count), and a test browser killed before localStorage was saved, which looked like an app bug. Also, the agent will happily write a README that's ahead of the code, so you have to check it.
