import Note from './Note.jsx'
import Caption from './Caption.jsx'
import Moment from './Moment.jsx'
import { afterglow } from '../afterglow.js'
import './CaptureRow.css'

// CaptureRow: one capture in a list. A thin strip on the left, then the
// place, when it was captured, and the mood line. The strip and the mood line
// share the afterglow color, so the whole row cools as the moment ages.
//
// Props:
//   place      – the row's title: where it was captured, e.g. "Pantheon, Rome".
//                Captures without a place yet pass something plain, like
//                "10 s of sound".
//   mood       – optional mood line, e.g. "rain falling through the oculus"
//   minutesAgo – how long ago it was captured
//   children   – optional extra content under the text, e.g. a player
//
// It is a list item (<li>), so put it inside a list:
//   <ul className="list"> <CaptureRow … /> </ul>
// Screen readers then announce "list, 5 items".
function CaptureRow({ place, mood, minutesAgo, children }) {
  const { color, label, iso } = afterglow(minutesAgo)

  return (
    <li className="capture-row">
      {/* The strip: decoration only, since the words carry the same meaning. */}
      <span className="capture-row__strip" style={{ background: color }} aria-hidden="true" />
      <div className="capture-row__body stack-tight">
        <div>
          <Note>{place}</Note>
          {/* <time> carries the exact moment for screen readers and other tools,
              even when the visible text says "3 hr ago". */}
          <Caption><time dateTime={iso}>{label}</time></Caption>
          {mood && <Moment minutesAgo={minutesAgo}>{mood}</Moment>}
        </div>
        {children}
      </div>
    </li>
  )
}

export default CaptureRow
