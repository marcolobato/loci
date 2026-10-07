# Design notes

Source: Claude Design project "Pairing Lab" (`Pairing Lab.dc.html`).
Read only. No HTML was copied into the app.

## What I took and why
- **Direction 4a** (Round 4). It is the latest round and the refined pick. Rounds 1 to 3 were explorations.
- **The Gallery screens** in Round 4 ("In the app"): splash, gallery (dark), capture (light).
- `support.js` is the design canvas runtime. It holds no colors or fonts, so nothing came from it.
- `tokens/fig-typography.css` is empty. `tokens/fig-tokens.css` was not read (not in the brief).

## The idea in one line
Ser is the stone and never changes. Estar is the light on it, and it fades with time.

## Color rules
- `stone.brand` #17353B is the constant. Pick everything else in relation to it.
- **Mint (`light.live`) means "live, right now."** Only the capture button and the recording state use it.
- **Afterglow = age.** A capture's accent color shows how old it is: warm (now) to blue (a month).
- On paper (light theme), use `light.warm-on-paper` #A5562A, not the bright warm.
- Keep the granite texture at 20% or less behind lists. Gallery rows sit on a 72% dark card.

## Type rules
- One serif in two postures, plus a mono:
  - Source Serif 4, upright = ser (titles, headings, notes)
  - Source Serif 4, italic = estar (the mood line)
  - Source Code Pro = data, time, captions, labels
- Light 300 gets thin below 32px. Use Regular 400 under 32px.

## Contrast (WCAG, measured)
On `stone.brand` #17353B: every text color passes AA (4.5). Lowest is `afterglow.month` at 4.90.
On `stone.paper` #F3F5F2: lowest is `warm-on-paper` at 4.83. Passes AA, not AAA.

## Decided
1. **Background color.** `#17353B` replaces the dusk placeholder `#1B1A2E`.
2. **Off-scale sizes.** Core sizes 13, 16, 20, 25 follow the 1.25 ratio. Display 48, Moment 19 and Label 12 are named exceptions (reasons in CLAUDE.md).
3. **Gallery title.** Uses Title (25), not the 28 in the mockup.

## Open questions
1. **Afterglow over 40 captures.** The design asks if the ramp still reads or turns to mud. Untested.
