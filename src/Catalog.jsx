// Pattern: component catalog.
// Shows every component in src/components/ with each variant and state.
// Open it by adding ?catalog to the address, e.g. http://localhost:5173/?catalog
//
// Spacing: each group (a variant name + its sample) is a tight stack (8px).
// Groups, and the sections that hold them, are loose stacks (32px).
import Label from './components/Label.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import Icon from './components/Icon.jsx'
import Shutter from './components/Shutter.jsx'
import Backdrop from './components/Backdrop.jsx'
import Moment from './components/Moment.jsx'
import CaptureRow from './components/CaptureRow.jsx'
import granite from './assets/granite-dusk.webp'
import { afterglow } from './afterglow.js'
// Sample captures (placeholders), one per afterglow step.
import sample from '../data/sample.json'

// The four Shutter states.
// previewState lets the catalog show focus and pressed without a keyboard or finger.
const shutterStates = [
  { name: 'Default' },
  { name: 'Focus', previewState: 'focus' },
  { name: 'Pressed', previewState: 'pressed' },
  { name: 'Disabled', disabled: true },
]

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
            {sample.captures.map((capture) => (
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
        {sample.captures.map((capture) => {
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
          <div className="page has-backdrop">
            <Backdrop image={granite} />
            <Note tone="soft">Nothing kept yet. Your first moment starts here.</Note>
          </div>
        </div>
      </section>

      {/* Icon */}
      <section className="stack-loose">
        <Label as="h2">Icon</Label>
        <div className="stack-tight">
          <Caption>record</Caption>
          <Icon name="record" />
        </div>
      </section>
    </main>
  )
}

export default Catalog
