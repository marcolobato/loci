// useMoments: your kept captures, newest first, ready to show.
// Pattern: offline first. Everything comes from the phone (captureStore.js).
//
// A screen calls it and gets back:
//   status  – "loading", "ready" or "error"
//   items   – captures, each with a playable sound link (url), a photo link
//             (photoLink, or null) and its age in minutes (minutesAgo)
//   reload()                         – read the list again, e.g. after a new capture
//   decide(item, ingredientId, d)    – keep / dismiss / undo an ingredient
//   remove(item)                     – delete a capture (throws if it fails)
import { useCallback, useEffect, useRef, useState } from 'react'
import { listCaptures, audioUrl, photoUrl, deleteCapture, updateCapture } from './captureStore.js'

export function useMoments() {
  const [status, setStatus] = useState('loading')
  const [items, setItems] = useState([])
  // The links the current list uses, so their memory can be freed later,
  // and a counter so an older, slower load can't overwrite a newer one.
  const linksRef = useRef([])
  const loadRef = useRef(0)

  const reload = useCallback(async () => {
    const thisLoad = ++loadRef.current
    try {
      const captures = await listCaptures()
      // Work out each capture's age once, when the list loads.
      const now = Date.now()
      const next = captures.map((capture) => ({
        ...capture,
        url: audioUrl(capture),
        photoLink: photoUrl(capture),
        minutesAgo: (now - Date.parse(capture.capturedAt)) / 60000,
      }))
      const nextLinks = next.flatMap((item) => [item.url, item.photoLink].filter(Boolean))
      if (thisLoad !== loadRef.current) {
        nextLinks.forEach((link) => URL.revokeObjectURL(link)) // a newer load won
        return
      }
      linksRef.current.forEach((link) => URL.revokeObjectURL(link)) // free the old list
      linksRef.current = nextLinks
      setItems(next)
      setStatus('ready')
    } catch {
      if (thisLoad === loadRef.current) setStatus('error')
    }
  }, [])

  // Load once when the screen opens; free every link when it goes away.
  useEffect(() => {
    // reload only sets state after the phone's database answers (after an
    // await), never straight away, so it doesn't cause a cascade of renders.
    // oxlint-disable-next-line react/set-state-in-effect
    reload()
    const loads = loadRef
    const links = linksRef
    return () => {
      loads.current++
      links.current.forEach((link) => URL.revokeObjectURL(link))
      links.current = []
    }
  }, [reload])

  // Keep or dismiss a suggested ingredient (or undo with no decision).
  // Shows straight away; saving happens in the background.
  async function decide(item, ingredientId, decision) {
    const decisions = { ...(item.ingredients || {}) }
    if (decision) decisions[ingredientId] = decision
    else delete decisions[ingredientId]
    setItems((current) => current.map((other) => (other.id === item.id ? { ...other, ingredients: decisions } : other)))
    await updateCapture(item.id, { ingredients: decisions })
  }

  // Delete for good, and free its links.
  async function remove(item) {
    await deleteCapture(item.id)
    URL.revokeObjectURL(item.url)
    if (item.photoLink) URL.revokeObjectURL(item.photoLink)
    linksRef.current = linksRef.current.filter((link) => link !== item.url && link !== item.photoLink)
    setItems((current) => current.filter((other) => other.id !== item.id))
  }

  return { status, items, reload, decide, remove }
}
