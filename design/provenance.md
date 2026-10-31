# Suggested, kept, added by you

A running note on one pattern in Loci: showing where each ingredient on a moment came from. Started 2026-10-31. Material for the Loci article in Field Notes and Experiments.

## The pattern

Loci reads my note and suggests some of Zumthor's nine ingredients. It uses simple word matching, not AI, but to me it behaves like an AI suggestion. Each ingredient on a moment says how it got there:

| Status | What happened | What I see |
|---|---|---|
| Suggested from your note. | Loci proposed it. I haven't touched it. | The sentence that matched, as a quote |
| Kept. | Loci proposed it. I chose it. | The quote stays |
| Added by you. | I ticked it myself. Nothing in my note matched. | No quote |
| (dismissed) | Loci proposed it. I unticked it. | Hidden, and never suggested again |

Editing is a checklist of all nine. Suggestions start ticked, to save taps.

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

## Still open

- Sound is suggested from the recording, not the note, but its label still says "Suggested from your note."
- Should Loci say plainly that it matches words, so I don't trust it more than it deserves? (Microsoft G2)
- Later, a photo or a recording might suggest an ingredient (brightness for Light, loudness for Sound). Each source may need its own label.
