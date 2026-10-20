# First-run check, round 1: night-shift nurse (17 October 2026)

A fresh subagent used the live URL as a brand-new user and gave this report (brief step 8). It didn't see the code. Below are its prompt and its report, unedited except where noted. What changed as a result is in the README under [First-run check](../../README.md#first-run-check).

Screenshots it took: [first screen](round1/01-first.png) · [after the Red Bull](round1/03-after-redbull.png) · [the form's errors](round1/05-error.png)

## Prompt

You are doing a "first-run check" for a class assignment: use a deployed web app as a brand-new user with a real goal, then give honest usability feedback. Do NOT read the app's source code (no files under the app's src folder). Judge only what a real user sees.

## Your persona
You're a night-shift ICU nurse, 2:45am, mid-shift. You just drank a Red Bull. Your shift ends at 7:30 and you plan to sleep at 9:00am. You're tired, on your phone, one-handed, with maybe 60 seconds. You've heard about "Last Cup" and you want to know: will this Red Bull wreck my sleep? Later you also had a large coffee from the hospital café that isn't a preset; the café board says 180 mg. You'll come back on your next shift.

## The app
https://design-ship-build-homework-3.vercel.app (mobile, 390x844)

## How to drive it

*(Instructions for running the headless Chrome driver on the lab machine are left out here: host name, login and paths. The driver is [`scripts/drive.mjs`](../../scripts/drive.mjs).)*

