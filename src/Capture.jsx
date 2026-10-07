// Pattern: record audio (10 s) with clear state. This is the default state only:
// nothing has been captured yet, and nothing is recording.
// The button does nothing yet.
import Label from './components/Label.jsx'
import Note from './components/Note.jsx'
import Shutter from './components/Shutter.jsx'
import Backdrop from './components/Backdrop.jsx'
import granite from './assets/granite-dusk.webp'

function Capture() {
  return (
    // screen-frame: label on top, empty state in the middle, button at the
    // bottom center. page: keeps all three inside the 16px inset.
    // has-backdrop: holds the granite texture behind everything.
    <main className="page screen-frame has-backdrop">
      {/* Behind: granite texture (AI-generated, decoration only) under a dark scrim. */}
      <Backdrop image={granite} />

      {/* Top: the app name, as the page's main heading. */}
      <Label as="h1">Loci</Label>

      {/* Middle: the empty state. Tells people nothing is here yet, and where to start. */}
      <Note tone="soft">Nothing kept yet. Your first moment starts here.</Note>

      {/* Bottom: the Shutter, where a thumb reaches. It pulses and breathes
          while idle (spec); recording will need its own signal (see SHELF.md). */}
      <Shutter size="large" label="Capture moment" />
    </main>
  )
}

export default Capture
