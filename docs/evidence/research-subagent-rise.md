# Research subagent: RISE (one of four)

One of the four research subagents the agent sent out on 16 October 2026, 7:34 PM Chicago time (brief step 3). The other three studied Timeshifter, caffeine trackers (Caffeine Clock, HiCoffee, HalfCup) and night-time visual design, and all four ran in parallel. Below are its prompt and its report, unedited. The summary and the decision are in [`research.md`](../../research.md).

## Prompt

Use WebSearch and WebFetch to study the app **Rise Science** (risescience.com, the sleep and energy app that shows a caffeine cutoff time and an "energy schedule" based on circadian rhythm). We are designing a small web tool: a caffeine and energy-drink tracker for shift workers (night-shift nurses, PhD students) that shows how much caffeine will still be in your body when you next sleep. It runs entirely in the browser with localStorage only.

Find out, with sources (URLs: App Store pages, the company's site, reviews, design teardowns, screenshots described in articles, Mobbin/Page Flows pages if reachable):
1. First-run / onboarding: the first screen, what it asks for (and how many steps), and how soon the user gets something useful.
2. How it presents caffeine cutoff and energy over time: chart type, wording, colours, light or dark, glanceable elements.
3. How it brings people back daily: notifications, streaks, a daily view.
4. Anything specific to shift workers or irregular sleep.
5. 3-5 concrete design patterns we should copy, and 1-2 to avoid, each with a reason.

Report in under 400 words. Mark clearly anything you could not verify from a source. Do not invent screenshots or features.

## Report

**RISE Science: design findings for a caffeine tracker for shift workers** (under 400 words)

**1. Onboarding.** The flow is long: Reteno's gallery tags it "30+ steps". In order, per the Screensdesign teardown video:
- a dark intro screen and a testimonial carousel
- a "How did you hear about us?" question
- a quiz on gender, age, student status, goals, sleep problems and energy boosters (caffeine is one option)
- a warm-up screen before each system permission prompt (motion, Apple Health, tracking, notifications)
- the earliest weekday wake time, which can be skipped
- a reveal of your sleep need (e.g. 8h 30m), sleep debt and energy schedule, at about 2:00 to 3:12 into the video
- a hard paywall (7-day trial), then email sign-up

So the first useful output comes after about 2 minutes, just before the paywall. Users say setup takes about 3 minutes (Product Hunt), call navigation "complex", and one subscribed by accident (mwm.ai).

**2. How energy and caffeine are shown.**
- **Chart:** a vertical, hour-by-hour timeline with a wavy circadian curve. Labels are Grogginess (about 90 min after waking), Morning peak, Afternoon dip, Evening peak, Wind-down and Melatonin Window.
- **Look:** dark background, purple buttons and gradient cards, purple gradient blocks for sleep.
- **Glanceable parts:** headline numbers ("6.3 hrs Sleep debt", "Energy potential %") and home-screen widgets showing the next peak or wind-down.
- **Caffeine:** the cutoff is a reminder sent 10 hours before that night's Melatonin Window, which the user can adjust. It is based on circadian timing, not on how much caffeine you drank. RISE's own blog describes half-life but does not link it to the cutoff. I found no caffeine-logging feature.

**3. Bringing people back daily.**
- The schedule is recalculated each morning from last night's sleep.
- Push notifications warn of upcoming peaks and dips. Habit reminders (caffeine, light, meals) are timed to the user's rhythm.
- Calendar sync and widgets.
- A habit streak tracker with 7-day progress (Screensdesign). **Not verified:** what streak notifications say.

**4. Shift workers.** RISE's help article on night shifts returned a 403, so this comes from a search snippet only. It says some features still work, but the Melatonin Window "may not be reliable" on rotating shifts. Users are limited to one weekday and one weekend wake goal and must change it by hand the night before. A sponsored first-responder piece claims it works for 24-hour shifts; that is marketing.

**5. Patterns.** Copy:
- **One cutoff time, shown in large type** ("Limit caffeine after 2:14 pm"), worked back from the next sleep. It's the single fact a tired user needs.
- **A vertical day timeline with named zones** (peak, dip, wind-down, sleep). It reads well on a phone held upright.
- **One headline number** ("~38 mg left at bedtime"), like their "sleep debt" figure, so the answer is readable at a glance.
- **Explain before asking.** RISE shows a screen saying why before each permission prompt; we can do the same before asking for a sleep time.
- **Dark theme by default.** It suits night-shift use.

Avoid:
- **The long quiz before any value.** For a localStorage-only tool, ask only "when do you next sleep?" and show the answer at once.
- **A fixed weekday/weekend wake goal.** It fails rotating shifts. Let users set each sleep block (including daytime sleep) and base the calculation on actual doses and half-life.

**Not verified:** exact notification copy, exact hex colours, whether there is a light mode, and any Mobbin listing (none found).

Sources: apps.apple.com/us/app/rise-sleep-tracker/id1453884781 · screensdesign.com/apps/rise-sleep-tracker/ · gallery.reteno.com/flows/app-screens-rise · risescience.com/blog/when-should-you-stop-drinking-coffee · risescience.com/blog/personal-energy-tracker · bustle.com/wellness/rise-sleep-tracking-app-review · mwm.ai/apps/rise-sleep-tracker/1453884781 · help.risescience.com/hc/en-us/articles/40672537872663 (snippet only) · producthunt.com/products/rise-science
