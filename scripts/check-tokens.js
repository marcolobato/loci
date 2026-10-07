// check:tokens — fails if src/ has a raw hex color or px value outside tokens.css.
// Run it with: npm run check:tokens
//
// Comments are skipped, so a note like "/* 16px */" next to a token is fine.
// Only real code is checked.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const folder = 'src'
const allowed = 'src/tokens.css'             // the one file where raw values live
const fileTypes = ['.js', '.jsx', '.css']    // text files only (skips images)

const hexColor = /#[0-9a-fA-F]{3,8}\b/       // e.g. #17353B or #fff
const pxValue = /\b\d*\.?\d+px\b/            // e.g. 16px or 0.5px

// Replace comments with blank space, keeping the line breaks,
// so line numbers in the report still match the file.
function removeComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, '$1')      // "//" comments, but not "https://"
}

// List every file under a folder, including subfolders.
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? listFiles(path) : [path]
  })
}

const problems = []

for (const file of listFiles(folder)) {
  if (file === allowed) continue
  if (!fileTypes.some((type) => file.endsWith(type))) continue

  const lines = removeComments(readFileSync(file, 'utf8')).split('\n')
  lines.forEach((line, i) => {
    // Check for both kinds, so one line can report a color and a size.
    for (const pattern of [hexColor, pxValue]) {
      const found = line.match(pattern)
      if (found) problems.push(`${file}:${i + 1}  ${found[0]}  →  use a token from tokens.css`)
    }
  })
}

if (problems.length > 0) {
  console.log(`✗ Found ${problems.length} raw value(s):\n`)
  problems.forEach((problem) => console.log('  ' + problem))
  process.exit(1)                            // a non-zero exit means "failed"
}

console.log('✓ No raw hex colors or px values in src/ (outside tokens.css).')
