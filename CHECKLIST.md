# Assignment 3 grading checklist

Every item is taken from the brief. An item is ticked only once it has been **verified**, not just written. Due Tuesday 20 October 2026, 5:30 PM.

## A. Assessment ("A complete assignment has")

| # | Requirement | Evidence | Status |
|---|---|---|---|
| A1 | A live Vercel URL that works | https://design-ship-build-homework-3.vercel.app: `/`, `/log`, `/sleep`, `/settings` all return 200; Vercel check passed on commit 6875823 | ☑ |
| A2 | A new tool built around its flows (first visit, main task, coming back), with a page for each step and shared navigation | | ☐ |
| A3 | Flows as a diagram (Mermaid), shown in `README.md` | `flows.md`, embedded in `README.md` → Flows | ☑ |
| A4 | A first visit that gives someone new something useful right away | No quiz or account: one sleep question, then tapping a chip shows the mg at sleep (`/sleep`, `/`) | ☑ |
| A5 | A form whose errors sit next to the field and say what to do next, and that keeps what the person typed | `/log`: five errors next to their fields, saying what to do; typed values kept (verified: "Pre-workout"/"5000" kept); focus moves to the first error | ☑ |
| A6 | A reason to come back, and a tool that remembers you between visits | Welcome-back summary of the last shift + one-tap "Same as last time"; drinks, sleep time, settings and custom drinks in `localStorage` (`lastcup:v1`) | ☑ |
| A7 | Keyboard access, real labels, text contrast checked with the agent | README → Accessibility: tab order and focus ring checked in headless Chrome; labels + aria-describedby; contrast computed by script | ☑ |
| A8 | First-run check in `README.md`: the agent's usability feedback | | ☐ |
| A9 | A GitHub repo with commits that show progress (not one-shot) | github.com/nocturnalvigilante/design_ship_build_homework_3, small commits from the first flow to the fixes | ☑ |
| A10 | Ready to explain the work in class (section E) | | ☐ |

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
| B9 | First-run check: the agent uses the deployed URL as a brand-new user with a goal, goes through the first visit and main task, pretends to come back later, and gives usability feedback; fixes made | ☐ |

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
| D5 | Pushed back on any unneeded database, backend or package | ☐ |
| D6 | `AGENTS.md` is the context file; no `CLAUDE.md`; checked with `/context` that `AGENTS.md` loaded | ☐ `AGENTS.md` written, no `CLAUDE.md`; `/context` check still to do |

## E. Be ready to explain

| # | Question | Status |
|---|---|---|
| E1 | Design process: the tool, the user, what brings them back | ☐ |
| E2 | Onboarding: what someone new sees, and how they get value right away | ☐ |
| E3 | Retention: what brings them back, and what the tool remembers | ☐ |
| E4 | Agent feedback: what you learned and what changed | ☐ |
| E5 | Agentic workflow: how you worked with the agent, what was easy and what was hard | ☐ |

## F. Submission (Google Classroom)

| # | Item | Status |
|---|---|---|
| F1 | Vercel URL | ☑ https://design-ship-build-homework-3.vercel.app |
| F2 | GitHub URL (README + commit history) | ☑ github.com/nocturnalvigilante/design_ship_build_homework_3 |
