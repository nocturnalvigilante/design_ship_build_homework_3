# Assignment 3 grading checklist

Every item is taken from the brief. An item is ticked only once it has been **verified**, not just written. Due Tuesday 20 October 2026, 5:30 PM.

## A. Assessment ("A complete assignment has")

| # | Requirement | Evidence | Status |
|---|---|---|---|
| A1 | A live Vercel URL that works | https://design-ship-build-homework-3.vercel.app: `/`, `/log`, `/sleep`, `/settings` all return 200; Vercel check passed on commit 6875823 | ☑ |
| A2 | A new tool built around its flows (first visit, main task, coming back), with a page for each step and shared navigation | Routes `/sleep`, `/`, `/log`, `/settings`, each a step in `flows.md`, all in the shared `Screen` + `AppNav`; all three flows run end to end on the live URL (first-run check) | ☑ |
| A3 | Flows as a diagram (Mermaid), shown in `README.md` | `flows.md`, embedded in `README.md` → Flows | ☑ |
| A4 | A first visit that gives someone new something useful right away | No quiz or account: one sleep question, then tapping a chip shows the mg at sleep (`/sleep`, `/`) | ☑ |
| A5 | A form whose errors sit next to the field and say what to do next, and that keeps what the person typed | `/log`: five errors next to their fields, saying what to do; typed values kept (verified: "Pre-workout"/"5000" kept); focus moves to the first error | ☑ |
| A6 | A reason to come back, and a tool that remembers you between visits | Welcome-back summary of the last shift + one-tap "Same as last time"; drinks, sleep time, settings and custom drinks in `localStorage` (`lastcup:v1`) | ☑ |
| A7 | Keyboard access, real labels, text contrast checked with the agent | README → Accessibility: tab order and focus ring checked in headless Chrome; labels + aria-describedby; contrast computed by script | ☑ |
| A8 | First-run check in `README.md`: the agent's usability feedback | README → First-run check: persona, what happened, 15 feedback items each mapped to the commit that fixed it | ☑ |
| A9 | A GitHub repo with commits that show progress (not one-shot) | github.com/nocturnalvigilante/design_ship_build_homework_3, small commits from the first flow to the fixes | ☑ |
| A10 | Ready to explain the work in class (section E) | Talking points in [`TALK.md`](TALK.md), one section per question; rehearsing is on you | ☐ |

## B. Steps

| # | Step | Status |
|---|---|---|
| B1 | Pick a tool you'd use every week, started fresh in a new project | ☑ Last Cup, new repo `dbs-a3` |
| B2 | Flows worked out with the agent in plan mode; main task as one sentence with arrows; agent asked which steps, states and errors to add, and the user chose | ☑ Plan mode 16 Oct: agent proposed steps, states and errors; user chose the agent's recommendations (recorded in `flows.md`) |
| B3 | Flows drawn as Mermaid in `flows.md` and shown in `README.md`; one page (route) per step with shared navigation | ☑ `flows.md` + README; routes `/`, `/sleep`, `/log`, `/settings` with shared `AppNav` |
| B4 | Three similar tools studied by subagents (first screen, what they ask for, how soon something useful); decision recorded | ☑ `research.md`: RISE, Timeshifter, Caffeine Clock |
| B5 | First visit with nothing saved: useful right away, learn by doing, no tour, no empty screen | ☑ First visit redirects to `/sleep` with a suggested time; next screen is chips with "+N at sleep", so no empty chart |
| B6 | Main task and its form, built from shared components | ☑ Chips (`DrinkChip`) + `/log` form built from `Button`, `Field`, `Notice` |
| B7 | A reason to come back, saved in localStorage | ☑ `src/lib/storage.ts`; return flow verified by moving saved times back 20 h |
| B8 | Accessible: keyboard, real labels, contrast checked | ☑ See A7 |
| B9 | First-run check: the agent uses the deployed URL as a brand-new user with a goal, goes through the first visit and main task, pretends to come back later, and gives usability feedback; fixes made | ☑ 17 Oct: subagent as a night-shift nurse on the live URL (headless Chrome, 390×844, 2:45am local); fixes in commits `24d2281`…`fccf870`, re-checked on a production build and then live |

