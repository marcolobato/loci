import Note from './Note.jsx'
import Caption from './Caption.jsx'
import TextButton from './TextButton.jsx'

// IngredientRow: one of the nine ingredients for one capture.
// Shows its name, what it means, and what Loci found in the note:
// a suggestion to keep or dismiss, a kept one, or nothing found.
//
// Props:
//   ingredient – { name, description } from src/ingredients.js
//   evidence   – the sentence that suggested it, or null if nothing was found
//   decision   – "kept", "dismissed", or undefined (not decided yet)
//   onDecide   – called with "kept", "dismissed" or undefined (undo)
//   learnHref  – optional: where the ingredient's title and description lead,
//                e.g. its own screen. Without it, they are plain text.
function IngredientRow({ ingredient, evidence, decision, onDecide, learnHref }) {
  // The name and what it means. With learnHref, they are one link: the name
  // is underlined in cold light (like every link), the description stays quiet.
  const heading = (
    <>
      <Note><span className="ingredient-row__name">{ingredient.name}</span></Note>
      <Caption>{ingredient.description}</Caption>
    </>
  )

  return (
    <li className="ingredient-row stack-tight">
      {learnHref ? (
        <a className="ingredient-row__link" href={learnHref}>
          {heading}
        </a>
      ) : (
        <div>{heading}</div>
      )}

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
    </li>
  )
}

export default IngredientRow
