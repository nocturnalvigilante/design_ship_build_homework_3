# Assignment 3 grading checklist

Every item is taken from the brief. An item is ticked only once it has been **verified**, not just written. Due Tuesday 20 October 2026, 5:30 PM.

## A. Assessment ("A complete assignment has")

| # | Requirement | Evidence | Status |
|---|---|---|---|
| A1 | A live Vercel URL that works | | ☐ |
| A2 | A new tool built around its flows (first visit, main task, coming back), with a page for each step and shared navigation | | ☐ |
| A3 | Flows as a diagram (Mermaid), shown in `README.md` | | ☐ |
| A4 | A first visit that gives someone new something useful right away | | ☐ |
| A5 | A form whose errors sit next to the field and say what to do next, and that keeps what the person typed | | ☐ |
| A6 | A reason to come back, and a tool that remembers you between visits | | ☐ |
| A7 | Keyboard access, real labels, text contrast checked with the agent | | ☐ |
| A8 | First-run check in `README.md`: the agent's usability feedback | | ☐ |
| A9 | A GitHub repo with commits that show progress (not one-shot) | | ☐ |
| A10 | Ready to explain the work in class (section E) | | ☐ |

## B. Steps

| # | Step | Status |
|---|---|---|
| B1 | Pick a tool you'd use every week, started fresh in a new project | ☑ Last Cup, new repo `dbs-a3` |
| B2 | Flows worked out with the agent in plan mode; main task as one sentence with arrows; agent asked which steps, states and errors to add, and the user chose | ☐ |
| B3 | Flows drawn as Mermaid in `flows.md` and shown in `README.md`; one page (route) per step with shared navigation | ☐ |
| B4 | Three similar tools studied by subagents (first screen, what they ask for, how soon something useful); decision recorded | ☑ `research.md`: RISE, Timeshifter, Caffeine Clock |
| B5 | First visit with nothing saved: useful right away, learn by doing, no tour, no empty screen | ☐ |
| B6 | Main task and its form, built from shared components | ☐ |
| B7 | A reason to come back, saved in localStorage | ☐ |
| B8 | Accessible: keyboard, real labels, contrast checked | ☐ |
| B9 | First-run check: the agent uses the deployed URL as a brand-new user with a goal, goes through the first visit and main task, pretends to come back later, and gives usability feedback; fixes made | ☐ |

## C. Design requirements

| # | Requirement | Status |
|---|---|---|
| C1 | Flow: first visit, core task and returning all work end to end | ☐ |
| C2 | Onboarding: something useful on the first visit, no dead-end empty screen | ☐ |
| C3 | Forms: one column, a label on every field, errors next to the field saying what to do, typed input kept | ☐ |
| C4 | Coming back: remembers saved data locally, with an experience designed around returning | ☐ |
| C5 | Components: shared components used consistently | ☐ |
| C6 | Navigation: clear where you are and how to get back | ☐ |
| C7 | Accessibility: keyboard, real labels, contrast checked | ☐ |
| C8 | Visual style (optional): a distinct style applied | ☐ |
| C9 | Simplicity: no unnecessary steps, fields or interactions | ☐ |

## D. Tech stack

| # | Requirement | Status |
|---|---|---|
| D1 | Next.js and Tailwind CSS | ☑ create-next-app 15.5, Tailwind 4 |
| D2 | localStorage only: no database, accounts or external APIs | ☐ |
| D3 | Code in your own GitHub repo | ☐ |
| D4 | Deployed on Vercel's free Hobby plan | ☐ |
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
| F1 | Vercel URL | ☐ |
| F2 | GitHub URL (README + commit history) | ☐ |
