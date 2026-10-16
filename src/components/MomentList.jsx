import { useState } from 'react'
import Note from './Note.jsx'
import Caption from './Caption.jsx'
import CaptureRow from './CaptureRow.jsx'
import AudioClip from './AudioClip.jsx'
import Notice from './Notice.jsx'
import TextButton from './TextButton.jsx'
import Ingredients from './Ingredients.jsx'

// MomentList: your kept moments as cards, newest first. Each card has its
// photo, place, time, note, a player, the nine ingredients, and Delete
// (which asks first, in place).
//
// Props:
//   items    – from useMoments
//   onDecide – (item, ingredientId, decision) => Promise, from useMoments
//   onRemove – (item) => Promise, from useMoments; throws if it fails
function MomentList({ items, onDecide, onRemove }) {
  // Which card is asking "are you sure?", which one failed to delete, and a
  // short line that confirms what happened (screen readers read it out).
  const [confirmingId, setConfirmingId] = useState(null)
  const [failedId, setFailedId] = useState(null)
  const [announcement, setAnnouncement] = useState('')

  async function remove(item) {
    try {
      await onRemove(item)
      setConfirmingId(null)
      setFailedId(null)
      setAnnouncement('Moment deleted.')
    } catch {
      setFailedId(item.id)
    }
  }

  async function decide(item, ingredientId, decision) {
    try {
      await onDecide(item, ingredientId, decision)
    } catch {
      setAnnouncement('Couldn’t save that choice. Try again.')
    }
  }

  return (
    <>
      <div role="status">{announcement && <Caption>{announcement}</Caption>}</div>
      <ul className="list stack-tight">
        {items.map((item) => (
          <CaptureRow
            key={item.id}
            place={item.place || `${item.seconds} s of sound`}
            photo={item.photoLink && { src: item.photoLink, alt: item.place ? `Photo of ${item.place}` : 'Photo of this moment' }}
            mood={item.note}
            minutesAgo={item.minutesAgo}
          >
            <AudioClip src={item.url} label={`Play ${item.seconds} seconds of sound`} />

            {/* Zumthor's nine ingredients, suggested from the note. */}
            <Ingredients
              capture={item}
              decisions={item.ingredients}
              onDecide={(ingredientId, decision) => decide(item, ingredientId, decision)}
            />

            {/* Delete asks first, in place: no pop-up, nothing lost by accident. */}
            {confirmingId === item.id ? (
              <div className="stack-tight">
                <Note>Delete this moment? This can’t be undone.</Note>
                {failedId === item.id && <Notice>Couldn’t delete it. Try again.</Notice>}
                <div className="inline-group">
                  <TextButton tone="danger" onClick={() => remove(item)}>Delete</TextButton>
                  <TextButton onClick={() => { setConfirmingId(null); setFailedId(null) }}>Keep</TextButton>
                </div>
              </div>
            ) : (
              <div>
                <TextButton onClick={() => { setConfirmingId(item.id); setAnnouncement('') }}>Delete</TextButton>
              </div>
            )}
          </CaptureRow>
        ))}
      </ul>
    </>
  )
}

export default MomentList
