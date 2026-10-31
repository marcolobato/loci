import Label from './Label.jsx'
import Note from './Note.jsx'
import Caption from './Caption.jsx'
import Checkbox from './Checkbox.jsx'
import IngredientRow from './IngredientRow.jsx'
import { ingredients, suggest, isPresent, describe } from '../ingredients.js'
import './Ingredients.css'

// Ingredients: Zumthor's nine ingredients for one capture. A section that
// edits in place (pattern: edit by section).
//   Reading: only the ingredients that are part of this moment, each saying
//   how it got here (see describe in src/ingredients.js).
//   Editing: all nine as a checklist, with the present ones ticked.
// The header holds the section's buttons (actions), so Save and Cancel
// appear exactly where Edit ingredients was.
//
// Props:
//   capture   – the capture: its note, seconds of sound, and saved choices
//               (capture.ingredients). When it has an id, each ingredient's
//               title links to its own screen, and the way back leads here.
//   editing   – true to show the checklist
//   checked   – while editing: { [ingredientId]: true or false }, the ticks
//   onCheck   – while editing: called with (ingredientId, true or false)
//   actions   – the buttons for the header: Edit ingredients, or Save and Cancel
function Ingredients({ capture, editing = false, checked = {}, onCheck, actions }) {
  const evidence = suggest(capture)
  const decisions = capture.ingredients || {}
  const present = ingredients.filter((i) => isPresent(evidence[i.id], decisions[i.id]))
  // The count follows the ticks while editing, so it changes as you tap.
  const count = editing ? ingredients.filter((i) => checked[i.id]).length : present.length

  return (
    <section className="stack-normal">
      <div className="stack-tight">
        <Label as="h2">Ingredients</Label>
        <Caption>{editing ? `Check what you felt here · ${count} of 9` : `${count} of 9`}</Caption>
        {actions}
      </div>

      {editing ? (
        // All nine. Names aren't links here: a tap ticks the box.
        <ul className="list stack-normal">
          {ingredients.map((ingredient) => (
            <li key={ingredient.id} className="ingredient-row">
              <Checkbox
                label={ingredient.name}
                checked={Boolean(checked[ingredient.id])}
                onChange={(value) => onCheck(ingredient.id, value)}
              >
                <Caption>{ingredient.description}</Caption>
                {/* Quotation marks only around your own words, not Loci's. */}
                {evidence[ingredient.id] && (
                  <Note tone="soft">
                    {evidence[ingredient.id].from === 'note' ? `“${evidence[ingredient.id].text}”` : evidence[ingredient.id].text}
                  </Note>
                )}
              </Checkbox>
            </li>
          ))}
        </ul>
      ) : present.length > 0 ? (
        <ul className="list stack-normal">
          {present.map((ingredient) => (
            <IngredientRow
              key={ingredient.id}
              ingredient={ingredient}
              {...describe(capture, ingredient.id)}
              learnHref={capture.id ? `?ingredients=${ingredient.id}&from=${encodeURIComponent(capture.id)}` : undefined}
            />
          ))}
        </ul>
      ) : (
        <Note tone="soft">None yet. Edit ingredients to check what you felt here.</Note>
      )}
    </section>
  )
}

export default Ingredients
