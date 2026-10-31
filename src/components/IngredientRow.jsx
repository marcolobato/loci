import Note from './Note.jsx'
import Caption from './Caption.jsx'

// IngredientRow: one ingredient that's part of a capture, for reading.
// Shows its name, what it means, the sentence that suggested it (if any),
// and how it got here: kept, added by you, or suggested.
// Changing the set happens in the checklist (Edit ingredients), not here.
//
// Props:
//   ingredient – { name, description } from src/ingredients.js
//   evidence   – the sentence that suggested it, or null if nothing was found
//   decision   – "kept", or undefined (suggested, not decided yet)
//   fromRecording – true when the evidence is the recording, not a sentence
//                from the note (only Sound). It then isn't quoted as your words.
//   learnHref  – optional: where the ingredient's title and description lead,
//                e.g. its own screen. Without it, they are plain text.
function IngredientRow({ ingredient, evidence, decision, fromRecording = false, learnHref }) {
  // The name and what it means. With learnHref, they are one link: the name
  // is underlined in cold light (like every link), the description stays quiet.
  const heading = (
    <>
      <Note><span className="ingredient-row__name">{ingredient.name}</span></Note>
      <Caption>{ingredient.description}</Caption>
    </>
  )

  // How it got here. Kept with no sentence behind it means you added it.
  const suggested = fromRecording ? 'Suggested from your recording.' : 'Suggested from your note.'
  const status = decision === 'kept' ? (evidence ? 'Kept.' : 'Added by you.') : suggested

  return (
    <li className="ingredient-row stack-tight">
      {learnHref ? (
        <a className="ingredient-row__link" href={learnHref}>
          {heading}
        </a>
      ) : (
        <div>{heading}</div>
      )}
      {/* Quotation marks only around your own words. */}
      {evidence && <Note tone="soft">{fromRecording ? evidence : `“${evidence}”`}</Note>}
      <Caption>{status}</Caption>
    </li>
  )
}

export default IngredientRow
