// The nine ingredients: the qualities Peter Zumthor names in Atmospheres
// (2006) as what makes the atmosphere of a place. Loci uses them to read a
// capture's note. The descriptions are our own words, not quotes.
//
// How suggestions work (no AI, works offline):
//   each ingredient has a short list of words. If a sentence in the note
//   uses one of them, Loci suggests that ingredient and shows the sentence
//   as evidence. The person keeps it or dismisses it.
// short is the one-word name used in the closed summary line.
// about is a longer explanation, in our own words, for the About screen.
// The word lists are a first draft: edit them freely. A word also matches
// longer forms that start with it ("echo" matches "echoes"). Add \\b after a
// word to match only that word ("hot\\b" matches "hot", not "hotel").

export const ingredients = [
  {
    id: 'body',
    short: 'Body',
    name: 'The Body of Architecture',
    description: 'What the body feels in this place: enclosure, exposure, posture.',
    about: "A building is a body before it is a picture: mass, surfaces and joints we sense with our own body. Notice whether the place holds you close or leaves you exposed.",
    words: ['body', 'mass', 'heavy', 'solid', 'enclos', 'exposed', 'posture', 'weight', 'bulk', 'massive'],
  },
  {
    id: 'material',
    short: 'Material',
    name: 'Material Compatibility',
    description: 'Materials present and how they sit together.',
    about: "Materials change each other when they meet: stone beside wood is not the same stone. Notice what things are made of, and how they sit together.",
    words: ['stone', 'wood', 'timber', 'concrete', 'brick', 'glass', 'metal', 'steel', 'iron', 'plaster', 'granite', 'marble', 'tar', 'rough', 'smooth', 'texture', 'birch'],
  },
  {
    id: 'sound',
    short: 'Sound',
    name: 'The Sound of a Space',
    description: 'Acoustics, tone, quietness, and ambient resonance.',
    about: "Every room plays the sounds made in it, like an instrument, and even a quiet room has a sound of its own. Loci’s ten seconds are for this one.",
    words: ['sound', 'echo', 'quiet', 'silen', 'hum', 'noise', 'voice', 'footstep', 'rain', 'wind', 'train', 'resonan', 'loud', 'bird', 'water', 'ring', 'hush'],
  },
  {
    id: 'temperature',
    short: 'Temperature',
    name: 'The Temperature of a Space',
    description: 'Thermal atmosphere: warmth, draught, stone chill, sun heat.',
    about: "Spaces have a temperature beyond the thermometer: the chill of stone, the warmth of wood, the heat stored in a sunny wall.",
    // "hot\\b" and "heat\\b" match the whole word only, so "hotel" and
    // "heater" (an object) don't count as temperature.
    words: ['warm', 'cold', 'cool', 'chill', 'damp', 'heat\\b', 'heated', 'hot\\b', 'draught', 'draft', 'humid', 'steam', 'breeze', 'frost'],
  },
  {
    id: 'objects',
    short: 'Objects',
    name: 'Surrounding Objects',
    description: 'Things and furnishings kept close to hand.',
    about: "The things kept close, like furniture, books and tools, tell you who lives in a place and how.",
    words: ['chair', 'table', 'book', 'object', 'thing', 'bench', 'lamp', 'cup', 'furniture', 'shelf', 'candle', 'pole'],
  },
  {
    id: 'composure',
    short: 'Composure',
    name: 'Between Composure and Seduction',
    description: 'Whether the place holds you still or leads you onward.',
    about: "Some places hold you still; others draw you along from one view to the next. Notice which this one does.",
    words: ['still', 'calm', 'linger', 'drawn', 'wander', 'lead', 'path', 'invit', 'rest', 'pause', 'stroll', 'corridor', 'follow'],
  },
  {
    id: 'threshold',
    short: 'Thresholds',
    name: 'Tension Between Inside and Outside',
    description: 'Thresholds, portals, frames, and boundaries.',
    about: "Architecture draws lines between inside and outside: doors, windows, edges. Notice what you can see out, and what can see in.",
    words: ['window', 'door', 'threshold', 'inside', 'outside', 'opening', 'frame', 'view', 'street', 'edge', 'entrance', 'gate', 'oculus'],
  },
  {
    id: 'intimacy',
    short: 'Intimacy',
    name: 'Levels of Intimacy',
    description: 'Scale and distance relative to the human body.',
    about: "Size, distance and weight, measured against your own body: whether a place feels close, vast, or just right.",
    words: ['small', 'large', 'vast', 'tiny', 'close', 'distan', 'far', 'scale', 'high', 'low', 'ceiling', 'narrow', 'wide', 'huge', 'intimate'],
  },
  {
    id: 'light',
    short: 'Light',
    name: 'The Light on Things',
    description: 'Shadows, illumination, luster, and reflections.',
    about: "How light falls on things, and where shadow gathers. Notice which surfaces catch it and which hold the dark.",
    words: ['light', 'shadow', 'glow', 'dark', 'bright', 'shine', 'shini', 'reflect', 'sun', 'dusk', 'dawn', 'gleam', 'lace'],
  },
]

