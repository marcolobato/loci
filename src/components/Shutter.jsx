import './Shutter.css'

// Shutter: the live capture button. A ring, a gap the ground shows through,
// and a mint disc. Mint means live, so use it only to capture or record.
// Spec: design/shutter-afterglow.md
//
// Props:
//   size         – "large" (76px ring, Capture screen) or "inline" (44px ring).
//                  The tap area is never smaller than 48px, even for inline.
//   label        – the button's name, read by screen readers. Required:
//                  the Shutter has no visible words.
//   disabled     – true when it can't be used right now. Motion stops.
//   onClick      – what happens on tap. Optional for now.
//   previewState – catalog only: "focus" or "pressed", shown without a real
//                  keyboard or finger. Screens never pass this.
function Shutter({ size = 'large', label, disabled = false, onClick, previewState }) {
  // Build the class list, e.g. "shutter shutter--inline is-pressed".
  let className = `shutter shutter--${size}`
  if (previewState) className += ` is-${previewState}`

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {/* The ring and disc are drawing only; the button itself is the tap area. */}
      <span className="shutter__ring" aria-hidden="true">
        <span className="shutter__disc" />
      </span>
    </button>
  )
}

export default Shutter
