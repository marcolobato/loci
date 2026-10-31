// Tests for the ingredient rules in src/ingredients.js.
// Run them with: npm test
// They use Node's built-in test runner (node:test), so nothing is installed.
// Each test gives a rule a small sample moment and says what must come back.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { suggest, describe, startChecklist, startWords, choicesFrom } from '../src/ingredients.js'

const pantheon = {
  note: 'Rain falling through the oculus. The stone is cold under my hand. The dome feels vast, and I want to linger.',
  seconds: 10,
}

// ---------- Where suggestions come from ----------

test('a sentence from the note suggests an ingredient, marked as from the note', () => {
  assert.deepEqual(suggest(pantheon).material, { text: 'The stone is cold under my hand.', from: 'note' })
})

test('nothing in the note means no suggestion', () => {
  assert.equal(suggest(pantheon).objects, null)
})

test('your note comes first: Sound uses the note sentence when there is one', () => {
  assert.equal(suggest(pantheon).sound.from, 'note')
})

test('with no sound words, an old moment (no loudness measured) still gets Sound from its recording', () => {
  const quietNote = { note: 'The stone is cold.', seconds: 10 }
  assert.deepEqual(suggest(quietNote).sound, { text: '10 seconds of sound, recorded here.', from: 'recording' })
})

// ---------- Sound, from how loud the recording was ----------

test('a very quiet recording suggests Sound, from the recording', () => {
  const capture = { note: 'The stone is cold.', seconds: 10, loudness: 0.08 }
  assert.deepEqual(suggest(capture).sound, { text: 'The recording is very quiet.', from: 'recording' })
})

test('a loud recording suggests Sound, from the recording', () => {
  const capture = { note: 'The stone is cold.', seconds: 10, loudness: 0.7 }
  assert.deepEqual(suggest(capture).sound, { text: 'The recording is loud.', from: 'recording' })
})

test('an ordinary room suggests nothing: only clear measurements count', () => {
  const capture = { note: 'The stone is cold.', seconds: 10, loudness: 0.3 }
  assert.equal(suggest(capture).sound, null)
})

test('your note still comes first, even when the recording was quiet', () => {
  const capture = { ...pantheon, loudness: 0.05 }
  assert.equal(suggest(capture).sound.from, 'note')
})

// ---------- Light, from how bright the photo is ----------

const noLightWords = { note: 'The stone is cold.', seconds: 10 }

test('a very bright photo suggests Light, from the photo, not quoted', () => {
  const capture = { ...noLightWords, brightness: 0.85 }
  assert.deepEqual(suggest(capture).light, { text: 'The photo is very bright.', from: 'photo' })
  assert.deepEqual(describe(capture, 'light'), { text: 'The photo is very bright.', quoted: false, status: 'Suggested from your photo.' })
})

test('a very dark photo suggests Light', () => {
  assert.equal(suggest({ ...noLightWords, brightness: 0.1 }).light.text, 'The photo is very dark.')
})

test('an ordinary photo, or one with no brightness measured, suggests nothing', () => {
  assert.equal(suggest({ ...noLightWords, brightness: 0.5 }).light, null)
  assert.equal(suggest(noLightWords).light, null)
})

test('your note still comes first over the photo', () => {
  const capture = { note: 'Light moves across the floor.', brightness: 0.9 }
  assert.equal(suggest(capture).light.from, 'note')
})

// ---------- What a row shows when reading ----------

test('an untouched suggestion says where it came from, in quotation marks', () => {
  assert.deepEqual(describe(pantheon, 'material'), {
    text: 'The stone is cold under my hand.',
    quoted: true,
    status: 'Suggested from your note.',
  })
})

test('a suggestion from the recording is not quoted: those are Loci’s words', () => {
  const capture = { note: 'The stone is cold.', seconds: 10 }
  assert.deepEqual(describe(capture, 'sound'), {
    text: '10 seconds of sound, recorded here.',
    quoted: false,
    status: 'Suggested from your recording.',
  })
})

test('a kept suggestion says Kept.', () => {
  const capture = { ...pantheon, ingredients: { material: 'kept' } }
  assert.equal(describe(capture, 'material').status, 'Kept.')
})

