// Tests for the brightness math in src/photo.js. Run them with: npm test
// brightnessOf takes pixels as a canvas gives them: red, green, blue, alpha,
// repeated. These tests build tiny pixel lists by hand.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { brightnessOf } from '../src/photo.js'

// n pixels of one color.
const pixels = (r, g, b, n = 4) => new Uint8ClampedArray(Array.from({ length: n }, () => [r, g, b, 255]).flat())

test('black is 0 and white is 1', () => {
  assert.equal(brightnessOf(pixels(0, 0, 0)), 0)
  assert.ok(Math.abs(brightnessOf(pixels(255, 255, 255)) - 1) < 1e-9)
})

test('green looks brighter than red, and red brighter than blue', () => {
  const green = brightnessOf(pixels(0, 255, 0))
  const red = brightnessOf(pixels(255, 0, 0))
  const blue = brightnessOf(pixels(0, 0, 255))
  assert.ok(green > red && red > blue)
})

test('half black, half white averages to the middle', () => {
  const mixed = new Uint8ClampedArray([...pixels(0, 0, 0, 2), ...pixels(255, 255, 255, 2)])
  assert.ok(Math.abs(brightnessOf(mixed) - 0.5) < 1e-9)
})

test('no pixels gives 0, not an error', () => {
  assert.equal(brightnessOf(new Uint8ClampedArray([])), 0)
})
