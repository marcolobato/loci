import './CloseButton.css'
import Icon from './Icon.jsx'

// CloseButton: an X you tap to leave a screen. It is a link underneath
// (it goes somewhere), drawn as an icon. The tap area is 48px even though
// the X itself is smaller.
//
// Props:
//   href  – where it goes (default "?", which is Capture)
//   label – the name screen readers read out (default "Close"). An icon has
//           no words of its own, so this is required for it to make sense.
function CloseButton({ href = '?', label = 'Close' }) {
  return (
    <a className="close-button" href={href} aria-label={label}>
      <Icon name="close" />
    </a>
  )
}

export default CloseButton
