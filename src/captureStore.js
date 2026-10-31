// captureStore: keeps captures on this phone, in IndexedDB (the database
// every browser has built in). No account, no server, works offline.
// Pattern: offline first.
//
// A saved capture looks like:
//   { id, capturedAt, seconds, loudness, audio: { bytes, type }, place, note, photo }
// loudness: how loud the room was on average, 0 to 1 (null if not measured).
// place, note and photo are added after recording (empty until then).
// brightness: how bright the photo is, 0 to 1, saved with each photo.
// Added later, when you edit its ingredients (see src/ingredients.js):
//   ingredients     – { [ingredientId]: "kept" | "dismissed" }
//   ingredientWords – { [ingredientId]: your own words for it }
// Older captures simply don't have these fields; everything reads them as empty.
//
// Functions (all return Promises, so use them with await):
//   saveCapture({ audio, seconds, loudness }) – keep a new capture; returns it
//   listCaptures()                   – every capture, newest first
//   countCaptures()                  – how many are kept
//   updateCapture(id, changes)       – change some fields, e.g. place and note
//   deleteCapture(id)                – remove one for good
//   askToKeepStorage()               – ask the browser not to erase our data
//   audioUrl(capture)                – a playable link for a capture's sound
//   photoForStore(file)              – a photo file, ready to save with updateCapture
//   photoUrl(capture)                – a link to show a capture's photo (or null)

const DB_NAME = 'loci'
const DB_VERSION = 1
const STORE = 'captures'

// IndexedDB uses callbacks (onsuccess / onerror). This turns one request
// into a Promise, so the rest of the file can use await.
function done(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Open the database once and reuse it. The first time, create the store:
// a "table" of captures, found by id, with an index to sort by time.
let dbPromise = null
function openDb() {
  if (!dbPromise) {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, { keyPath: 'id' })
      store.createIndex('capturedAt', 'capturedAt')
    }
    dbPromise = done(request)
  }
  return dbPromise
}

// Get the captures store, ready to read ("readonly") or change ("readwrite").
async function captures(mode) {
  const db = await openDb()
  return db.transaction(STORE, mode).objectStore(STORE)
}

export async function saveCapture({ audio, seconds, loudness = null }) {
  // Older iPhones can't store sound files directly, so store the raw bytes
  // plus their format, and rebuild the file when reading. Works everywhere.
  const capture = {
    id: crypto.randomUUID(),
    capturedAt: new Date().toISOString(),
    seconds,
    loudness,
    audio: { bytes: await audio.arrayBuffer(), type: audio.type },
    place: '',
    note: '',
    photo: null,
  }
  await done((await captures('readwrite')).add(capture))
  return capture
}

export async function listCaptures() {
  const all = await done((await captures('readonly')).index('capturedAt').getAll())
  return all.reverse() // the index sorts oldest first; show newest first
}

export async function countCaptures() {
  return done((await captures('readonly')).count())
}

// Change some fields of a kept capture, e.g. add its place and note.
// changes: an object like { place: 'Pantheon, Rome', note: '…' }.
export async function updateCapture(id, changes) {
  const store = await captures('readwrite')
  const current = await done(store.get(id))
  if (!current) throw new Error('Capture not found')
  const updated = { ...current, ...changes }
  await done(store.put(updated))
  return updated
}

export async function deleteCapture(id) {
  await done((await captures('readwrite')).delete(id))
}

// Safari erases a website's data after 7 days without a visit, unless the
// site is on the Home Screen. Asking for "persistent" storage helps where
// the browser allows it. Returns true if the browser agreed.
export async function askToKeepStorage() {
  if (!navigator.storage?.persist) return false
  if (await navigator.storage.persisted()) return true
  return navigator.storage.persist()
}

// A playable link for a capture's sound. The caller should free it with
// URL.revokeObjectURL when done, like useRecorder does.
export function audioUrl(capture) {
  return URL.createObjectURL(new Blob([capture.audio.bytes], { type: capture.audio.type }))
}

// Turn a photo file into the shape we keep: raw bytes plus format,
// for the same reason as the sound (older iPhones can't store files).
export async function photoForStore(file) {
  return { bytes: await file.arrayBuffer(), type: file.type }
}

// A link to show a capture's photo, or null if it has none.
// Free it with URL.revokeObjectURL when done.
export function photoUrl(capture) {
  if (!capture.photo) return null
  return URL.createObjectURL(new Blob([capture.photo.bytes], { type: capture.photo.type }))
}
