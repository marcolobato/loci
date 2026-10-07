// Pattern: record audio (10 s) with clear state. This is the default state only:
// nothing has been captured yet, and nothing is recording.
// The button does nothing yet.
import Label from './components/Label.jsx'
import Note from './components/Note.jsx'
import Button from './components/Button.jsx'

function Capture() {
  return (
    <main className="page stack-loose">
      {/* The app name, as the page's main heading. */}
      <Label as="h1">Loci</Label>

      {/* Empty state: tells people nothing is here yet, and where to start. */}
      <Note tone="soft">Nothing kept yet. Your first moment starts here.</Note>

      <Button variant="live" icon="record" label="Record" />
    </main>
  )
}

export default Capture