test('a kept ingredient with nothing behind it says Added by you.', () => {
  const capture = { ...pantheon, ingredients: { objects: 'kept' } }
  assert.deepEqual(describe(capture, 'objects'), { text: null, quoted: false, status: 'Added by you.' })
})

test('your own words come first, in quotation marks, as In your words.', () => {
  const capture = { ...pantheon, ingredients: { objects: 'kept' }, ingredientWords: { objects: 'A bench worn smooth by visitors.' } }
  assert.deepEqual(describe(capture, 'objects'), { text: 'A bench worn smooth by visitors.', quoted: true, status: 'In your words.' })
})

// ---------- Word matching ----------

test('"hotel" and "heater" are not temperature; "hot" and "heat" are', () => {
  assert.equal(suggest({ note: 'The hotel lobby has a heater by the door.' }).temperature, null)
  assert.equal(suggest({ note: 'It is hot in here.' }).temperature?.from, 'note')
  assert.equal(suggest({ note: 'The heat rises from the floor.' }).temperature?.from, 'note')
})

// ---------- The checklist and Save ----------

test('the checklist starts with present ingredients ticked and dismissed ones unticked', () => {
  const capture = { ...pantheon, ingredients: { temperature: 'dismissed' } }
  const checked = startChecklist(capture)
  assert.equal(checked.material, true)
  assert.equal(checked.temperature, false)
  assert.equal(checked.objects, false)
})

test('each field starts with your words, else Loci’s sentence, else empty', () => {
  const capture = { ...pantheon, ingredientWords: { sound: 'Drops echo in the dome.' } }
  const words = startWords(capture)
  assert.equal(words.sound, 'Drops echo in the dome.')
  assert.equal(words.material, 'The stone is cold under my hand.')
  assert.equal(words.objects, '')
})

test('Save with nothing changed stores nothing: suggestions stay suggestions', () => {
  const choices = choicesFrom(pantheon, startChecklist(pantheon), startWords(pantheon))
  assert.deepEqual(choices, { ingredients: {}, ingredientWords: {} })
})

test('ticking on keeps it; ticking off a suggestion dismisses it', () => {
  const checked = { ...startChecklist(pantheon), objects: true, material: false }
  assert.deepEqual(choicesFrom(pantheon, checked, startWords(pantheon)).ingredients, { objects: 'kept', material: 'dismissed' })
})

// ---------- Your words: the case that started this ----------
// Temperature picked up a sentence that was really about objects. Untick
// Temperature, tick Surrounding Objects, and say why in your own words.

test('moving a sentence: untick one ingredient, tick another, write your words', () => {
  const checked = { ...startChecklist(pantheon), temperature: false, objects: true }
  const words = { ...startWords(pantheon), objects: '  A bench worn smooth by visitors.  ' }
  const choices = choicesFrom(pantheon, checked, words)
  assert.equal(choices.ingredients.temperature, 'dismissed')
  assert.equal(choices.ingredients.objects, 'kept')
  assert.equal(choices.ingredientWords.objects, 'A bench worn smooth by visitors.', 'trimmed')
  assert.equal(describe({ ...pantheon, ...choices }, 'objects').status, 'In your words.')
})

test('rewriting a suggestion’s words keeps it, in your words', () => {
  const words = { ...startWords(pantheon), material: 'Travertine, pale and cold.' }
  const choices = choicesFrom(pantheon, startChecklist(pantheon), words)
  assert.equal(choices.ingredients.material, 'kept')
  assert.equal(choices.ingredientWords.material, 'Travertine, pale and cold.')
})

test('validation: empty words, or Loci’s sentence left as it was, are not stored as yours', () => {
  const checked = { ...startChecklist(pantheon), objects: true }
  const words = { ...startWords(pantheon), objects: '   ' }
  const choices = choicesFrom(pantheon, checked, words)
  assert.deepEqual(choices.ingredientWords, {})
  assert.equal(describe({ ...pantheon, ...choices }, 'objects').status, 'Added by you.')
})

test('unticking an ingredient drops its words', () => {
  const capture = { ...pantheon, ingredients: { objects: 'kept' }, ingredientWords: { objects: 'A bench.' } }
  const checked = { ...startChecklist(capture), objects: false }
  const choices = choicesFrom(capture, checked, startWords(capture))
  assert.equal(choices.ingredientWords.objects, undefined)
  assert.equal(choices.ingredients.objects, undefined)
})
