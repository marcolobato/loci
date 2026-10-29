// Pattern: Moment detail. One moment on its own page: its photo, where and
// when, how it felt, and its sound. Opened by tapping a moment in the list
// on Capture; the address is ?moment=<id>.
// The top bar (title and X) stays put; the moment scrolls under it.
// You can add a photo here, or change it, any time after capturing.
// Its nine ingredients are here too: Loci suggests them from the note, and you
// keep or dismiss each one. Delete is at the very bottom and asks first.
import { useState } from 'react'
import TopBar from './components/TopBar.jsx'
import Heading from './components/Heading.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import Moment from './components/Moment.jsx'
import Photo from './components/Photo.jsx'
import AudioClip from './components/AudioClip.jsx'
import PhotoPicker from './components/PhotoPicker.jsx'
import Ingredients from './components/Ingredients.jsx'
import Notice from './components/Notice.jsx'
import TextButton from './components/TextButton.jsx'
import TextLink from './components/TextLink.jsx'
import Backdrop from './components/Backdrop.jsx'
import granite from './assets/granite-dusk.webp'
import { useMoments } from './useMoments.js'
import { updateCapture, photoForStore } from './captureStore.js'
import { shrinkPhoto } from './photo.js'
import { afterglow } from './afterglow.js'

// Props:
//   id – the moment's id, from the address (?moment=<id>)
function MomentPage({ id }) {
  // All kept moments, read from the phone. Finding one by id in the list is
  // simple, and quick enough for the number of moments one person keeps.
  const kept = useMoments()
  const item = kept.items.find((moment) => moment.id === id)

  // When it was captured, in words ("3 hr ago") and exactly (for <time>).
  const when = item ? afterglow(item.minutesAgo) : null

  // The photo: 'idle', 'saving' or 'failed'.
  const [photoState, setPhotoState] = useState('idle')

  // Same steps as on the capture sheet: shrink the chosen photo, keep it with
  // the moment, then read the moment again so the new photo shows up.
  async function addPhoto(file) {
    setPhotoState('saving')
    try {
      const small = await shrinkPhoto(file)
      await updateCapture(id, { photo: await photoForStore(small) })
      await kept.reload()
      setPhotoState('idle')
    } catch {
      setPhotoState('failed')
    }
  }

  // Keep or dismiss an ingredient. It shows straight away (useMoments); if
  // saving fails, say so.
  const [choiceFailed, setChoiceFailed] = useState(false)

  async function decide(ingredientId, decision) {
    try {
      await kept.decide(item, ingredientId, decision)
      setChoiceFailed(false)
    } catch {
      setChoiceFailed(true)
    }
  }

  // Delete asks first, in place: no pop-up, nothing lost by accident.
  const [confirming, setConfirming] = useState(false)
  const [deleteFailed, setDeleteFailed] = useState(false)

  async function remove() {
    try {
      await kept.remove(item)
      // Gone for good: back to your moments.
      window.location.assign('?')
    } catch {
      setDeleteFailed(true)
    }
  }

  return (
    <main className="screen-with-bar has-backdrop">
      <Backdrop image={granite} cover="screen" />

      {/* Pinned: what this screen is, and the way back to your moments. */}
      <TopBar title="Moment" />

      <div className="screen-with-bar__body">
        {/* Loading, failure, or a moment that isn't here (e.g. deleted). */}
        <div role="status">
          {kept.status === 'loading' && <Note tone="soft">Opening this moment…</Note>}
          {kept.status === 'error' && <Notice>Couldn’t open this moment. Reload the page to try again.</Notice>}
          {kept.status === 'ready' && !item && (
            <div className="stack-normal">
              <Note>This moment isn’t here anymore. It may have been deleted.</Note>
              <div>
                <TextLink href="?">Back to your moments</TextLink>
              </div>
            </div>
          )}
        </div>

        {/* The moment, top to bottom: photo, where, when, how it felt, its sound.
            Any part that's missing (no photo, no place, no note) is left out. */}
        {item && (
          <div className="stack-loose">
            <div className="stack-normal">
              {item.photoLink && (
                <Photo src={item.photoLink} alt={item.place ? `Photo of ${item.place}` : 'Photo of this moment'} />
              )}
              <div className="stack-tight">
                <Heading size="title">{item.place || `${item.seconds} s of sound`}</Heading>
                {/* <time> carries the exact moment for screen readers and other
                    tools, even when the visible text says "3 hr ago". */}
                <Caption><time dateTime={when.iso}>{when.label}</time></Caption>
              </div>
              {item.note && <Moment minutesAgo={item.minutesAgo}>{item.note}</Moment>}

              {/* Add a photo now, or swap the one you have. While it is being
                  kept, a short line replaces the button. */}
              <div role="status">
                {photoState === 'saving' ? (
                  <Caption>Keeping the photo…</Caption>
                ) : (
                  <PhotoPicker label={item.photoLink ? 'Change the photo' : 'Add a photo'} onPick={addPhoto} />
                )}
              </div>
              {photoState === 'failed' && <Notice>Couldn’t keep the photo. Try another one.</Notice>}
            </div>

            <AudioClip src={item.url} label={`Play ${item.seconds} seconds of sound`} />

            {/* Zumthor's nine ingredients, suggested from the note. */}
            <div className="stack-tight">
              <Ingredients
                capture={item}
                decisions={item.ingredients}
                onDecide={decide}
              />
              <div role="status">
                {choiceFailed && <Notice>Couldn’t save that choice. Try again.</Notice>}
              </div>
            </div>

            {confirming ? (
              <div className="stack-tight">
                <Note>Delete this moment? This can’t be undone.</Note>
                {deleteFailed && <Notice>Couldn’t delete it. Try again.</Notice>}
                <div className="inline-group">
                  <TextButton tone="danger" onClick={remove}>Delete</TextButton>
                  <TextButton onClick={() => { setConfirming(false); setDeleteFailed(false) }}>Keep</TextButton>
                </div>
              </div>
            ) : (
              <div>
                <TextButton onClick={() => setConfirming(true)}>Delete</TextButton>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default MomentPage
