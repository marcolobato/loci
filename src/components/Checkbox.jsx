import { useId } from 'react'
import './Checkbox.css'

// Checkbox: a box you tick, with its name beside it. Tapping the box or the
// name ticks it. The row is at least 48px tall.
// Under the drawing is a real <input type="checkbox">, hidden from the eye
// only, so keyboards and screen readers know what it is and whether it's
// ticked ("Thresholds, checkbox, checked").
//
// Props:
//   label    – the name, e.g. "Thresholds"
//   checked  – true when ticked
//   onChange – called with true or false when tapped
//   children – optional lines under the name (what it means, why it's
//              suggested). Screen readers read them after the name.
function Checkbox({ label, checked, onChange, children }) {
  // useId links the extra lines to the checkbox, like Field does with its hint.
  const id = useId()
  const moreId = `${id}-more`

  return (
    <div className="checkbox">
      <label className="checkbox__row">
        <input
          type="checkbox"
          className="visually-hidden checkbox__input"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-describedby={children ? moreId : undefined}
        />
        {/* The box you see, drawn in a 24 x 24 box like Icon. aria-hidden:
            the real checkbox above already tells screen readers. */}
        <svg className="checkbox__box" viewBox="0 0 24 24" aria-hidden="true">
          <rect className="checkbox__frame" x="1" y="1" width="22" height="22" strokeWidth="2" />
          <path className="checkbox__tick" d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="type-note checkbox__label">{label}</span>
      </label>
      {children && <div id={moreId} className="checkbox__more stack-tight">{children}</div>}
    </div>
  )
}

export default Checkbox
