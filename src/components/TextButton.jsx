import './TextLink.css'
import './TextButton.css'

// TextButton: words you tap to DO something (TextLink is for GOING somewhere).
// Looks like a TextLink, but is a real <button>, so keyboards and screen
// readers treat it as an action. At least 48px tall.
//
// Props:
//   onClick  – what happens on tap
//   tone     – "default" (cold light) or "danger" (ember, for deleting).
//              Danger is always paired with clear words, never color alone.
//   children – the words, e.g. "Delete"
function TextButton({ onClick, tone = 'default', children }) {
  const className = tone === 'danger' ? 'text-link text-button text-button--danger' : 'text-link text-button'
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  )
}

export default TextButton
