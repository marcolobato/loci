// Pattern: component catalog.
// Shows every component in src/components/ with each variant and state.
// Open it by adding ?catalog to the address, e.g. http://localhost:5173/?catalog
//
// Spacing: each group (a variant name + its sample) is a tight stack (8px).
// Groups, and the sections that hold them, are loose stacks (32px).
import { useState } from 'react'
import Label from './components/Label.jsx'
import Note from './components/Note.jsx'
import Field from './components/Field.jsx'
import Ingredients from './components/Ingredients.jsx'
import Photo from './components/Photo.jsx'
import Sheet from './components/Sheet.jsx'
import Heading from './components/Heading.jsx'
import TextButton from './components/TextButton.jsx'
import PhotoPicker from './components/PhotoPicker.jsx'
import Caption from './components/Caption.jsx'
import Icon from './components/Icon.jsx'
import Notice from './components/Notice.jsx'
import UpdateBanner from './components/UpdateBanner.jsx'
import Shutter from './components/Shutter.jsx'
import Backdrop from './components/Backdrop.jsx'
import Moment from './components/Moment.jsx'
import CaptureRow from './components/CaptureRow.jsx'
import granite from './assets/granite-dusk.webp'
import { afterglow } from './afterglow.js'
// Sample captures (placeholders), one per afterglow step.
import sample from '../data/sample.json'

// Recent samples store "minutesAgo". Older ones store "daysAgo" and a clock
// "time", so each keeps a realistic hour of day. Turn those into minutesAgo
// too, so every component below gets the same kind of number.
const now = new Date()
const captures = sample.captures.map((capture) => {
  if (capture.minutesAgo !== undefined) return capture
  const [hours, minutes] = capture.time.split(':').map(Number)
  // new Date() handles going back across months, e.g. Oct 3 minus 5 days.
  const capturedAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - capture.daysAgo, hours, minutes)
  return { ...capture, minutesAgo: (now - capturedAt) / (60 * 1000) }
})

// The four Shutter states.
// previewState lets the catalog show focus and pressed without a keyboard or finger.
const shutterStates = [
  { name: 'Default' },
  { name: 'Focus', previewState: 'focus' },
  { name: 'Pressed', previewState: 'pressed' },
  { name: 'Disabled', disabled: true },
]

// A sample capture with a note, for the Ingredients panel. Choices are kept
// only while the catalog is open.
const sampleNote = 'Rain falling through the oculus. The stone is cold under my hand. Light moves across the floor. The dome feels vast, and I want to linger.'
function SampleIngredients() {
  const [decisions, setDecisions] = useState({})
  return (
    <Ingredients
      capture={{ note: sampleNote, seconds: 10 }}
      decisions={decisions}
      onDecide={(id, decision) =>
        setDecisions((current) => {
          const next = { ...current }
          if (decision) next[id] = decision
          else delete next[id]
          return next
        })
      }
    />
  )
}

// A sample sheet: opens from a button, closes with Done (or Escape).
function SampleSheet() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div>
        <TextButton onClick={() => setOpen(true)}>Open a sample sheet</TextButton>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} label="Sample sheet">
        <div className="stack-normal">
          <Note tone="soft">A sheet slides up over the screen. The screen behind can’t be tapped until it closes.</Note>
          <div className="sheet__actions">
            <TextButton onClick={() => setOpen(false)}>Done</TextButton>
          </div>
        </div>
      </Sheet>
    </>
  )
}

// The two Field samples keep their own text, so typing in the catalog works.
function SampleFields() {
  const [place, setPlace] = useState('')
  const [note, setNote] = useState('')
  return (
    <>
      <div className="stack-tight">
        <Caption>one line</Caption>
        <Field label="Where are you?" value={place} onChange={setPlace} placeholder="A street, a room, a ruin" />
      </div>
      <div className="stack-tight">
        <Caption>multiline, with a hint</Caption>
        <Field
          label="What does it feel like?"
          multiline
          value={note}
          onChange={setNote}
          placeholder="Light, sound, temperature, what's close to you"
          hint="Tip: tap the microphone on the keyboard to say it instead."
        />
      </div>
    </>
  )
}

