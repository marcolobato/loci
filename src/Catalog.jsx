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
import Button from './components/Button.jsx'

// The four Button states for the "live" variant.
// previewState lets the catalog show focus and pressed without a keyboard or finger.
const buttonStates = [
  { name: 'Default' },
  { name: 'Focus', previewState: 'focus' },
  { name: 'Pressed', previewState: 'pressed' },
  { name: 'Disabled', disabled: true },
]

function Catalog() {
  return (
    <main className="page stack-loose">
      <Label as="h1">Loci · Component catalog · Sample</Label>

      {/* Button */}
      <section className="stack-loose">
        <Label as="h2">Button</Label>
        {buttonStates.map((state) => (
          <div key={state.name} className="stack-tight">
            <Caption>live · {state.name}</Caption>
            <Button
              variant="live"
              icon="record"
              label={`Record (${state.name} sample)`}
              disabled={state.disabled}
              previewState={state.previewState}
            />
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
