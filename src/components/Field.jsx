import { useId } from 'react'
import Caption from './Caption.jsx'
import './Field.css'

// Field: a labelled place to type. One line, or several (multiline).
// The iPhone keyboard's microphone button turns speech into text here,
// so a note can be spoken as well as typed.
//
// Props:
//   label       – what the field is for, e.g. "Where are you?"
//   value       – the current text
//   onChange    – called with the new text as the person types
//   multiline   – true for a few lines (a note), false for one (a place)
//   placeholder – optional faint example inside the empty field
//   hint        – optional help in small print under the field
function Field({ label, value, onChange, multiline = false, placeholder, hint }) {
  // useId links the label and the hint to the field, so screen readers
  // read "Where are you?, text field" and then the hint.
  const id = useId()
  const hintId = `${id}-hint`
  const Input = multiline ? 'textarea' : 'input'

  return (
    <div className="field stack-tight">
      <label className="type-label" htmlFor={id}>{label}</label>
      <Input
        id={id}
        className="field__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
        aria-describedby={hint ? hintId : undefined}
      />
      {hint && <div id={hintId}><Caption>{hint}</Caption></div>}
    </div>
  )
}

export default Field