## C. Design requirements

| # | Requirement | Status |
|---|---|---|
| C1 | Flow: first visit, core task and returning all work end to end | ☑ Headless Chrome run on fe02, 17 Oct: first visit → /sleep → chip → hero; return → welcome back → Same as last time |
| C2 | Onboarding: something useful on the first visit, no dead-end empty screen | ☑ See A4/B5 |
| C3 | Forms: one column, a label on every field, errors next to the field saying what to do, typed input kept | ☑ See A5; one column, `<label for>` on every input |
| C4 | Coming back: remembers saved data locally, with an experience designed around returning | ☑ See A6 |
| C5 | Components: shared components used consistently | ☑ `src/components/`: Button, Field, Slider, Notice, DrinkChip, HeroNumber, DecayCurve, AppNav, Screen |
| C6 | Navigation: clear where you are and how to get back | ☑ Bottom nav on every route with `aria-current="page"` and an amber marker |
| C7 | Accessibility: keyboard, real labels, contrast checked | ☑ See A7 |
| C8 | Visual style (optional): a distinct style applied | ☑ Warm night palette, Space Grotesk hero, amber decay curve (research.md visual research) |
| C9 | Simplicity: no unnecessary steps, fields or interactions | ☑ Two taps to value; no account, no onboarding quiz; sleep time can't be in the past by design, so that error isn't needed |

## D. Tech stack

| # | Requirement | Status |
|---|---|---|
| D1 | Next.js and Tailwind CSS | ☑ create-next-app 15.5, Tailwind 4 |
| D2 | localStorage only: no database, accounts or external APIs | ☑ No API routes, no fetch calls; all state in `localStorage` |
| D3 | Code in your own GitHub repo | ☑ github.com/nocturnalvigilante/design_ship_build_homework_3 |
| D4 | Deployed on Vercel's free Hobby plan | ☑ https://design-ship-build-homework-3.vercel.app, auto-deploys from `main` |
| D5 | Pushed back on any unneeded database, backend or package | ☑ README → What we said no to: no chart library, date library, backend or accounts; runtime deps are only `next`, `react`, `react-dom` |
| D6 | `AGENTS.md` is the context file; no `CLAUDE.md`; checked with `/context` that `AGENTS.md` loaded | ☑ No `CLAUDE.md`; `/context` on 17 Oct lists `~/projects/dbs-a3/AGENTS.md` (1.3k tokens) under Memory files |

## E. Be ready to explain

| # | Question | Status |
|---|---|---|
| E1 | Design process: the tool, the user, what brings them back | ☐ Notes: README intro + Research decision + Flows |
| E2 | Onboarding: what someone new sees, and how they get value right away | ☐ Notes: README → Demo in 30 seconds; first-run check measured 2 taps / ~10 s |
| E3 | Retention: what brings them back, and what the tool remembers | ☐ Notes: Flow 3 + Welcome back card; `lastcup:v1` holds drinks, sleep time, settings, custom chips |
| E4 | Agent feedback: what you learned and what changed | ☐ Notes: README → First-run check table (biggest: hidden Log button, invisible doses, now dot at 0) |
| E5 | Agentic workflow: how you worked with the agent, what was easy and what was hard | ☐ Notes: README → How this was built with an agent |

## F. Submission (Google Classroom)

| # | Item | Status |
|---|---|---|
| F1 | Vercel URL | ☑ https://design-ship-build-homework-3.vercel.app |
| F2 | GitHub URL (README + commit history) | ☑ github.com/nocturnalvigilante/design_ship_build_homework_3 |

## G. Harsh-grader pass (beyond the rubric), 19 Oct

A fresh subagent graded the repo and the live URL cold against the brief, as the strictest TA it could be. Each finding below is ticked only once it's fixed and verified.

