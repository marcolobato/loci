import CaptureRow from './CaptureRow.jsx'
import AudioClip from './AudioClip.jsx'

// MomentList: your kept moments as slim cards, newest first. Each card has
// its photo, place, time, note and a player. Tapping a card's photo or words
// opens that moment on its own page (?moment=<id>), where its nine
// ingredients, the photo and Delete live. The player stays here, so you can
// replay a place without opening it.
//
// Props:
//   items – from useMoments
function MomentList({ items }) {
  return (
    <ul className="list stack-tight">
      {items.map((item) => (
        <CaptureRow
          key={item.id}
          place={item.place || `${item.seconds} s of sound`}
          photo={item.photoLink && { src: item.photoLink, alt: item.place ? `Photo of ${item.place}` : 'Photo of this moment' }}
          mood={item.note}
          minutesAgo={item.minutesAgo}
          href={`?moment=${encodeURIComponent(item.id)}`}
        >
          <AudioClip src={item.url} label={`Play ${item.seconds} seconds of sound`} />
        </CaptureRow>
      ))}
    </ul>
  )
}

export default MomentList
