# First-run check, round 2: PhD student (19 October 2026)

A second fresh subagent used the live URL after the round-1 fixes and the first strict review. It had a different persona, a different time of day and a different timezone. It didn't see the code or the README. Below are its prompt and its report, unedited except where noted. What changed as a result is in the README under [First-run check](../../README.md#first-run-check).

Screenshots it took: [first screen](round2/01-first.png) · [first useful answer](round2/10-after-1pm.png) · [an error partly hidden by the button](round2/09-err-future.png) · [coming back](round2/22-comeback.png)

## Prompt

You are doing a usability "first-run check" of a deployed web app as a brand-new user. Do NOT read the app's source code or README. Use only the live URL: https://design-ship-build-homework-3.vercel.app

Persona and goal: You're Priya, a 4th-year PhD student. It's 3:30 PM, you're writing your thesis, and you usually sleep around 1:00 AM but it varies. You've had a large cold brew (about 200 mg, not a preset; type it in a tired way) at 1 PM and you want another coffee now. Goal: "Find out whether a coffee now will still be in me at 1 AM, log what I've actually had today, and see if I'm going to be OK." Then pretend to come back the next afternoon (and later a few days later) and use it again.

*(Instructions for running the headless Chrome driver on the lab machine are left out here: host name, login and paths. The driver is [`scripts/drive.mjs`](../../scripts/drive.mjs). It could set the timezone, tap, type, press Tab and Enter, read the page and take screenshots. To simulate coming back later, the tester could move the saved times back by N hours and had to say so.)* Also try the main form with a deliberate mistake or two, try keyboard-only for a bit (Tab/Enter), and look at one desktop-size run (1440 900).

Report (≤700 words): 1) What happened, step by step, with the actual numbers/text you saw and how many taps/seconds to the first useful answer. 2) Usability feedback, ranked most important first, each concrete (what you saw, why it's a problem, a suggested fix). Include small things. Be honest and critical; don't pad with praise. 3) What worked well (brief). 4) List screenshot file paths for: first screen, first useful answer, a form error, the coming-back screen.

## Report

**Setup notes.** The real clock read 4:11 AM Chicago. I emulated the Asia/Dhaka timezone so the local time was about 3:11 PM, close to the persona's 3:30 PM. For "next afternoon" I shifted every timestamp in `localStorage['lastcup:v1']` back 24 h, and for "a few days later" back another 72 h. I patched only my copy of the driver, in two ways. First, it now closes Chrome cleanly; killing it lost localStorage writes between runs, which was a harness problem, not an app bug. Second, Enter now sends a real keyDown. Nothing else was edited.

**1) What happened**
- **First screen (/sleep):** "When are you sleeping next?" with a time field defaulting to 11:00 PM (it showed 9:00 AM when the clock said 4 AM). I typed 01:00, it read "That's 1:00 AM tomorrow, in 9 h 48 min." Then I tapped "Next: what are you drinking?"
- **Now (/):** "0 mg still in you at your 1:00 AM tomorrow sleep." The Coffee chip read "95 mg +24 at sleep". That is a partial answer after about 3 taps and 15 s, but it ignores the cold brew.
- **Logging the cold brew:** I tapped Other… and typed "cold brew lg" and "200mg". It was accepted as 200, but I didn't change the time, so it was logged at 3:13 PM (52 mg, coral). The only fix was to Remove it and re-log with the time set to 1:00 PM. After that: "38 mg … Under 50 mg by 10:55 PM, before you sleep." Coffee read "+25 at sleep" and was coral, so the real answer to "coffee now?" was "it puts you over". That took about 12–14 taps and roughly 60–90 s.
- **Logging the coffee:** "62 mg … Over your 50 mg line at sleep. Clear by 2:32 AM, 1 h 32 min after your sleep time." The list read "Last 24 hours: 295 mg drunk, 241 mg in you now."
- **Form errors:**
  - Empty: "Enter the caffeine in mg, like 180…"
  - "two hundred": "Enter the caffeine as a number of mg…"
  - 2000: "That's more than any single drink we know. Check the mg, or log it as two drinks."
  - 11 PM start time: "That time hasn't happened yet…"
  - In every case what I typed was kept.
- **Next afternoon:** "Welcome back. Last shift: 2 drinks, and 62 mg still in you when you slept at 1:00 AM." Two buttons: "Same as last time: 1:00 AM tomorrow" and "Use the time above". Now then showed "2 mg … Nothing logged yet."
- **Days later:** "Over your 50 mg line at 2 of your last 2 sleeps", with bars Fri 62 and Sat 54.

**2) Usability feedback (most important first)**
1. **Logging a past drink is easy to get wrong and hard to fix.** The time defaults to now, the field sits below the fold, and a logged drink can only be Removed, not edited. One-tap chips always log at "now", so the daily 1 PM cold brew can't be backfilled with a chip. Fix: add "Edit time" on logged rows and quick buttons on the form ("Now / 1 h ago / 2 h ago / earlier…").
2. **No "is one more OK?" answer.** She has to read the coral legend and add 38 + 25 herself. Fix: on each chip show the total, e.g. "→ 63 at sleep", and add a line such as "A coffee is fine after 6:40 PM… no, before X" or "Your last cup for a 1 AM sleep: by 2:10 PM".
3. **Persona copy.** "Last shift" makes no sense for a PhD student. Use "Yesterday" or "Last time".
4. **Numbers contradict each other:**
   - Welcome card says "52 mg … Saturday" while the bar for Saturday says 54.
   - Now says "2 mg still in you" next to "Nothing logged yet."
   - "200 mg drunk, 209 mg in you now" (in-you is higher than drunk because of yesterday's leftovers).
   - Monster chip shows "+41" but its aria-label says "Adds 42 mg".
   - Fix: use one rounding and one window, and say "including 9 mg from yesterday".
5. **"Clear by 2:32 AM" really means under 50 mg.** Other screens say "Under 50 mg by 10:55 PM". Use one phrase, "under your 50 mg line by…".
6. **History assumes you slept at the planned time.** Nothing asks when she actually slept. Add "Slept at 1:00? Change" on the welcome card.
7. **Sticky Log button hides content.** On the phone it covers the second line of the time error ("…Pick when you") and the "Add to one-tap drinks" checkbox. Scroll the error into view, or reserve space for the button.
8. **The welcome screen's two buttons do the same thing** when the field already matches last time. Show only one.
9. **Adding a custom drink silently drops Espresso** off the one-tap row. Say so, or let her choose which chip it replaces.
10. **Small things:**
    - The chart's x-axis only labels "now" and "sleep", so 1 PM isn't marked.
    - The "50 mg" label is crossed by the curve's rising edge.
    - After Undo, keyboard focus drops to `<body>`.
    - The Undo toast sits above the chips, so it takes Shift+Tab to reach it.
    - The 400 mg daily reference never appeared, even at 390 mg drunk.
    - On desktop the nav stays at the bottom and about half the screen is empty.

**3) What worked well**
- The question order (sleep, then drink, then hero number) is clear.
- Error text is specific, kept what I typed, and was lenient with "200mg".
- Keyboard: every control had a visible amber focus ring, Tab order was logical, and Enter logs a chip.
- Undo is offered and works.
- The hero number and curve read at a glance.
- The welcome-back history is a nice touch.

**4) Screenshots:** linked at the top of this page.
