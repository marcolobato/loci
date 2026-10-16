// Pattern: record audio (10 s) with clear state.
// Tap the Shutter: it asks for the microphone, records 10 seconds and stops
// by itself. Tap again to stop early. The middle line always says what is
// happening. The recording isn't saved yet; a reload clears it.
import Label from './components/Label.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import Shutter from './components/Shutter.jsx'
import Backdrop from './components/Backdrop.jsx'
import AudioClip from './components/AudioClip.jsx'
import Notice from './components/Notice.jsx'
import granite from './assets/granite-dusk.webp'
import { useRecorder } from './useRecorder.js'

// What the middle line says in each state.
function messageFor(status, recordedSeconds) {
  if (status === 'asking') return 'Allow the microphone to listen.'
  if (status === 'recording') return 'Listening…'
  if (status === 'done') return `Recorded ${recordedSeconds} s. Tap to record again.`
  return 'Nothing kept yet. Your first moment starts here.'
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

function Capture() {
  const { status, error, secondsLeft, recordedSeconds, audioUrl, start, stop } = useRecorder()
  const isRecording = status === 'recording'

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
          ) : (
            <Note tone="soft">{messageFor(status, recordedSeconds)}</Note>
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
        onClick={isRecording ? stop : start}
      />
    </main>
  )
}

export default Capture
