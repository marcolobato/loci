# CLAUDE.md

## What this is
Loci (ambient field notes) is a reference app. It records and plays back audio, photos, and text notes, and it shows how I design media capture and playback patterns. The subject is the atmosphere of a place, drawn from my reading of Zumthor and Pallasmaa.

It is a showcase, not a startup. I am the one person it serves, the data is mine or clearly marked as sample data, and every screen exists to show one pattern done well.

## Why a reference app
Material Design has a catalog app. Figma has demo apps. Each one exists to show how patterns work. This is mine. It lets me practice craft, show my decisions, and keep scope small.

## Studio and name
- **Seroestar** is the studio brand (Turnform). The Figma library "Seroestar System" is the studio design system.
- **The app** is a separate product name: Loci, with the subtitle "ambient field notes." Say it LOH-sigh.
- Do not use the studio name as the app name in code or UI.

## Who and what for
- **Person:** me, out in the world with a phone, wanting to capture how a place feels right now.
- **Job:** capture a photo, ten seconds of sound, and a short note. Find and replay them later.
- **Not for:** sharing, social feeds, accounts, or AI features.

## Pattern index
Each screen must name the pattern it shows. Keep this table current.

| Pattern | Screen | Status |
|---|---|---|
| Record audio (10 s) with clear state | Capture | planned |
| Take a photo | Capture | planned |
| Short text note | Capture | planned |
| Playback with scrubber | Replay | planned |
| The five states (ideal, empty, error, partial, loading) | All | planned |
| Offline first | App | planned |
| Type scale in use | All | planned |

One pattern per working session. New ideas go on the shelf (SHELF.md), not into the week.

## Real and sample
- Real: anything I capture on my phone.
- Sample: seeded data in `/data/sample.json`. Label it "Sample" in the UI.
- Nothing pretends to be real when it is not.

## Stack
- Vite + React, built as a PWA.
- Works offline. Opens on my phone through a link.
- No backend for now. Store captures in the browser (IndexedDB).

## Design tokens (source: Figma library "Seroestar System v1")
Fonts: Source Serif 4 for words, Source Code Pro for data.

| Style | Font | Size | Line height | Tracking |
|---|---|---|---|---|
| Title | Source Serif 4 | 25 | 130% | -1% |
| Heading | Source Serif 4 | 20 | 130% | 0 |
| Note | Source Serif 4 | 16 | 150% | 0 |
| Caption | Source Code Pro | 13 | 140% | +2% |

- Sizes come from one ratio, 1.25, rounded to whole numbers.
- Put all values in `src/tokens.css` as CSS variables. No raw sizes in components.
- Color is a placeholder: dusk background `#1B1A2E`, light text. Measure contrast and record the ratio before shipping.

## How we work
1. Plan first: list files, steps (smallest first), and what I will see after each step. Then stop and wait.
2. One step at a time. Stop after each.
3. Use short, plain English. Short sentences. Common words.
4. Ask one question at a time.
5. Say "people," not "users."
6. Nothing ships without a two-sentence why.
7. Cut on Thursday, never on Friday.

## Public repo note
Keep this repo free of private notes, interview names, and job-search details.
