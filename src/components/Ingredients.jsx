import Label from './Label.jsx'
import Note from './Note.jsx'
import Caption from './Caption.jsx'
import Checkbox from './Checkbox.jsx'
import IngredientRow from './IngredientRow.jsx'
import { ingredients, suggest, isPresent } from '../ingredients.js'
import './Ingredients.css'

// Ingredients: Zumthor's nine ingredients for one capture. A section that
// edits in place (pattern: edit by section).
//   Reading: only the ingredients that are part of this moment, each saying
//   how it got here (kept, added by you, suggested from your note).
//   Editing: all nine as a checklist, with the present ones ticked.
// The header holds the section's buttons (actions), so Save and Cancel
// appear exactly where Edit ingredients was.
//
// Props:
//   capture   – the capture, with its note and seconds of sound. When it has
//               an id, each ingredient's title links to its own screen, and
//               the way back leads to this moment.
//   decisions – { [ingredientId]: "kept" | "dismissed" }, saved per capture
//   editing   – true to show the checklist
//   checked   – while editing: { [ingredientId]: true or false }, the ticks
//   onCheck   – while editing: called with (ingredientId, true or false)
//   actions   – the buttons for the header: Edit ingredients, or Save and Cancel
function Ingredients({ capture, decisions = {}, editing = false, checked = {}, onCheck, actions }) {
  const evidence = suggest(capture)
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
                {evidence[ingredient.id] && <Note tone="soft">“{evidence[ingredient.id]}”</Note>}
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
              evidence={evidence[ingredient.id]}
              decision={decisions[ingredient.id]}
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
