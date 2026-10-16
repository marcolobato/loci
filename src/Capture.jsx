// Pattern: record audio (10 s) with clear state, kept on the phone.
// Tap the Shutter: it asks for the microphone, records 10 seconds and stops
// by itself. Tap again to stop early. Each recording is kept automatically
// (IndexedDB, see captureStore.js). The middle line always says what is
// happening and how many moments are kept.
import { useEffect, useState } from 'react'
import Label from './components/Label.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import Shutter from './components/Shutter.jsx'
import Backdrop from './components/Backdrop.jsx'
import AudioClip from './components/AudioClip.jsx'
import Notice from './components/Notice.jsx'
import granite from './assets/granite-dusk.webp'
import { useRecorder } from './useRecorder.js'
import { saveCapture, countCaptures, askToKeepStorage } from './captureStore.js'

// "1 moment" or "3 moments".
const moments = (n) => (n === 1 ? '1 moment' : `${n} moments`)

// What the middle line says in each state.
// kept is null while the count is still loading, so we say nothing yet
// rather than flash "Nothing kept yet" at someone who has captures.
function messageFor(status, recordedSeconds, kept, saveState) {
  if (status === 'asking') return 'Allow the microphone to listen.'
  if (status === 'recording') return 'Listening…'
  if (status === 'done' && saveState === 'saving') return 'Keeping…'
  if (status === 'done') return `Kept ${recordedSeconds} s of sound. ${moments(kept)} on this phone.`
  if (kept === null) return ''
  if (kept === 0) return 'Nothing kept yet. Your first moment starts here.'
  return `${moments(kept)} kept on this phone. Tap to capture another.`
}

// When recording fails: what happened, what to do, and (if useful) where.
// Each one names a fix. None of them blame the person.
const errors = {
  blocked: {
    text: 'Loci can’t hear the room. Allow the microphone, then tap to try again.',
    hint: 'On iPhone: tap the page menu in the address bar, then Website Settings, then Microphone.',
  },
  'no-mic': {
    text: 'No microphone found. Connect one, or open Loci on your phone.',
  },
  unsupported: {
    text: 'This browser can’t record sound. Open Loci in an up-to-date Safari or Chrome.',
  },
  failed: {
    text: 'Something stopped the recording. Tap to try again.',
  },
}
const saveFailed = 'Couldn’t keep this recording. Your phone may be out of space. You can still play it below.'

function Capture() {
  // How many captures are kept (null until we've checked), and how the
  // latest save went: idle, saving, saved or failed.
  const [kept, setKept] = useState(null)
  const [saveState, setSaveState] = useState('idle')

  // Called once each time a recording finishes: keep it on the phone.
  async function keep(file, seconds) {
    setSaveState('saving')
    try {
      await saveCapture({ audio: file, seconds })
      setKept(await countCaptures())
      setSaveState('saved')
      askToKeepStorage().catch(() => {}) // a "no" here is fine; nothing to show
    } catch {
      setSaveState('failed')
    }
  }

  const { status, error, secondsLeft, recordedSeconds, audioUrl, start, stop } = useRecorder({ onRecorded: keep })
  const isRecording = status === 'recording'

  // On opening the screen: count what's already kept.
  useEffect(() => {
    countCaptures().then(setKept).catch(() => setKept(0))
  }, [])

  function record() {
    setSaveState('idle')
    start()
  }

  return (
    // screen-frame: label on top, message in the middle, button at the
    // bottom center. page: keeps all three inside the 16px inset.
    // has-backdrop: holds the granite texture behind everything.
    <main className="page screen-frame has-backdrop">
      {/* Behind: granite texture (AI-generated, decoration only) under a dark scrim. */}
      <Backdrop image={granite} />

      {/* Top: the app name, as the page's main heading. */}
      <Label as="h1">Loci</Label>

      {/* Middle: what is happening now. full-width so the player can stretch. */}
      <div className="stack-tight full-width">
        {/* role="status": screen readers read this line out when it changes. */}
        <div role="status">
          {status === 'error' ? (
            <Notice hint={errors[error]?.hint}>{(errors[error] ?? errors.failed).text}</Notice>
          ) : saveState === 'failed' ? (
            <Notice>{saveFailed}</Notice>
          ) : (
            <Note tone="soft">{messageFor(status, recordedSeconds, kept, saveState)}</Note>
          )}
        </div>
        {/* The countdown is hidden from screen readers, so they don't hear
            a number every second. The line above already says "Listening". */}
        {isRecording && (
          <div aria-hidden="true">
            <Caption>0:{String(secondsLeft).padStart(2, '0')}</Caption>
          </div>
        )}
        {/* When done: play back what was just recorded. */}
        {status === 'done' && audioUrl && <AudioClip src={audioUrl} label="Your recording" />}
      </div>

      {/* Bottom: the Shutter. Tap to record; tap again to stop early. */}
      <Shutter
        size="large"
        label={isRecording ? 'Stop recording' : 'Capture moment'}
        onClick={isRecording ? stop : record}
      />
    </main>
  )
}

export default Capture
