import { useState } from 'react'
import Caption from './Caption.jsx'
import IngredientRow from './IngredientRow.jsx'
import { ingredients, suggest } from '../ingredients.js'
import './Ingredients.css'

// Ingredients: Zumthor's nine ingredients for one capture, with
// progressive disclosure. Closed, it's one line: which ingredients are
// present, and how many of nine. Open, it shows all nine rows.
// Uses <details>, the browser's own open/close, so it works with
// keyboards and screen readers without extra code.
//
// Props:
//   capture   – the capture, with its note and seconds of sound. When it has
//               an id, each row links to that ingredient's screen, and the
//               way back leads to this moment.
//   decisions – { [ingredientId]: "kept" | "dismissed" }, saved per capture
//   onDecide  – called with (ingredientId, decision) to save a change
function Ingredients({ capture, decisions = {}, onDecide }) {
  const [open, setOpen] = useState(false)
  const evidence = suggest(capture)

  // Present = has evidence and wasn't dismissed.
  const present = ingredients.filter((i) => evidence[i.id] && decisions[i.id] !== 'dismissed')
  const names = present.map((i) => i.short).join(', ')

  return (
    <details className="ingredients" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="ingredients__summary">
        <span className="type-label">Ingredients</span>
        <Caption>
          {present.length > 0 ? `${names} · ${present.length} of 9` : 'None found yet · 0 of 9'}
          {' · '}
          {open ? 'Hide' : 'Show all nine'}
        </Caption>
      </summary>
      <ul className="list stack-normal ingredients__list">
        {ingredients.map((ingredient) => (
          <IngredientRow
            key={ingredient.id}
            ingredient={ingredient}
            evidence={evidence[ingredient.id]}
            decision={decisions[ingredient.id]}
            onDecide={(decision) => onDecide(ingredient.id, decision)}
            learnHref={capture.id ? `?ingredients=${ingredient.id}&from=${encodeURIComponent(capture.id)}` : undefined}
          />
        ))}
      </ul>
    </details>
  )
}

export default Ingredients