### Rubric risks
| # | Finding | Fix | Status |
|---|---|---|---|
| G1 | "Saves what the person typed" only held on error; leaving /log lost it | Draft kept in `localStorage` until logged, with "Start over" | ☑ `f4c5cf9` |
| G2 | "Choose what to keep": README said the user just took the agent's recommendations | Proposed / kept / cut table from the plan-mode transcript | ☑ `8de97e8` |
| G3 | "Add it to my one-tap drinks" ticked by default, so a blank name always errored, contradicting the README | Unticked by default; name needed only when ticked | ☑ `8b01dc6` |
| G4 | Contrast evidence was a table only | `scripts/contrast.mjs`, 14 pairs, rerunnable | ☑ `47f6f80` |
| G5 | Flow diagrams didn't match the app's copy ("+30 mg", "today" vs 24 h, no Undo) | Diagrams redrawn from the code, plus a map of the routes and nav | ☑ `0902c7b`, rendered with Mermaid 10.9 to check |
| G6 | `/log` pills and checkbox were hand-rolled, against our own shared-components rule | Shared `Pill` and `Checkbox` components | ☑ `1c41078` |

### Bugs
| # | Finding | Fix | Status |
|---|---|---|---|
| G7 | "2 shots" logged 2 mg; "1,000" logged 1 mg | Accept "180", "180mg", "1,000"; anything else gets an error saying what to type | ☑ `8b01dc6`, verified: '2 shots' errors |
| G8 | Errors on /log stayed after the field was fixed (/sleep cleared them) | A field's error clears as you edit it | ☑ `8b01dc6` |
| G9 | Already over the line, every chip is coral but the key says "would put you over" | Key says "you're over your line" in that state | ☑ `3e64afb`, verified live |
| G10 | `over` used the rounded mg, clear-by the exact one: "Under 50 mg by 9:02, before you sleep" at a 9:00 sleep | One value for both | ☑ `3e64afb` |
| G11 | A custom drink named like a built-in ("Coffee", 180 mg) silently didn't become a chip; usage counts were case-sensitive | Error next to the name saying to rename it; case-insensitive matching | ☑ `8b01dc6`, `a824559`, verified: 'coffee' clash errors |
| G12 | The Undo line never expired | Clears after 20 s | ☑ `3e64afb`, verified live: gone after 20 s |
| G13 | 24 h clock in the app, "09:00 AM" in the native inputs | One locale-aware clock format everywhere | ☑ `84d06e6` |
| G14 | Settings saved "5" while typing "50", flashing coral | The sleep line saves when you leave the field | ☑ `e57db1b`, verified: typing 5 doesn't save |
| G15 | Chip borders 1.3:1 against the page (WCAG 1.4.11 asks 3:1 for component edges) | Interactive edges use the 3.7:1 edge colour | ☑ `48deae7`, `1c41078` |

### Retention and onboarding
| # | Finding | Fix | Status |
|---|---|---|---|
| G16 | Coming back only remembered last shift | Past sleeps kept; welcome back shows mg at each of the last few as bars | ☑ `9ae97a9` |
| G17 | First suggestion at 7:15am was 23:00, wrong for a nurse just off shift | Sooner of 9:00 / 23:00, at least 45 min away | ☑ `05dfe5c` |
| G18 | Welcome back said "9:00" with no day after a week away | Says the day | ☑ `9ae97a9` |

### Presentation
| # | Finding | Fix | Status |
|---|---|---|---|
| G19 | README had no screenshots; first-run check was 7th of 11 sections | Four-screen strip like the brief's figure at the top; brief → evidence table; reordered | ☑ `8de97e8` |
| G20 | On a laptop the app is a narrow phone column | Two-column Now at desktop width; wordmark links home | ☑ `2e3f2f8`, screenshot `docs/desktop-now.png` |
| G21 | Nurses use it from the home screen | Web app manifest (name, icon, colours), no packages | ☑ `7242f58` |
| G22 | First-run check ran once, before these changes | Round 2: new persona on the live URL after the fixes, feedback and changes in README | ☑ PhD student at 3pm; 10 fixes in `a56ed85`…`b440fd6`, re-checked on a production build and live |
| G23 | Talking points for class are scattered | `TALK.md`: the five questions, answered briefly | ☑ `929ba53` |

**Not changed:** commit timestamps. Some commits cluster within minutes because each was committed as soon as it was verified; rewriting history to look spread out would misrepresent it.

## H. Second strict review, 20 Oct: where marks could still be cut

