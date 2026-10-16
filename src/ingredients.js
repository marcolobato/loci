// The nine ingredients: the qualities Peter Zumthor names in Atmospheres
// (2006) as what makes the atmosphere of a place. Loci uses them to read a
// capture's note. The descriptions are our own words, not quotes.
//
// How suggestions work (no AI, works offline):
//   each ingredient has a short list of words. If a sentence in the note
//   uses one of them, Loci suggests that ingredient and shows the sentence
//   as evidence. The person keeps it or dismisses it.
// short is the one-word name used in the closed summary line.
// The word lists are a first draft: edit them freely. A word also matches
// longer forms that start with it ("echo" matches "echoes").

export const ingredients = [
  {
    id: 'body',
    short: 'Body',
    name: 'The Body of Architecture',
    description: 'What the body feels in this place: enclosure, exposure, posture.',
    words: ['body', 'mass', 'heavy', 'solid', 'enclos', 'exposed', 'posture', 'weight', 'bulk', 'massive'],
  },
  {
    id: 'material',
    short: 'Material',
    name: 'Material Compatibility',
    description: 'Materials present and how they sit together.',
    words: ['stone', 'wood', 'timber', 'concrete', 'brick', 'glass', 'metal', 'steel', 'iron', 'plaster', 'granite', 'marble', 'tar', 'rough', 'smooth', 'texture', 'birch'],
  },
  {
    id: 'sound',
    short: 'Sound',
    name: 'The Sound of a Space',
    description: 'Acoustics, tone, quietness, and ambient resonance.',
    words: ['sound', 'echo', 'quiet', 'silen', 'hum', 'noise', 'voice', 'footstep', 'rain', 'wind', 'train', 'resonan', 'loud', 'bird', 'water', 'ring', 'hush'],
  },
  {
    id: 'temperature',
    short: 'Temperature',
    name: 'The Temperature of a Space',
    description: 'Thermal atmosphere: warmth, draught, stone chill, sun heat.',
    words: ['warm', 'cold', 'cool', 'chill', 'damp', 'heat', 'hot', 'draught', 'draft', 'humid', 'steam', 'breeze', 'frost'],
  },
  {
    id: 'objects',
    short: 'Objects',
    name: 'Surrounding Objects',
    description: 'Things and furnishings kept close to hand.',
    words: ['chair', 'table', 'book', 'object', 'thing', 'bench', 'lamp', 'cup', 'furniture', 'shelf', 'candle', 'pole'],
  },
  {
    id: 'composure',
    short: 'Composure',
    name: 'Between Composure and Seduction',
    description: 'Whether the place holds you still or leads you onward.',
    words: ['still', 'calm', 'linger', 'drawn', 'wander', 'lead', 'path', 'invit', 'rest', 'pause', 'stroll', 'corridor', 'follow'],
  },
  {
    id: 'threshold',
    short: 'Thresholds',
    name: 'Tension Between Inside and Outside',
    description: 'Thresholds, portals, frames, and boundaries.',
    words: ['window', 'door', 'threshold', 'inside', 'outside', 'opening', 'frame', 'view', 'street', 'edge', 'entrance', 'gate', 'oculus'],
  },
  {
    id: 'intimacy',
    short: 'Intimacy',
    name: 'Levels of Intimacy',
    description: 'Scale and distance relative to the human body.',
    words: ['small', 'large', 'vast', 'tiny', 'close', 'distan', 'far', 'scale', 'high', 'low', 'ceiling', 'narrow', 'wide', 'huge', 'intimate'],
  },
  {
    id: 'light',
    short: 'Light',
    name: 'The Light on Things',
    description: 'Shadows, illumination, luster, and reflections.',
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

// For one capture: what Loci can suggest for each ingredient.
// Returns { [ingredientId]: evidence text, or null if nothing was found }.
// A capture with sound always has evidence for "The Sound of a Space".
export function suggest(capture) {
  const parts = sentences(capture.note)
  const found = {}
  for (const ingredient of ingredients) {
    found[ingredient.id] = parts.find((s) => uses(s, ingredient.words)) ?? null
  }
  if (capture.seconds && !found.sound) found.sound = `${capture.seconds} seconds of sound, recorded here.`
  return found
}