## What to do
1. First visit: open the app with nothing saved. Try to reach your goal (log the Red Bull, find out what's left at your 9:00 sleep). Note every moment of hesitation or confusion, how many taps it takes to get an answer, and whether you'd trust the number.
2. Main task: log the 180 mg café coffee through whatever path the app offers. Deliberately make a typical tired mistake first (e.g. type "180mg large" or leave something blank), and judge the error messages: do they sit next to the field, say what to do, and keep what you typed?
3. Coming back: simulate your next shift ~22 hours later. Use an eval step BEFORE reloading that shifts every saved time back 22 h: localStorage key is "lastcup:v1" (JSON with `drinks[].at` and `nextSleep` as epoch ms) — subtract 22*3600*1000 from each, write it back, then {"go":...} again. What does it show? Does it remember you? Is the return experience fast?
4. Quick keyboard pass: Tab through the main screen a few times with {"focus":true} after each; is focus visible and order sensible?
5. Poke at Settings briefly as a user would.

## Report back (this is your final message; be concrete and harsh, like a demanding usability tester)
- A short narrative of the run in first person as the nurse (what you did, what you saw, with the actual numbers/text shown).
- Usability feedback as a prioritized list: each item = what happened, why it's a problem for this user, and a specific suggested fix. Separate "must fix" from "nice to have". Include anything confusing in wording, trust in the numbers, layout/thumb reach, visual issues seen in screenshots, accessibility.
- What worked well (briefly).
- List the screenshot paths you took.

## Report

## First-run check: Last Cup (live Vercel build, 390x844, local time 2:44–2:52am Bangkok)

### What I did, as the nurse
It's 2:44am and I've just finished a Red Bull. I open the app and the first screen asks "When are you sleeping next?" with **09:00 AM already filled in** and the line "That's 9:00 today, in 6 h 16 min." That is my sleep time, so I tap the big amber "Next: what are you drinking?" button. It takes me to the Now screen: a large "0 mg still in you at your 9:00 sleep", a flat chart, and six chips under "Just had something?". I tap **Red Bull (+34 at sleep)**. The hero changes to **34 mg** and the line under it reads "Under 50 mg by 6:08, before you sleep." The curve jumps up and decays past the dashed 50 mg line. A toast says "Logged Red Bull. Undo", and the list shows "2:45 Red Bull 80 mg, 80 left". **That's 2 taps from a cold start to my answer**, about 10 seconds. I checked the maths: 80 × 0.5^(6.25/5) ≈ 34, and it drops under 50 at about 6:08. The number is correct. What I still don't know is whether the app assumed an 8.4 oz can (80 mg) or the 12 oz I actually drank.

For the café coffee I tap "Other…" and get a "Log a drink" form. Tired, I type "180mg large" in Caffeine and leave Drink blank. Both fields turn coral. Under Drink: "Name it so it shows up as a chip next time, e.g. 'Night coffee'." Under Caffeine: "Enter the caffeine in mg, it's on the can." What I typed is kept, and focus jumps to the first bad field. Next I try "1800" (one zero too many) and get "That's more than any single drink we know. Check the mg, or log it as two drinks." That catches my mistake. With "Cafe large coffee" and 180, it logs and sends me back to Now. The hero turns coral: **110 mg** with "Over your 50 mg line at sleep. Clear by 14:40, 5 h 40 min after your sleep time." That's correct, and it's the answer I needed: this will wreck my sleep. My coffee is now the first chip.

Next shift (all saved times moved back 22 h): the app opens on Sleep with a card reading "Welcome back. Last shift: 2 drinks, 110 mg at your 11:00 sleep." (11:00 only because a 22 h shift turns 9:00 into 11:00.) I tap "Same time: 11:00 today" and I'm back on Now. It shows **4 mg** left from yesterday, both drinks in "Last 24 hours" ("4:48 Red Bull 80 mg, 4 left"; "4:48 Cafe large coffee 180 mg, 8 left"), and my custom coffee chip is still there. **It remembered me, and coming back takes 1 tap.**

Note on the test setup, not an app bug: on my first attempt the coffee seemed to vanish when I came back. I traced it to the driver killing Chrome right after the write, before localStorage reached disk. With a 15 s wait before exit, it saved correctly every time.

### Must fix
1. **The chips never show the dose (80 mg, 160 mg, 95 mg).** Only "+34 at sleep" is visible. The mg is in the accessible name ("Log Red Bull, 80 mg…") but sighted users can't see it, and the size is never shown. A nurse with a 12 oz (114 mg) or 16 oz Red Bull gets a wrong answer and has no way to notice. *Fix:* show "Red Bull 8.4 oz · 80 mg" on the chip, or at least in the toast ("Logged Red Bull, 80 mg (8.4 oz)"). Better still, offer size variants under Other.
2. **The total in me right now is never shown.** After both drinks I have about 260 mg on board, which is useful to me as a nurse (am I near 400 mg?). But the chart has no y-axis values above the 50 mg line and the hero only covers sleep time. *Fix:* add a small "260 mg in you now · 260 of 400 mg today" line, or label the peak or the now dot.
3. **The "now" dot sits off the curve.** After the Red Bull it's at the baseline while the curve spikes to 80 (r1/03-after-redbull.png). After the coffee it's halfway up the vertical jump, near 50 mg (r1/07-after-coffee-full.png). It reads as though I'm at 0 or 50 mg now. *Fix:* put the dot at the post-dose value. Treat a dose logged at "now" as already in, so the step happens just before the dot.
4. **Coral chips are never explained.** Monster and Celsius are coral before I've had anything, and after one drink every chip turns coral. I can't tell whether it means "this drink alone" or "this plus what I've had". *Fix:* add a one-line legend above the chips ("Coral = would put you over 50 mg at sleep"). Or make the chip text say it: "+68 → over your line".
5. **A custom drink gets no "Logged / Undo" toast.** The Red Bull chip shows "Logged Red Bull. Undo"; logging the coffee from the form shows nothing, and the Now page doesn't confirm it. "Remove" also deletes straight away, with no confirm and no undo (tested in r3/11-remove.png). Remove is a plain text button at the right edge, right where a thumb lands. *Fix:* show the same toast with Undo after a form save and after Remove.
6. **The caffeine field could just accept "180mg large".** The error is good (inline, keeps my input), but it says "it's on the can" when I'm logging a café coffee, and it doesn't say the actual problem: numbers only. *Fix:* parse the leading number (180), or reword to "Just the number, e.g. 180. It's on the can or the café board."
7. **A drink name is required to log a one-off.** A tired user who unchecks "Add it to my one-tap drinks" shouldn't have to name anything. *Fix:* when the name is blank, use "Drink (180 mg)". Only require a name if the checkbox is on, and say so: "Give it a name to save it as a chip, or untick the box."
8. **The "Log drink" button is half hidden behind the bottom nav** on the form at 390x844, and fully hidden once error text pushes it down (r1/04-other.png, r1/05-error.png). It is the main action and it's under the tab bar. *Fix:* make the submit button sticky above the nav, or add bottom padding equal to the nav height.

### Nice to have
- **The "Last 24 hours" list has no day markers.** On my next shift it shows "4:48" while it's 2:49 now, and nothing tells me that was yesterday. Two drinks logged 2 min apart can also appear in the wrong order: the form's time defaults to the minute it opened, so the coffee got 2:48:00, before a Red Bull at 2:48:10. *Fix:* use "yesterday 4:48" or relative times, and sort by actual log time.
- **The caffeine field's placeholder "80" looks like a value that's already filled in** (r1/04-other.png). Use "e.g. 180" in muted text, or drop it, since the hint already mentions 80 mg.
- **The return screen offers "Same time: 11:00 today" and "Save sleep time" side by side.** The difference isn't obvious. Something like "Same as last time (11:00)" and "Use the time above" would help.
- **"When did you start it?" is ambiguous for coffee you sip over an hour.** A hint like "When you started drinking. Close enough is fine." would help.
- **The disclaimers only appear in Settings** ("guide, not medical advice", "absorption as instant"). Before trusting "Clear by 14:40", a user should see a small "Estimate · how?" link under the hero.
- **The first screen puts body text above the heading** ("See how much caffeine…" sits above "When are you sleeping next?"), and the visible heading duplicates a hidden one in the text order. Put the question first.
- **The "1" in the hero "110"** (Space Grotesk) looks like a detached stroke at a glance (r1/07). Check it's rendering correctly at that size.
- **Settings autosave with no feedback.** A brief "Saved" would reassure. The threshold validation itself is good: blank gives "Enter a number of mg between 0 and 400. 50 is a common starting point."
- **The focus ring on the "Now" tab is clipped** by the left and bottom edges of the screen (r2/10-tab10.png).
- **Adding a custom chip silently dropped Espresso** from the grid.

### What worked well
- 2 taps from a cold open to a correct, plainly worded answer. The sleep time defaulted to exactly my 9:00.
- The model maths checks out: 34 mg, 110 mg, under 50 by 6:08, clear by 14:40.
- "Clear by 14:40, 5 h 40 min after your sleep time" is the right way to say "over the line".
- Form errors sit under their own field, say what to do, keep what I typed, and move focus to the problem. The 1800 mg typo is caught.
- Coming back takes 1 tap; the summary card, drinks and custom chip all persist.
- Keyboard: every control is reachable in a sensible order (sleep link, 6 chips, Other, Remove buttons, nav) with a clear amber focus ring. Accessible names are excellent ("Log Monster, 160 mg. Adds 52 mg at your sleep, which puts you over…").
- Sleep times earlier than now roll to tomorrow ("2:30 tomorrow, in 23 h 38 min"). "Clear my data" asks for confirmation inline.
- The dark, warm palette suits 3am, and the tap targets are large.

### Screenshots (taken by the tester on the lab machine, not in this repo)
- r1/01-first.png, r1/01-first-full.png: first visit, Sleep step
- r1/02-drinks.png, r1/02-drinks-full.png: empty Now screen
- r1/03-after-redbull.png, r1/03b-after-redbull-5s.png: after the Red Bull (now dot at the baseline)
- r1/04-other.png, r1/04-other-full.png: Other form (submit button under the nav)
- r1/05-error.png, r1/05-error-full.png: "180mg large" and blank name errors
- r1/06-typo1800.png: 1800 mg sanity error
- r1/07-after-coffee.png, r1/07-after-coffee-full.png: 110 mg, coral, now dot halfway up the jump
- r1/08-return.png, r1/08-return-full.png: return run affected by the driver flush problem (ignore)
- r2/08-return.png: Welcome back card
- r2/09-return-now.png: Now on the next shift (4 mg)
- r2/10-tab1.png, r2/10-tab2.png, r2/10-tab4.png, r2/10-tab10.png, r2/10-tab13.png: keyboard focus pass
- r3/11-remove.png: after Remove (no undo)
- r3/12-settings.png, r3/12-settings-full.png: Settings
- r3/13-threshold-blank.png: threshold error
- r3/14-clear.png: Clear data confirmation
- r4/15-sleep-past.png: sleep time rolls to tomorrow
