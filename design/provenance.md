# Suggested, kept, added by you

A running note on one pattern in Loci: showing where each ingredient on a moment came from. Started 2026-10-31. Material for the Loci article in Field Notes and Experiments.

## The pattern

Loci reads my note, my recording and my photo, and suggests some of Zumthor's nine ingredients. It uses simple rules, not AI: matching words, and two measurements. To me it still behaves like an AI suggestion. Each ingredient on a moment says how it got there, strongest first:

| Status | What happened | What I see |
|---|---|---|
| In your words. | I wrote, or rewrote, why it belongs. | My words, in quotation marks |
| Kept. | Loci proposed it. I chose it. | Loci's evidence stays |
| Added by you. | I ticked it myself and wrote nothing. | No words |
| Suggested from your note. | Loci matched a sentence. I haven't touched it. | The sentence, in quotation marks |
| Suggested from your recording. | The room was clearly quiet or loud. | Loci's words, no quotation marks |
| Suggested from your photo. | The photo was clearly bright or dark. | Loci's words, no quotation marks |
| (dismissed) | Loci proposed it. I unticked it. | Hidden, and never suggested again |

Editing is a checklist of all nine. Suggestions start ticked, to save taps. Each ticked row opens "In your words", filled with Loci's sentence when there is one.

## The question

How do I keep "Loci thought so" apart from "I said so" after I accept a suggestion? An accepted suggestion and a word I wrote myself are not the same evidence about a place.

## Decision 1: "Kept" must mean I did something

The first build turned every ticked row into "Kept" on Save. So "Kept" meant "I didn't untick it", not "I confirmed it". Research on defaults and automation bias says pre-selected answers get accepted more often, mistakes included.

Now Save only changes rows I changed. A suggestion I leave alone stays "Suggested from your note." "Kept" and "Added by you" only appear after a real tap.

The cost: there is no way to confirm a suggestion without touching it. To watch: do I miss that?

## Decision 2: the labels stay

Products disagree on what happens after you accept:

- **The mark goes away.** Gmail Smart Compose: accepted text looks like anything you typed.
- **The mark stays.** iA Writer Authorship: AI text stays dimmed until you rewrite it.
- **The mark lives in the data.** C2PA and IPTC store "machine-made", "machine-assisted" and "human" separately.

Loci keeps all three labels on screen. The difference between "Kept" and "Added by you" is the point of the pattern, so it should be visible.

## Named patterns this follows

- **Disclosure:** say what the machine did ("Suggested from your note."). [Shape of AI](https://www.shapeof.ai/patterns/disclosure)
- **Footprints:** keep a trace of where the machine took part. [Shape of AI](https://www.shapeof.ai/patterns/footprints)
- **Citations, direct quotation:** show the exact sentence that matched. [Shape of AI](https://www.shapeof.ai/patterns/citations); Apple calls this Attribution. [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/machine-learning)
- **Explain why (G11), efficient dismissal (G8), efficient correction (G9):** [Microsoft Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/haxtoolkit/library/)
- **Calibrate trust, give control:** [Google PAIR Guidebook](https://pair.withgoogle.com/chapter/explainability-trust/)
- **Opt-in keyword suggestions** (rule-based, like Loci): [Lightroom Classic](https://helpx.adobe.com/lightroom-classic/desktop/organize-photos-in-lightroom-classic/keywords.html)

On pre-selected answers: Johnson and Goldstein, "Do Defaults Save Lives?" (Science, 2003); Goddard and others on automation bias ([JAMIA, 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3240751)); Buçinca and others on making people think before accepting ([CSCW 2021](https://arxiv.org/pdf/2102.09692)).

## Decision 3: say which source, and quote only my words

Sound can be suggested by the recording itself, when nothing in my note matches. Its label used to say "Suggested from your note.", which was untrue. Now it says "Suggested from your recording.", and its evidence ("10 seconds of sound, recorded here.") has no quotation marks. Quotation marks mean "you said this". Loci's own words don't get them.

## Decision 4: I can correct the words, not just the ticks

Testing on my phone, The Temperature of a Space picked up a sentence that was really about the objects around me. I could untick Temperature and tick Surrounding Objects, but I couldn't say why. Accept or reject wasn't enough: I needed to correct.

Now each ticked row has a field, "In your words". It starts with Loci's sentence, so a small fix is quick, and it's empty for an ingredient Loci never suggested. What I write becomes the strongest status: "In your words." Microsoft calls this "support efficient correction" (G9).

Two rules keep the label honest:

- Loci's sentence left exactly as it was is still Loci's, so the row stays "Kept." or "Suggested". Only words I changed count as mine.
- Empty words count as no words. The row is then "Added by you."

The mismatch also had a plain cause. Loci matches the start of a word, so "heat" caught "heater", an object, and "hot" caught "hotel". Those two now match whole words only.

## Decision 5: three sources, and only clear measurements

The recording and the photo now suggest too. The recorder already measured loudness about 15 times a second to move the Shutter, so Loci keeps the average. A photo is shrunk to 32 × 32 and its pixels averaged for brightness. Nothing leaves the phone.

A measurement only suggests when it's clear. Apple calls this a confidence threshold: below it, offer nothing.

| Source | Suggests | When | Loci says |
|---|---|---|---|
| Recording | Sound | Average loudness under 0.15 | The recording is very quiet. |
| Recording | Sound | Over 0.5 | The recording is loud. |
| Photo | Light | Average brightness under 0.25 | The photo is very dark. |
| Photo | Light | Over 0.7 | The photo is very bright. |

My note always comes first. If I wrote about the light, my sentence is the evidence, not the photo's brightness.

The cost: an ordinary room no longer suggests Sound at all. Before, every recording did ("10 seconds of sound, recorded here."). Moments recorded before this change keep that line, so nothing they showed disappears.

The thresholds are first guesses. To watch: do they match what I hear and see?

## Still open

- Should Loci say plainly that it matches words and measures, so I don't trust it more than it deserves? (Microsoft G2)
- There's still no way to confirm a suggestion without touching it (Decision 1). Writing my own words now counts as touching it.
- Are the four thresholds right? Tune them on the phone.
