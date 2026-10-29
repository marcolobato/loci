import Note from './Note.jsx'
import Caption from './Caption.jsx'
import Moment from './Moment.jsx'
import Photo from './Photo.jsx'
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
//   photo      – optional { src, alt }: a small square thumbnail beside the
//                words. Without one, the words use the full width.
//   href       – optional: where tapping the photo and text goes, e.g. the
//                moment's own page. The children stay outside the link,
//                because buttons and players can't sit inside a link.
//   children   – optional extra content under the text, e.g. a player
//
// It is a list item (<li>), so put it inside a list:
//   <ul className="list"> <CaptureRow … /> </ul>
// Screen readers then announce "list, 5 items".
function CaptureRow({ place, mood, minutesAgo, photo, href, children }) {
  const { color, label, iso } = afterglow(minutesAgo)

  // The photo and the words. With an href they become one link.
  const summary = (
    <>
      {photo && <Photo size="thumb" src={photo.src} alt={photo.alt} />}
      <div className="capture-row__words">
        <Note>{place}</Note>
        {/* <time> carries the exact moment for screen readers and other tools,
            even when the visible text says "3 hr ago". */}
        <Caption><time dateTime={iso}>{label}</time></Caption>
        {mood && <Moment minutesAgo={minutesAgo}>{mood}</Moment>}
      </div>
    </>
  )

  return (
    <li className="capture-row">
      {/* The strip: decoration only, since the words carry the same meaning. */}
      <span className="capture-row__strip" style={{ background: color }} aria-hidden="true" />
      <div className="capture-row__body stack-tight">
        {href ? (
          <a className={photo ? 'capture-row__link capture-row__link--photo' : 'capture-row__link'} href={href}>
            {summary}
          </a>
        ) : (
          summary
        )}
        {children}
      </div>
    </li>
  )
}

export default CaptureRow
