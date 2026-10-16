// captureStore: keeps captures on this phone, in IndexedDB (the database
// every browser has built in). No account, no server, works offline.
// Pattern: offline first.
//
// A saved capture looks like:
//   { id, capturedAt, seconds, audio: { bytes, type }, place, note, photo }
// place and note are added after recording (empty until then);
// photo stays empty until that pattern is built.
//
// Functions (all return Promises, so use them with await):
//   saveCapture({ audio, seconds })  – keep a new capture; returns it
//   listCaptures()                   – every capture, newest first
//   countCaptures()                  – how many are kept
//   updateCapture(id, changes)       – change some fields, e.g. place and note
//   deleteCapture(id)                – remove one for good
//   askToKeepStorage()               – ask the browser not to erase our data
//   audioUrl(capture)                – a playable link for a capture's sound

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

export async function saveCapture({ audio, seconds }) {
  // Older iPhones can't store sound files directly, so store the raw bytes
  // plus their format, and rebuild the file when reading. Works everywhere.
  const capture = {
    id: crypto.randomUUID(),
    capturedAt: new Date().toISOString(),
    seconds,
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
