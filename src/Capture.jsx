// Pattern: record audio (10 s) with clear state.
// Tap the Shutter: it asks for the microphone, records 10 seconds and stops
// by itself. Tap again to stop early. The middle line always says what is
// happening. The recording isn't saved yet; a reload clears it.
import Label from './components/Label.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import Shutter from './components/Shutter.jsx'
import Backdrop from './components/Backdrop.jsx'
import granite from './assets/granite-dusk.webp'
import { useRecorder } from './useRecorder.js'

// What the middle line says in each state.
function messageFor(status, recordedSeconds) {
  if (status === 'asking') return 'Allow the microphone to listen.'
  if (status === 'recording') return 'Listening…'
  if (status === 'done') return `Recorded ${recordedSeconds} s. Tap to record again.`
  if (status === 'error') return "Couldn't record. Try again."   // clearer messages come in step 5
  return 'Nothing kept yet. Your first moment starts here.'
}

function Capture() {
  const { status, secondsLeft, recordedSeconds, start, stop } = useRecorder()
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

      {/* Middle: what is happening now. */}
      <div className="stack-tight">
        {/* role="status": screen readers read this line out when it changes. */}
        <div role="status">
          <Note tone="soft">{messageFor(status, recordedSeconds)}</Note>
        </div>
        {/* The countdown is hidden from screen readers, so they don't hear
            a number every second. The line above already says "Listening". */}
        {isRecording && (
          <div aria-hidden="true">
            <Caption>0:{String(secondsLeft).padStart(2, '0')}</Caption>
          </div>
        )}
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
