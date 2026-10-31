// Tests for the ingredient rules in src/ingredients.js.
// Run them with: npm test
// They use Node's built-in test runner (node:test), so nothing is installed.
// Each test gives a rule a small sample moment and says what must come back.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { suggest, describe, startChecklist, decisionsFrom } from '../src/ingredients.js'

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

// ---------- The checklist and Save ----------

test('the checklist starts with present ingredients ticked and dismissed ones unticked', () => {
  const capture = { ...pantheon, ingredients: { temperature: 'dismissed' } }
  const checked = startChecklist(capture, capture.ingredients)
  assert.equal(checked.material, true)
  assert.equal(checked.temperature, false)
  assert.equal(checked.objects, false)
})

test('Save with nothing changed stores nothing: suggestions stay suggestions', () => {
  const checked = startChecklist(pantheon, {})
  assert.deepEqual(decisionsFrom(pantheon, {}, checked), {})
})

test('ticking on keeps it; ticking off a suggestion dismisses it', () => {
  const checked = { ...startChecklist(pantheon, {}), objects: true, material: false }
  assert.deepEqual(decisionsFrom(pantheon, {}, checked), { objects: 'kept', material: 'dismissed' })
})
