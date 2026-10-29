import Note from './Note.jsx'
import Caption from './Caption.jsx'
import TextButton from './TextButton.jsx'
import TextLink from './TextLink.jsx'

// IngredientRow: one of the nine ingredients for one capture.
// Shows its name, what it means, and what Loci found in the note:
// a suggestion to keep or dismiss, a kept one, or nothing found.
//
// Props:
//   ingredient – { name, description } from src/ingredients.js
//   evidence   – the sentence that suggested it, or null if nothing was found
//   decision   – "kept", "dismissed", or undefined (not decided yet)
//   onDecide   – called with "kept", "dismissed" or undefined (undo)
//   learnHref  – optional: where "What is this?" goes, e.g. the ingredient's
//                own screen. Without it, the link is left out.
function IngredientRow({ ingredient, evidence, decision, onDecide, learnHref }) {
  return (
    <li className="ingredient-row stack-tight">
      <div>
        <Note>{ingredient.name}</Note>
        <Caption>{ingredient.description}</Caption>
      </div>

      {!evidence && <Note tone="soft">No evidence observed.</Note>}

      {evidence && decision !== 'dismissed' && <Note tone="soft">“{evidence}”</Note>}

      {evidence && decision === undefined && (
        <div className="inline-group">
          <TextButton onClick={() => onDecide('kept')}>Keep</TextButton>
          <TextButton onClick={() => onDecide('dismissed')}>Not this</TextButton>
        </div>
      )}
      {evidence && decision === 'kept' && (
        <div className="inline-group">
          <Caption>Kept.</Caption>
          <TextButton onClick={() => onDecide(undefined)}>Undo</TextButton>
        </div>
      )}
      {evidence && decision === 'dismissed' && (
        <div className="inline-group">
          <Caption>Dismissed.</Caption>
          <TextButton onClick={() => onDecide(undefined)}>Undo</TextButton>
        </div>
      )}

      {/* The way into the ingredient's own screen: learn by doing, from the moment. */}
      {learnHref && (
        <div>
          <TextLink href={learnHref}>What is this?</TextLink>
        </div>
      )}
    </li>
  )
}

export default IngredientRow
