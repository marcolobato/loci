// Pattern: Moment detail. One moment on its own page: its photo, where and
// when, how it felt, and its sound. Opened by tapping a moment in the list
// on Capture; the address is ?moment=<id>.
// The top bar (title and X) stays put; the moment scrolls under it.
// Pattern: edit by section. "Edit moment" opens the photo, place and note in
// place, with Save and Cancel where Edit was. Nothing is kept until Save, so
// Cancel puts everything back, the photo too.
// Its nine ingredients are here too: Loci suggests them from the note, and you
// keep or dismiss each one. Delete is at the very bottom and asks first.
import { useEffect, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import Heading from './components/Heading.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import Moment from './components/Moment.jsx'
import Photo from './components/Photo.jsx'
import AudioClip from './components/AudioClip.jsx'
import PhotoPicker from './components/PhotoPicker.jsx'
import Field from './components/Field.jsx'
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

  // Editing the moment section. While editing, the place and note being typed
  // are drafts: only Save keeps them.
  const [editing, setEditing] = useState(false)
  const [place, setPlace] = useState('')
  const [note, setNote] = useState('')
  // A photo picked while editing, not kept yet: { file, link } or null.
  const [newPhoto, setNewPhoto] = useState(null)
  // Preparing the picked photo: 'idle', 'shrinking' or 'failed'.
  const [photoState, setPhotoState] = useState('idle')
  // Saving: 'idle', 'saving' or 'failed'.
  const [saveState, setSaveState] = useState('idle')

  // When the picked photo is replaced or dropped, free its memory.
  useEffect(() => {
    return () => {
      if (newPhoto) URL.revokeObjectURL(newPhoto.link)
    }
  }, [newPhoto])

  // Edit moment: fill the drafts with what's there now.
  function startEditing() {
    setPlace(item.place || '')
    setNote(item.note || '')
    setNewPhoto(null)
    setPhotoState('idle')
    setSaveState('idle')
    setConfirming(false)
    setEditing(true)
  }

  // Shrink the chosen photo (like the capture sheet does) and show it,
  // but don't keep it until Save.
  async function pickPhoto(file) {
    setPhotoState('shrinking')
    try {
      const small = await shrinkPhoto(file)
      setNewPhoto({ file: small, link: URL.createObjectURL(small) })
      setPhotoState('idle')
    } catch {
      setPhotoState('failed')
    }
  }

  // Save: keep the place, note and any new photo in one go, read the moment
  // again so the page shows them, and leave edit mode. If it fails, stay in
  // edit mode so nothing typed is lost.
  async function save() {
    setSaveState('saving')
    try {
      const changes = { place: place.trim(), note: note.trim() }
      if (newPhoto) changes.photo = await photoForStore(newPhoto.file)
      await updateCapture(id, changes)
      await kept.reload()
      setNewPhoto(null)
      setSaveState('idle')
      setEditing(false)
    } catch {
      setSaveState('failed')
    }
  }

  // Cancel: drop the drafts. The moment is as it was.
  function cancel() {
    setNewPhoto(null)
    setEditing(false)
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
            {editing ? (
              // Editing the moment section: the photo (the newly picked one,
              // if any), then the same two fields as the capture sheet.
              <div className="stack-normal">
                {(newPhoto || item.photoLink) && (
                  <Photo src={newPhoto ? newPhoto.link : item.photoLink} alt="Photo of this moment" />
                )}
                <div role="status">
                  {photoState === 'shrinking' ? (
                    <Caption>Preparing the photo…</Caption>
                  ) : (
                    <PhotoPicker
                      label={newPhoto || item.photoLink ? 'Change the photo' : 'Add a photo'}
                      onPick={pickPhoto}
                    />
                  )}
                </div>
                {photoState === 'failed' && <Notice>Couldn’t use that photo. Try another one.</Notice>}
                <Field label="Where are you?" value={place} onChange={setPlace} placeholder="A street, a room, a ruin" />
                <Field
                  label="What does it feel like?"
                  multiline
                  value={note}
                  onChange={setNote}
                  placeholder="Light, sound, temperature, what's close to you"
                  hint="Tip: tap the microphone on the keyboard to say it instead."
                />
                {/* Save and Cancel sit where Edit moment was, right under the
                    note. The (usually empty) message slot comes after them, so
                    it never adds space above Save: Save stays close to the
                    note, clear of the keyboard. A failure shows right under
                    the Save you just tapped. */}
                <div className="stack-tight">
                  <div className="inline-group">
                    <TextButton onClick={save}>{saveState === 'saving' ? 'Saving…' : 'Save'}</TextButton>
                    <TextButton onClick={cancel}>Cancel</TextButton>
                  </div>
                  <div role="status">
                    {saveState === 'failed' && <Notice>Couldn’t save. Your changes are still here. Try Save again.</Notice>}
                  </div>
                </div>
              </div>
            ) : (
              // Reading: the moment as kept, and the way into editing it.
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
                <div>
                  <TextButton onClick={startEditing}>Edit moment</TextButton>
                </div>
              </div>
            )}

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

            {/* Delete hides while editing, so it can't be tapped by mistake. */}
            {editing ? null : confirming ? (
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
