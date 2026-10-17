# AGENTS.md

Context for any coding agent working in this repo. MPCS 51238 Design, Build, Ship, Assignment 3: "Patterns & Flows: An Everyday Tool". Due Tuesday 20 October 2026, 5:30 PM.

## What this is

**Last Cup** (working name) is a caffeine tracker for people whose bedtime moves: night-shift nurses, rotating-shift healthcare workers, and PhD students. You log a drink, and it tells you how much caffeine will still be in your body when you next sleep, whatever time of day that is.

Main task, as one sentence:

> I log a Red Bull at 2am on my night shift → it shows how much will still be in me when I sleep at 9am → I come back on my next shift, and it remembers my drinks and my sleep times.

## Hard rules (from the brief)

- **Stack:** Next.js (App Router) and Tailwind CSS only. Data is saved in the browser with `localStorage`.
- **No database, backend, accounts, API routes or external APIs.** If something seems to need one, stop and ask instead.
- **No new npm packages** without asking first. Charts are hand-drawn SVG.
- **One route per flow step**, with shared navigation.
- **Shared components** (`src/components/`): Button, Field (label + input + error), DrinkChip, and so on, used everywhere. Don't hand-roll a one-off button or input.
- **Forms:** one column, a real `<label>` on every field, and the error sits next to its field and says what to do next ("Enter the caffeine in mg, it's on the can", not "Invalid input"). Never clear what the person typed when there's an error.
- **Accessibility:** everything works by keyboard with a visible focus ring, and text contrast is at least 4.5:1 (body) and 3:1 (large). Check contrast; don't eyeball it.
- **No one-shot work.** Make small commits with descriptive messages. The commit history is graded.

## Design direction (from `research.md`)

- Dark by default and warm, because it's used at 3am: no pure white, no blue or green accents, no large bright areas.
- Tokens: bg `#14110F`, surface `#1F1A16`, text `#E8DCCB`, muted `#A8998A`, accent/curve amber `#F2A541`, over-threshold coral `#E0705A`.
- Type: Inter for text, Space Grotesk for the hero number, `tabular-nums` on every figure.
- The hero is one big number ("62 mg still in you at your 9:00 sleep"), then a "clear by HH:MM" line, then an amber decay curve with a "now" dot and a sleep marker. The main actions are at the bottom, in thumb reach, with tap targets of at least 44px.

## The model

- One-compartment exponential decay: `remaining = dose × 0.5^(hours / halfLife)`. The default half-life is 5 h, adjustable from 2 to 10 h. Absorption is treated as instant, and the UI says so.
- The sleep threshold defaults to 50 mg. It is adjustable and is a heuristic, not medical advice, and the UI says so. The daily limit reference is the FDA's 400 mg.
- Every built-in drink's mg value is cited in `src/lib/drinks.ts`.

## Working here

- The cluster's `fe01` is a login node. **Don't run builds there**; use `fe02` (`ssh rajhansini@fe02.ai.cs.uchicago.edu`) with Node 22 from `~/.local/node/bin`.
- `npm run dev`, `npm run build`, `npm run lint`.
- `CHECKLIST.md` maps every brief requirement to evidence. Tick an item only once it has been verified.
