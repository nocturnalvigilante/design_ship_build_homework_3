# Onboarding research: three similar tools

Brief step 3. Four subagents ran in parallel on 16 October 2026: three studied one tool each (how it welcomes someone new: the first screen, what it asks for, how soon you get something useful), and a fourth studied visual design for night use. They worked from public sources (App Store listings, company sites, help pages, published teardowns), not hands-on use. Anything they couldn't confirm is marked *unverified*.

## 1. RISE (sleep and energy)

- **First screen:** a dark intro and a testimonial carousel, then a quiz (age, goals, sleep problems, energy boosters), a primer screen before each permission prompt, and a wake-time question.
- **Asks for:** **30+ steps** (Reteno flow gallery).
- **Something useful after:** about 2 minutes. You see your sleep need, sleep debt and energy schedule, then hit a **hard paywall** and an email sign-up. Users call setup "complex" (Product Hunt, mwm.ai).
- **Caffeine:** a cutoff reminder about 10 h before the "Melatonin Window". It's based on circadian timing, **not on what you actually drank**. There's no drink logging.
- **Shift work:** its help centre says the Melatonin Window "may not be reliable" on rotating shifts. Wake goals are one per weekday and one per weekend, changed by hand.
- **Keep:** one big cutoff time, dark by default, and a screen explaining *why* before each question.
- **Avoid:** the long quiz before any value, and the fixed weekday/weekend schedule.

Sources: apps.apple.com/us/app/rise-sleep-tracker/id1453884781 · screensdesign.com/apps/rise-sleep-tracker · gallery.reteno.com/flows/app-screens-rise · risescience.com/blog/when-should-you-stop-drinking-coffee · producthunt.com/products/rise-science

## 2. Timeshifter Shift Work (circadian plans for shift workers)

- **Asks for:** your work schedule, sleep pattern, chronotype, commute, and whether you use caffeine or melatonin (optional). **An account login is required.** There's a 30-day trial, then $6.99/month.
- **Something useful after:** *unverified*. Onboarding needs a full schedule before it produces a plan.
- **Rotating shifts:** supported. "Quick Shift Entry" adds many dates at once; before that existed, a few shifts at a time was the top complaint.
- **Caffeine advice:** given as durations ("avoid caffeine for 9 hours"), "little and often", then stop "as long as possible before bed".
- **Keep:** caffeine as an opt-in, advice as plain durations, and only advice people can actually follow on shift.
- **Avoid:** a required login (a named con in reviews, along with frequent logouts) and the front-loaded setup.

Sources: timeshifter.com/shift-work-app · apps.apple.com/us/app/id1594538527 · healthify.nz/apps/t/timeshifter-shift-work-app · timeshifter.com/support/shift-work · timeshifter.com/shift-work/caffeine-and-shift-work

## 3. Caffeine Clock (with HiCoffee and HalfCup for comparison)

- **First screen:** a "short setup" (habits and sensitivity), **no account**, data kept on the device.
- **Something useful:** a drink library of 200+ items, custom drinks, fractional servings, and a one-tap quick-add widget.
- **The display:** a live curve with the projected decline, long-press to scrub, and a bedtime target that warns early. HalfCup shows a "sleep-ready by" time with a half-life adjustable from 2 to 10 h. HiCoffee predicts how much is left at bedtime and warns *before* a drink would breach your limit.
- **Keep:** one-tap usual drinks, a curve with a bedtime marker and a plain "clear by" time, warning before logging, and no account.
- **Avoid:** a hidden, fixed half-life (reviewers call it a "critical gap"), and showing a daily budget without saying what still fits before sleep.

Sources: apps.apple.com/app/id6504160396 · apps.apple.com/app/id1507361706 · mwm.ai/apps/caffeine-tracker-halfcup/6756392479 · acs.ist.psu.edu/papers/ritterY11.pdf

## What we'll use in our first visit

The gap: RISE and Timeshifter make you work (30+ steps, a login, a paywall, a full schedule) before you see anything, and RISE says itself that it fails on rotating shifts. Caffeine Clock is quick, but it assumes a fixed bedtime.

So our first visit is **two taps, no quiz, no account**:

1. One question: **"When are you sleeping next?"** It suggests a time, and any hour works, including 9am after a night shift.
2. Drink chips (Red Bull, Monster, coffee, chai…). Tap one and the answer appears at once, something like **"62 mg still in you at your 9:00 sleep"** (the wording planned here; the built app says "62 mg still in you at your 9:00 AM sleep").

We learn the rest by doing: the next sleep time is re-asked each visit (one tap to keep the last one), and usual drinks rise to the top. That handles rotating shifts with no calendar to fill in.

## Visual research (fourth subagent)

- Night apps use dark grey, not black (Material dark theme: #121212), and soft rather than saturated accents.
- Blue and green light suppress melatonin more than amber or red (Wright & Lack 2001, seen second-hand, *unverified*), so we use warm, low-luminance colours and no white areas.
- Shipped caffeine apps pair a decay curve with one headline time.
- One-handed use: Hoober found 49% of people hold the phone in one hand and only the lower third is easy to reach, so the actions go at the bottom.

## Caffeine numbers

| Drink | mg | Source |
|---|---|---|
| Red Bull 250 ml | 80 | Red Bull |
| Monster 16 oz | 160 | *unverified* (secondary sites only) |
| Celsius 12 oz | 200 | product label |
| Coca-Cola 12 oz | 34 | product label |
| Brewed coffee 8 oz | ~95 | USDA FDC 171890 (40 mg/100 g) |
| Espresso 1 oz | ~63 | USDA FDC 171891 (212 mg/100 g) |
| Black tea 8 oz | ~47 | USDA FDC 173227 (20 mg/100 g) |
| Green tea 8 oz | ~28 | USDA FDC 171917 (12 mg/100 g) |
| Masala chai | *none found* | no USDA value; we'll label it an estimate |

The FDA gives 400 mg/day as the reference for most adults. Half-life is about 5 h on average, commonly 3–7 h (StatPearls; FDA document fda.gov/media/169548). Pregnancy, smoking and some medications change it.
