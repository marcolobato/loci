import { afterglow } from '../afterglow.js'

// Moment: the mood line of a capture, e.g. "last light, still warm".
// Italic (the Moment type style), colored by how old the capture is:
// warm when new, cooling to blue over a month.
//
// Props:
//   children   – the mood text
//   minutesAgo – how long ago the capture was made (default 0 = just now)
function Moment({ children, minutesAgo = 0 }) {
  // The helper gives a token like "var(--afterglow-day)", never a raw color.
  const { color } = afterglow(minutesAgo)

  return (
    <p className="type-moment" style={{ color }}>
      {children}
    </p>
  )
}

export default Moment
