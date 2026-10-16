// Hints: short invitations to play the space while Loci listens, so the
// ten seconds capture how the room answers, not just silence.
// After Zumthor's "The Sound of a Space": every room is an instrument.
// Written in our own words. Curated, not generated: edit freely.

// One of these appears, at random, when a recording starts.
export const hints = [
  'Tap the wall. Hear what it’s made of.',
  'Clap once. Listen to how the room answers.',
  'Take three slow steps.',
  'Stay still. Let the room speak.',
  'Listen for the farthest sound.',
  'Run a hand along a surface.',
  'Close a door, softly.',
]

// This one takes over if the room stays very quiet for 3 seconds.
export const quietHint = 'It’s quiet. Clap once and listen to the room answer.'

// Pick one hint at random.
export function pickHint() {
  return hints[Math.floor(Math.random() * hints.length)]
}