Three new reviewers, each given the brief and told to ignore this checklist: one read the brief literally, one checked every claim in the README against the code and history, and one used the live site by keyboard. Ranked by risk.

| # | Where marks could be cut | Fix | Status |
|---|---|---|---|
| H1 | "Choose what to keep": the README says "I took its recommended set", as if the agent chose | Record the decisions I made in the setup session (the tool, the users, rotating shifts, not reusing the A2 style), in my own words | ☐ |
| H2 | "Your Assignment 2 design system is a good place to start": A2 is never mentioned | Say what I decided about A2 and why | ☐ |
| H3 | The commit-timestamp note claims "committed as soon as verified", but some commits share a second | Say plainly that each session's changes were split into one commit per change | ☐ |
| H4 | Demo numbers don't match the screenshots, and "30 mg at 9:00" with "under 50 by 7:30" is impossible | Use the screenshot's own values everywhere | ☐ |
| H5 | Stale counts: commits (says 60), errors (five, seven, really nine), "last shift", round-1 item count, old commit for the Vercel check, component list | Correct each | ☐ |
| H6 | `drinks.ts` says estimates are "shown in the UI", but they aren't | Mark estimated drinks with "~" on chips and pills | ☐ |
| H7 | "/context shows AGENTS.md loaded": only a sentence, no evidence | A screenshot of `/context` in `docs/` | ☐ needs me |
| H8 | "Ask your agent to send subagents": claimed, not shown | Quote one subagent prompt and part of its report in `research.md` | ☐ |
| H9 | "A page for each step": welcome back has no route of its own | A step → route table under Flows, explaining why welcome back belongs on `/sleep` | ☐ |
| H10 | `/sleep` error doesn't move focus to the field; Clear data gives no confirmation | Focus on error; "Cleared." line | ☐ |
| H11 | Settings says "Changes save as you make them", but the sleep line saves on leaving the field | Say exactly when it saves | ☐ |
| H12 | Can't verify quickly: no repo link, commit hashes not clickable | Link the repo; make hashes links | ☐ |
| H13 | The agent reads as the author ("computed by the agent", "Harsh-grader pass"); "I" and "we" mixed | One voice, decisions framed as mine | ☐ |
| H14 | `AGENTS.md` has "(working name)", cluster host names and a username, stale wording, and "the commit history is graded" | Clean up and update it | ☐ |
| H15 | Cluster host names in README and CHECKLIST | "a production build" | ☐ |
| H16 | The submitted checklist has empty boxes and talks to the student ("rehearsing is on you") | Section E points to the notes; no instructions | ☐ |
| H17 | Cited checks aren't in the repo (the first-run browser script, the diagram check, the testers' reports) | Commit the scripts and the round-2 tester's report | ☐ |
| H18 | `research.md` quotes "62 mg … at your 9:00 sleep" as if it's the app | Label it the planned wording | ☐ |
| H19 | The README's name-clash error is cut short | Full text | ☐ |
| H20 | Focus is lost after Remove; Clear data loses focus when the confirm opens and after Keep | Focus goes to Undo, to "Yes, clear it all", and back to "Clear my data" | ☐ |
| H21 | A sleep from a week ago reads "Tuesday", as if this week; the bars too | Dates ("Tue 13 Oct") once it's 6+ days ago | ☐ |
| H22 | On the return screen Enter does nothing (the one button isn't a submit) | "Same as last time" submits the form | ☐ |
| H23 | Settings drops an invalid sleep line silently when you leave | Keep what was typed, with its error, until it's fixed | ☐ |
| H24 | Hero sleep link and "Adjust" are under 44 px tall | 44 px tap area | ☐ |
| H25 | Now's page title is just "Last Cup" | "Now · Last Cup" | ☐ |
| H26 | The curve runs through the "50 mg" label | A background-coloured outline on chart labels | ☐ |
| H27 | "0" or "-5" mg gets the "two shots" message; a restored draft can bring back a week-old time | A message for 0 or less; old draft times reset to now | ☐ |
| H28 | At 11:30 PM it suggests 9:00 AM; "your 9:00 AM tomorrow sleep" reads badly | Also consider 1:00 AM; "your 9:00 AM sleep tomorrow" | ☐ |
