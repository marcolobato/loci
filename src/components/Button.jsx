import Icon from './Icon.jsx'
import './Button.css'

// Button: anything a person taps to act.
//
// Props:
//   variant      – the look. "live" is the only one so far: the mint capture
//                  button. Mint means live, so use it only for capture/record.
//   label        – the button's name, read by screen readers. Required,
//                  because an icon-only button has no visible words.
//   icon         – name of an Icon to show inside (e.g. "record").
//   disabled     – true when the button can't be used right now.
//   onClick      – what happens on tap. Optional for now.
//   previewState – catalog only. Shows "focus" or "pressed" without a real
//                  keyboard or finger, so the catalog can show every state.
//                  Screens never pass this.
//
// States: default, focus (keyboard), pressed (finger down), disabled.
// They are drawn in Button.css.
function Button({ variant = 'live', label, icon, disabled = false, onClick, previewState }) {
  // Build the class list, e.g. "button button--live is-pressed".
  let className = `button button--${variant}`
  if (previewState) className += ` is-${previewState}`

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <Icon name={icon} />}
    </button>
  )
}

export default Button