function Catalog() {
  return (
    <main className="page stack-loose">
      <Label as="h1">Loci · Component catalog · Sample</Label>

      {/* CaptureRow: the five sample captures as a list, newest first. */}
      <section className="stack-loose">
        <Label as="h2">CaptureRow</Label>
        <div className="stack-tight">
          <Caption>sample captures · cooling with time</Caption>
          <ul className="list stack-tight">
            {captures.map((capture) => (
              <CaptureRow
                key={capture.id}
                place={capture.place}
                mood={capture.mood}
                minutesAgo={capture.minutesAgo}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Moment: one per afterglow step, from the sample captures. */}
      <section className="stack-loose">
        <Label as="h2">Moment</Label>
        {captures.map((capture) => {
          const { step, label } = afterglow(capture.minutesAgo)
          return (
            <div key={capture.id} className="stack-tight">
              <Caption>{step} · {label}</Caption>
              <Moment minutesAgo={capture.minutesAgo}>{capture.mood}</Moment>
            </div>
          )
        })}
      </section>

      {/* Shutter: both sizes, each in all four states. */}
      <section className="stack-loose">
        <Label as="h2">Shutter</Label>
        {['large', 'inline'].map((size) =>
          shutterStates.map((state) => (
            <div key={`${size}-${state.name}`} className="stack-tight">
              <Caption>{size} · {state.name}</Caption>
              <Shutter
                size={size}
                label={`Shutter (${size}, ${state.name} sample)`}
                disabled={state.disabled}
                previewState={state.previewState}
              />
            </div>
          ))
        )}
        {/* Recording: the arc fills over 10 s (it plays once when the page
            opens); the disc size shows quiet vs loud. */}
        {[['quiet', 0.1], ['loud', 0.9]].map(([name, level]) => (
          <div key={name} className="stack-tight">
            <Caption>large · Recording · {name}</Caption>
            <Shutter size="large" label={`Shutter (recording, ${name} sample)`} recording level={level} />
          </div>
        ))}
      </section>

      {/* Label */}
      <section className="stack-loose">
        <Label as="h2">Label</Label>
        <div className="stack-tight">
          <Caption>as p (default)</Caption>
          <Label>Loci · ambient field notes</Label>
        </div>
        <div className="stack-tight">
          <Caption>as h1 on a screen: same look, different meaning</Caption>
          <Label>Loci</Label>
        </div>
      </section>

      {/* Note */}
      <section className="stack-loose">
        <Label as="h2">Note</Label>
        <div className="stack-tight">
          <Caption>tone · default</Caption>
          <Note>The wall has been here for a century. The light on it, four minutes.</Note>
        </div>
        <div className="stack-tight">
          <Caption>tone · soft</Caption>
          <Note tone="soft">Nothing kept yet. Your first moment starts here.</Note>
        </div>
      </section>

      {/* Caption */}
      <section className="stack-loose">
        <Label as="h2">Caption</Label>
        <div className="stack-tight">
          <Caption>default</Caption>
          <Caption>6:42 PM · 41.38° N · wind 14 km/h</Caption>
        </div>
      </section>

      {/* Backdrop: shown inside a small box; on a screen it fills the whole screen. */}
      <section className="stack-loose">
        <Label as="h2">Backdrop</Label>
        <div className="stack-tight">
          <Caption>granite · 80% scrim</Caption>
          <div className="card-inset has-backdrop">
            <Backdrop image={granite} />
            <Note tone="soft">Nothing kept yet. Your first moment starts here.</Note>
          </div>
        </div>
      </section>

      {/* Ingredients: suggested from a sample note. Keep / Not this work here
          but aren't saved. Tap the line to open all nine. */}
      <section className="stack-loose">
        <Label as="h2">Ingredients</Label>
        <div className="stack-tight">
          <Caption>sample note · Pantheon, Rome</Caption>
          <SampleIngredients />
        </div>
      </section>

      {/* Heading: titles for screens and sections. */}
      <section className="stack-loose">
        <Label as="h2">Heading</Label>
        <div className="stack-tight">
          <Caption>size · title</Caption>
          <Heading size="title" as="p">Ambient field notes</Heading>
        </div>
        <div className="stack-tight">
          <Caption>size · heading (default)</Caption>
          <Heading as="p">The nine ingredients</Heading>
        </div>
      </section>

      {/* Sheet: the bottom sheet Capture uses while capturing. */}
      <section className="stack-loose">
        <Label as="h2">Sheet</Label>
        <SampleSheet />
      </section>

      {/* Photo and PhotoPicker. The sample photo is the granite texture
          (AI-generated), not a real capture. The picker opens but saves nothing. */}
      <section className="stack-loose">
        <Label as="h2">Photo</Label>
        <div className="stack-tight">
          <Caption>4:3 · sample image</Caption>
          <Photo src={granite} alt="Sample: granite texture" />
        </div>
        <div className="stack-tight">
          <Caption>PhotoPicker</Caption>
          <div>
            <PhotoPicker label="Add a photo" onPick={() => {}} />
          </div>
        </div>
      </section>

      {/* Field: one line (place) and several lines (note). Typing works here. */}
      <section className="stack-loose">
        <Label as="h2">Field</Label>
        <SampleFields />
      </section>

      {/* UpdateBanner: normally floats at the top of the screen; here it
          floats inside a preview frame instead. Buttons do nothing in the catalog. */}
      <section className="stack-loose">
        <Label as="h2">UpdateBanner</Label>
        <div className="stack-tight">
          <Caption>new version ready</Caption>
          <div className="preview-frame">
            <UpdateBanner onReload={() => {}} onDismiss={() => {}} />
          </div>
        </div>
      </section>

      {/* Notice: error messages. Words in text color, icon in ember. */}
      <section className="stack-loose">
        <Label as="h2">Notice</Label>
        <div className="stack-tight">
          <Caption>with a hint</Caption>
          <Notice hint="On iPhone: tap the page menu in the address bar, then Website Settings, then Microphone.">
            Loci can’t hear the room. Allow the microphone, then tap to try again.
          </Notice>
        </div>
        <div className="stack-tight">
          <Caption>without a hint</Caption>
          <Notice>Something stopped the recording. Tap to try again.</Notice>
        </div>
      </section>

      {/* Icon */}
      <section className="stack-loose">
        <Label as="h2">Icon</Label>
        <div className="stack-tight">
          <Caption>record</Caption>
          <Icon name="record" />
        </div>
        <div className="stack-tight">
          <Caption>warning</Caption>
          <Icon name="warning" />
        </div>
      </section>
    </main>
  )
}

export default Catalog
