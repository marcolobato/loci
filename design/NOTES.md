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

Over the granite texture (Capture screen), measured at the image's lightest pixel (#FFFFFF):
| Scrim | Background there | Label (#A9BEC0) | Note soft (#C9D6D8) | Live button (#A8E6CF) |
|---|---|---|---|---|
| none | #FFFFFF | 1.94 ✗ | 1.49 ✗ | 1.41 ✗ |
| 72% (card-on-texture) | #4F5A5F | 3.64 ✗ | 4.75 | 5.02 |
| **80% (screen-on-texture, used)** | **#3C484D** | **4.87** | **6.35** | **6.70** |

Text needs 4.5, the button needs 3. Blending is in sRGB, the way browsers draw it.

### Error color: ember
Loci had no error color. Ember is warm light pushed toward coral, so it belongs to the same scene but never reads as "a new moment" (which warm already means).

| Candidate | On brand | On card | Over brightest granite | Difference from warm (OKLab dE) |
|---|---|---|---|---|
| #F2A07E | 6.28 | 7.91 | 4.54 | 4.6, too close to warm |
| **#F0957A (chosen)** | **5.77** | **7.26** | **4.17** | **7.2** |
| #E98270 | 4.91 | 6.17 | 3.54 | 11.7, too dark on the texture |

- Rule: errors sit on stone or a card, never straight on the granite (4.17 there).
- Rule: never color alone. Always the warning icon and words.
- Light theme: #9E3A2C, 6.19 on paper, dE 6.7 from warm-on-paper.
- First drafted in the Paper sign-in exploration (not in Loci's scope); the Paper file was then updated by hand.

## Images
Originals live in `design/originals/` on this computer only (git ignores them). Optimized copies go in `src/assets/`.

| Copy | From original | Pixels | Size | Settings |
|---|---|---|---|---|
| `src/assets/granite-dusk.webp` | `lobato_A_photograph_of_a_rough_granite_textured_wall_at_dusk…_2.png` (816 × 1456, 2,296 KB) | 816 × 1456 | 188 KB | `cwebp -q 75 -m 6 -metadata none` |

- Not enlarged: the original is under the 1170 px limit, and enlarging adds weight, not detail.
- **Source: AI-generated.** This granite image was made with an image generator, not taken by me. It is a background texture only. It is not a capture and must never appear as one.

## Decided
1. **Background color.** `#17353B` replaces the dusk placeholder `#1B1A2E`.
2. **Off-scale sizes.** Core sizes 13, 16, 20, 25 follow the 1.25 ratio. Display 48, Moment 19 and Label 12 are named exceptions (reasons in CLAUDE.md).
3. **Gallery title.** Uses Title (25), not the 28 in the mockup.

## Open questions
1. **Afterglow over 40 captures.** The design asks if the ramp still reads or turns to mud. Untested.
