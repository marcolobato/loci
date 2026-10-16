// Pattern: offline first. Find and replay what you kept.
// Your real captures, newest first, each cooling with time (afterglow).
// Open it with ?moments in the address. Sample captures are NOT shown here:
// this screen is only for real ones.
import { useEffect, useState } from 'react'
import Label from './components/Label.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import CaptureRow from './components/CaptureRow.jsx'
import AudioClip from './components/AudioClip.jsx'
import Notice from './components/Notice.jsx'
import TextLink from './components/TextLink.jsx'
import TextButton from './components/TextButton.jsx'
import Backdrop from './components/Backdrop.jsx'
import granite from './assets/granite-dusk.webp'
import { listCaptures, audioUrl, deleteCapture } from './captureStore.js'

// "1 moment" or "3 moments".
const moments = (n) => (n === 1 ? '1 moment' : `${n} moments`)

function Moments() {
  // status: loading, ready or error. items: captures plus a playable link each.
  const [status, setStatus] = useState('loading')
  const [items, setItems] = useState([])
  // Delete: which card is asking "are you sure?", and a short line that
  // confirms what happened (screen readers read it out).
  const [confirmingId, setConfirmingId] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const [failedId, setFailedId] = useState(null)

  async function remove(item) {
    try {
      await deleteCapture(item.id)
      URL.revokeObjectURL(item.url) // free its player's memory
      setItems((current) => current.filter((other) => other.id !== item.id))
      setConfirmingId(null)
      setFailedId(null)
      setAnnouncement('Moment deleted.')
    } catch {
      setFailedId(item.id)
    }
  }

  useEffect(() => {
    // If the screen goes away before loading finishes, don't update it.
    let cancelled = false
    let links = []
    listCaptures()
      .then((captures) => {
        if (cancelled) return
        // Work out each capture's age once, when the list loads.
        const now = Date.now()
        const withLinks = captures.map((capture) => ({
          ...capture,
          url: audioUrl(capture),
          minutesAgo: (now - Date.parse(capture.capturedAt)) / 60000,
        }))
        links = withLinks.map((item) => item.url)
        setItems(withLinks)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    // Leaving the screen: free the memory the playable links use.
    return () => {
      cancelled = true
      links.forEach((link) => URL.revokeObjectURL(link))
    }
  }, [])

  return (
    // has-backdrop + Backdrop: the same granite as Capture, edge to edge, so
    // both screens feel like one place (and the bottom strip blends in).
    <main className="page stack-loose has-backdrop">
      <Backdrop image={granite} cover="screen" />

      <div className="stack-tight">
        <Label as="h1">Moments</Label>
        {status === 'ready' && items.length > 0 && (
          <Caption>{moments(items.length)} on this phone · newest first</Caption>
        )}
        <div>
          <TextLink href="?">Back to capture</TextLink>
        </div>
      </div>

      {/* role="status": screen readers hear when loading ends or fails. */}
      <div role="status">
        {status === 'loading' && <Note tone="soft">Opening your moments…</Note>}
        {status === 'error' && <Notice>Couldn’t open your moments. Reload the page to try again.</Notice>}
        {status === 'ready' && items.length === 0 && (
          <Note tone="soft">Nothing kept yet. Capture a moment and it will wait for you here.</Note>
        )}
        {announcement && items.length > 0 && <Caption>{announcement}</Caption>}
      </div>

      {status === 'ready' && items.length > 0 && (
        <ul className="list stack-tight">
          {items.map((item) => (
            <CaptureRow
              key={item.id}
              place={`${item.seconds} s of sound`}
              minutesAgo={item.minutesAgo}
            >
              <AudioClip src={item.url} label={`Play ${item.seconds} seconds of sound`} />

              {/* Delete asks first, in place: no pop-up, nothing lost by accident. */}
              {confirmingId === item.id ? (
                <div className="stack-tight">
                  <Note>Delete this moment? This can’t be undone.</Note>
                  {failedId === item.id && <Notice>Couldn’t delete it. Try again.</Notice>}
                  <div className="inline-group">
                    <TextButton tone="danger" onClick={() => remove(item)}>Delete</TextButton>
                    <TextButton onClick={() => { setConfirmingId(null); setFailedId(null) }}>Keep</TextButton>
                  </div>
                </div>
              ) : (
                <div>
                  <TextButton onClick={() => { setConfirmingId(item.id); setAnnouncement('') }}>Delete</TextButton>
                </div>
              )}
            </CaptureRow>
          ))}
        </ul>
      )}
    </main>
  )
}

export default Moments
