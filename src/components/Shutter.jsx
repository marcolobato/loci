import './Shutter.css'

// Shutter: the live capture button. A ring, a gap the ground shows through,
// and a mint disc. Mint means live, so use it only to capture or record.
// Spec: design/shutter-afterglow.md
//
// Props:
//   size         – "large" (76px ring, Capture screen) or "inline" (44px ring).
//                  The tap area is never smaller than 48px, even for inline.
//   tone         – "live" (mint, default) or "warm" (coral). Warm is only for
//                  the splash: an invitation before anything is live. Once the
//                  person taps, the Shutter becomes "live" (mint).
//   label        – the button's name, read by screen readers. Required:
//                  the Shutter has no visible words.
//   disabled     – true when it can't be used right now. Motion stops.
//   onClick      – what happens on tap. Optional for now.
//   recording    – true while recording. The idle pulse stops, a mint arc
//                  fills the ring over the recording time, and the disc
//                  follows the sound.
//   level        – while recording: how loud the room is, 0 to 1.
//   previewState – catalog only: "focus" or "pressed", shown without a real
//                  keyboard or finger. Screens never pass this.
function Shutter({ size = 'large', tone = 'live', label, disabled = false, onClick, recording = false, level = 0, previewState }) {
  // Build the class list, e.g. "shutter shutter--inline is-recording".
  let className = `shutter shutter--${size}`
  if (tone === 'warm') className += ' shutter--warm'
  if (recording) className += ' is-recording'
  if (previewState) className += ` is-${previewState}`

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {/* The ring and disc are drawing only; the button itself is the tap area.
          --level hands the loudness to the CSS, which sizes the disc. */}
      <span className="shutter__ring" aria-hidden="true" style={{ '--level': level }}>
        <span className="shutter__disc" />
        {/* While recording: the arc that fills like a clock. pathLength="100"
            lets the CSS treat the circle's length as 100, whatever its size.
            Its stroke matches the ring's stroke (3 of 76, or 2 of 44). */}
        {recording && (
          <svg className="shutter__progress" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={size === 'large' ? 48.03 : 47.73}
              pathLength="100"
              strokeWidth={size === 'large' ? 3.95 : 4.55}
            />
          </svg>
        )}
      </span>
    </button>
  )
}

export default Shutter
