import Note from './Note.jsx'
import Caption from './Caption.jsx'
import Moment from './Moment.jsx'
import { afterglow } from '../afterglow.js'
import './CaptureRow.css'

// CaptureRow: one capture in a list. A thin strip on the left, then the
// place, how long ago, and the mood line. The strip and the mood line share
// the afterglow color, so the whole row cools as the moment ages.
//
// Props:
//   place      – where it was captured, e.g. "Pantheon, Rome"
//   mood       – the mood line, e.g. "rain falling through the oculus"
//   minutesAgo – how long ago it was captured
//
// It is a list item (<li>), so put it inside a list:
//   <ul className="list"> <CaptureRow … /> </ul>
// Screen readers then announce "list, 5 items".
function CaptureRow({ place, mood, minutesAgo }) {
  const { color, label } = afterglow(minutesAgo)

  return (
    <li className="capture-row">
      {/* The strip: decoration only, since the mood line carries the same color. */}
      <span className="capture-row__strip" style={{ background: color }} aria-hidden="true" />
      <div>
        <Note>{place}</Note>
        <Caption>{label}</Caption>
        <Moment minutesAgo={minutesAgo}>{mood}</Moment>
      </div>
    </li>
  )
}

export default CaptureRow
