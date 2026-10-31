import Note from './Note.jsx'
import Caption from './Caption.jsx'

// IngredientRow: one ingredient that's part of a capture, for reading.
// Shows its name, what it means, the words behind it (if any), and how it
// got here (its status). Which words and which status is worked out in
// src/ingredients.js (describe), so this row only draws them.
// Changing the set happens in the checklist (Edit ingredients), not here.
//
// Props:
//   ingredient – { name, description } from src/ingredients.js
//   text       – the words behind it, or null
//   quoted     – true for your own words (shown in quotation marks),
//                false for Loci's words (e.g. from the recording)
//   status     – e.g. "Kept.", "Added by you.", "Suggested from your note."
//   learnHref  – optional: where the ingredient's title and description lead,
//                e.g. its own screen. Without it, they are plain text.
function IngredientRow({ ingredient, text, quoted, status, learnHref }) {
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
      {/* Quotation marks only around your own words. */}
      {text && <Note tone="soft">{quoted ? `“${text}”` : text}</Note>}
      <Caption>{status}</Caption>
    </li>
  )
}

export default IngredientRow