// Split a note into sentences, at . ! ? or a new line.
function sentences(note) {
  return (note || '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// Does this sentence use one of the words? Words match at the start of a
// word only, so "rest" matches "resting" but not "forest".
function uses(sentence, words) {
  const pattern = new RegExp(`\\b(${words.join('|')})`, 'i')
  return pattern.test(sentence)
}

// Measurements only suggest when they are clear (a "confidence threshold"):
// anything in between suggests nothing. First guesses, to tune on a phone.
// Loudness is 0 (silent) to 1 (loud), averaged over the recording.
const QUIET = 0.15 // the same "very quiet" line as the recorder's quiet hint (useRecorder.js)
const LOUD = 0.5

// Sound, from the recording. Older captures have no loudness measured: they
// keep the plain "N seconds of sound" so nothing they showed disappears.
function soundFromRecording(capture) {
  if (!capture.seconds) return null
  if (typeof capture.loudness !== 'number') return `${capture.seconds} seconds of sound, recorded here.`
  if (capture.loudness < QUIET) return 'The recording is very quiet.'
  if (capture.loudness > LOUD) return 'The recording is loud.'
  return null
}

// For one capture: what Loci can suggest for each ingredient, and from where.
// Returns { [ingredientId]: { text, from } or null if nothing was found }.
//   text – the evidence: a sentence from the note, or Loci's own words
//   from – "note" or "recording": which source suggested it
// Your note comes first: a sentence of yours beats Loci's measurement.
export function suggest(capture) {
  const parts = sentences(capture.note)
  const found = {}
  for (const ingredient of ingredients) {
    const sentence = parts.find((s) => uses(s, ingredient.words))
    found[ingredient.id] = sentence ? { text: sentence, from: 'note' } : null
  }
  const heard = !found.sound && soundFromRecording(capture)
  if (heard) found.sound = { text: heard, from: 'recording' }
  return found
}

// Is this ingredient part of the moment? Yes if you kept it, or if Loci
// suggested it and you haven't said "not this".
export function isPresent(evidence, decision) {
  return decision === 'kept' || (Boolean(evidence) && decision !== 'dismissed')
}

// What one ingredient shows when reading a moment.
// Returns { text, quoted, status }:
//   text   – the words to show under it, or null
//   quoted – true for your own words (they get quotation marks), false for
//            Loci's (e.g. "10 seconds of sound, recorded here.")
//   status – how it got here, strongest first:
//            "In your words."   you wrote (or rewrote) its words
//            "Kept."            Loci suggested it, you chose it
//            "Added by you."    you ticked it, with no words behind it
//            "Suggested from your note." (or recording) – untouched
export function describe(capture, ingredientId) {
  const evidence = suggest(capture)[ingredientId]
  const decision = (capture.ingredients || {})[ingredientId]
  const yours = (capture.ingredientWords || {})[ingredientId]
  if (yours) return { text: yours, quoted: true, status: 'In your words.' }
  if (decision === 'kept') {
    if (!evidence) return { text: null, quoted: false, status: 'Added by you.' }
    return { text: evidence.text, quoted: evidence.from === 'note', status: 'Kept.' }
  }
  if (!evidence) return { text: null, quoted: false, status: null } // not part of the moment
  return { text: evidence.text, quoted: evidence.from === 'note', status: `Suggested from your ${evidence.from}.` }
}

// Edit ingredients: the checklist starts with every present ingredient ticked.
// Returns { [ingredientId]: true or false }.
export function startChecklist(capture) {
  const evidence = suggest(capture)
  const decisions = capture.ingredients || {}
  return Object.fromEntries(ingredients.map((i) => [i.id, isPresent(evidence[i.id], decisions[i.id])]))
}

// Edit ingredients: what each "In your words" field starts with.
// Your saved words if you wrote some, else Loci's sentence, else empty.
// Returns { [ingredientId]: text }.
export function startWords(capture) {
  const evidence = suggest(capture)
  const yours = capture.ingredientWords || {}
  return Object.fromEntries(ingredients.map((i) => [i.id, yours[i.id] ?? evidence[i.id]?.text ?? '']))
}

// Are these words really yours? Trimmed; empty counts as none; Loci's own
// sentence left as it was isn't yours either. Returns the words, or null.
function yourWords(text, evidence) {
  const trimmed = (text || '').trim()
  if (!trimmed || trimmed === evidence?.text) return null
  return trimmed
}

// Save: turn the ticks and the words into what's kept with the capture.
// Returns { ingredients, ingredientWords }, ready for updateCapture.
// Only rows you changed get a new choice, so "Kept." always means you did
// something: a suggestion left ticked, with its words untouched, stays
// "Suggested from your note."
//   ticked on, or your own words written → "kept"
//   not changed                           → whatever it was before
//   ticked off, suggested                 → "dismissed", so Loci stops suggesting it
//   ticked off, otherwise                 → nothing to keep
// Words are kept only for ticked rows.
export function choicesFrom(capture, checked, words = {}) {
  const evidence = suggest(capture)
  const decisions = capture.ingredients || {}
  const nextDecisions = {}
  const nextWords = {}
  for (const i of ingredients) {
    const before = isPresent(evidence[i.id], decisions[i.id])
    const after = Boolean(checked[i.id])
    const written = after ? yourWords(words[i.id], evidence[i.id]) : null
    if (written) nextWords[i.id] = written
    if (after && (!before || written)) {
      nextDecisions[i.id] = 'kept'
    } else if (after === before) {
      if (decisions[i.id]) nextDecisions[i.id] = decisions[i.id]
    } else if (evidence[i.id]) {
      nextDecisions[i.id] = 'dismissed'
    }
  }
  return { ingredients: nextDecisions, ingredientWords: nextWords }
}
