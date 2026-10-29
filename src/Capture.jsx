// Pattern: one screen. Your moments live here, newest first, and capturing
// happens in a bottom sheet over them.
//   - Tap the Shutter: the sheet slides up and recording starts
//     (10 seconds, or tap the Shutter in the sheet to stop early).
//   - Each recording is kept automatically. Then add a photo, where you
//     are and how it feels.
//   - Done: the note is kept, the sheet closes, and the new moment appears
//     at the top of the list.
import { useEffect, useState } from 'react'
import Label from './components/Label.jsx'
import Heading from './components/Heading.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import Shutter from './components/Shutter.jsx'
import Backdrop from './components/Backdrop.jsx'
import AudioClip from './components/AudioClip.jsx'
import Notice from './components/Notice.jsx'
import Photo from './components/Photo.jsx'
import PhotoPicker from './components/PhotoPicker.jsx'
import Field from './components/Field.jsx'
import TextButton from './components/TextButton.jsx'
import TextLink from './components/TextLink.jsx'
import Sheet from './components/Sheet.jsx'
import MomentList from './components/MomentList.jsx'
import granite from './assets/granite-dusk.webp'
import { useRecorder } from './useRecorder.js'
import { useMoments } from './useMoments.js'
import { pickHint, quietHint } from './hints.js'
import { saveCapture, askToKeepStorage, updateCapture, photoForStore } from './captureStore.js'
import { shrinkPhoto } from './photo.js'

// "1 moment" or "3 moments".
const moments = (n) => (n === 1 ? '1 moment' : `${n} moments`)

// What the sheet's top line says while capturing.
function messageFor(status, recordedSeconds, saveState, hint) {
  if (status === 'asking') return 'Allow the microphone to listen.'
  if (status === 'recording') return hint || 'Listening…'
  if (status === 'done' && saveState === 'saving') return 'Keeping…'
  if (status === 'done') return `Kept ${recordedSeconds} s of sound. Add what you see and feel, then tap Done.`
  return ''
}

// When recording fails: what happened, what to do, and (if useful) where.
// Each one names a fix. None of them blame the person.
const errors = {
  blocked: {
    text: 'Loci can’t hear the room. Allow the microphone, then tap to try again.',
    hint: 'On iPhone: tap the page menu in the address bar, then Website Settings, then Microphone.',
  },
  'no-mic': {
    text: 'No microphone found. Connect one, or open Loci on your phone.',
  },
  unsupported: {
    text: 'This browser can’t record sound. Open Loci in an up-to-date Safari or Chrome.',
  },
  failed: {
    text: 'Something stopped the recording. Tap to try again.',
  },
}
const saveFailed = 'Couldn’t keep this recording. Your phone may be out of space. You can still play it below.'

function Capture() {
  // Your kept moments, for the list.
  const kept = useMoments()

  // The sheet, and how keeping the latest recording went: idle, saving,
  // saved or failed.
  const [sheetOpen, setSheetOpen] = useState(false)
  const [saveState, setSaveState] = useState('idle')
  // The hint shown while recording (picked fresh each time; see hints.js).
  const [hint, setHint] = useState('')
  // What gets added to the capture just kept: its id, place, note, photo.
  const [currentId, setCurrentId] = useState(null)
  const [place, setPlace] = useState('')
  const [note, setNote] = useState('')
  const [photoLink, setPhotoLink] = useState(null)
  const [photoState, setPhotoState] = useState('idle')
  const [finishState, setFinishState] = useState('idle')

  // When the photo is replaced or the screen goes away, free its memory.
  useEffect(() => {
    return () => {
      if (photoLink) URL.revokeObjectURL(photoLink)
    }
  }, [photoLink])

  // Called once each time a recording finishes: keep it on the phone.
  async function keep(file, seconds) {
    setSaveState('saving')
    try {
      const capture = await saveCapture({ audio: file, seconds })
      setCurrentId(capture.id)
      setSaveState('saved')
      askToKeepStorage().catch(() => {}) // a "no" here is fine; nothing to show
    } catch {
      setSaveState('failed')
    }
  }

  const { status, error, secondsLeft, recordedSeconds, audioUrl, level, isQuiet, start, stop } = useRecorder({ onRecorded: keep })
  const isRecording = status === 'recording'
  const isBusy = isRecording || status === 'asking'

  // Start a fresh capture: clear the last one's extras, pick a hint, record.
  // Called straight from the tap, because iPhone only allows recording
  // that starts during a tap.
  function record() {
    setSaveState('idle')
    setHint(pickHint())
    setCurrentId(null)
    setPlace('')
    setNote('')
    setPhotoLink(null)
    setPhotoState('idle')
    setFinishState('idle')
    setSheetOpen(true)
    start()
  }

  // Shrink the chosen photo, keep it with the capture, and show it.
  async function addPhoto(file) {
    setPhotoState('saving')
    try {
      const small = await shrinkPhoto(file)
      await updateCapture(currentId, { photo: await photoForStore(small) })
      setPhotoLink(URL.createObjectURL(small))
      setPhotoState('saved')
    } catch {
      setPhotoState('failed')
    }
  }

  // Done: keep the place and note (if any), close the sheet, and show the
  // new moment in the list.
  async function finish() {
    if (isBusy) return
    if (currentId && (place.trim() || note.trim())) {
      setFinishState('saving')
      try {
        await updateCapture(currentId, { place: place.trim(), note: note.trim() })
      } catch {
        setFinishState('failed')
        return
      }
    }
    setSheetOpen(false)
    setFinishState('idle')
    kept.reload()
  }

  const count = kept.items.length

  return (
    // has-backdrop: the granite, edge to edge, behind everything.
    // capture: leaves room at the bottom for the Shutter.
    <main className="page stack-loose has-backdrop capture">
      <Backdrop image={granite} cover="screen" />

      {/* Top: the app name, and how many moments are kept. */}
      <div className="stack-tight">
        <Label as="h1">Loci</Label>
        {kept.status === 'ready' && count > 0 && <Caption>{moments(count)} on this phone · newest first</Caption>}
        <div>
          <TextLink href="?about">About Loci</TextLink>
        </div>
      </div>

      {/* Loading, failure, or nothing kept yet. */}
      <div role="status">
        {kept.status === 'loading' && <Note tone="soft">Opening your moments…</Note>}
        {kept.status === 'error' && <Notice>Couldn’t open your moments. Reload the page to try again.</Notice>}
        {/* Nothing kept yet. Picks up from the splash ("Tap to begin"): the
            first tap brought you here, the second one records. The second line
            warns about the microphone question before it appears. */}
        {kept.status === 'ready' && count === 0 && (
          <div className="stack-normal">
            <Heading size="title" as="p">Tap again to record.</Heading>
            <Note tone="soft">
              Ten seconds of how this place sounds. Loci will ask to use your microphone. Everything stays on this
              phone.
            </Note>
          </div>
        )}
      </div>

      {/* Your moments. */}
      {kept.status === 'ready' && count > 0 && (
        <MomentList items={kept.items} />
      )}

      {/* Bottom: the Shutter, always within reach. It opens the sheet. */}
      <div className="capture__dock">
        <Shutter size="large" label="Capture moment" onClick={record} />
      </div>

      {/* The sheet: everything about the capture in progress. */}
      <Sheet open={sheetOpen} onClose={finish} closable={!isBusy} label="Capture a moment">
        <div className="stack-normal">
          {/* role="status": screen readers read this line out when it changes. */}
          <div role="status">
            {status === 'error' ? (
              <Notice hint={errors[error]?.hint}>{(errors[error] ?? errors.failed).text}</Notice>
            ) : saveState === 'failed' ? (
              <Notice>{saveFailed}</Notice>
            ) : (
              <Note tone="soft">{messageFor(status, recordedSeconds, saveState, isQuiet ? quietHint : hint)}</Note>
            )}
          </div>

          {/* The countdown is hidden from screen readers, so they don't hear
              a number every second. The line above already says what's on. */}
          {isRecording && (
            <div aria-hidden="true">
              <Caption>0:{String(secondsLeft).padStart(2, '0')}</Caption>
            </div>
          )}

          {status === 'done' && audioUrl && <AudioClip src={audioUrl} label="Your recording" />}

          {/* Once kept: a photo, where you are and how it feels. All optional. */}
          {status === 'done' && saveState === 'saved' && (
            <>
              {photoLink && <Photo src={photoLink} alt={place ? `Photo of ${place}` : 'Photo of this moment'} />}
              <div role="status">
                {photoState === 'saving' ? (
                  <Caption>Keeping the photo…</Caption>
                ) : (
                  <PhotoPicker label={photoLink ? 'Change the photo' : 'Add a photo'} onPick={addPhoto} />
                )}
              </div>
              {photoState === 'failed' && <Notice>Couldn’t keep the photo. Try another one.</Notice>}
              <Field label="Where are you?" value={place} onChange={setPlace} placeholder="A street, a room, a ruin" />
              <Field
                label="What does it feel like?"
                multiline
                value={note}
                onChange={setNote}
                placeholder="Light, sound, temperature, what's close to you"
                hint="Tip: tap the microphone on the keyboard to say it instead."
              />
            </>
          )}
          {finishState === 'failed' && <Notice>Couldn’t keep the note. Try Done again.</Notice>}

          {/* The sheet's own Shutter (the one behind can't be tapped while
              the sheet is open): stop early, or record again. And Done. */}
          <div className="sheet__actions">
            <Shutter
              size="large"
              label={isRecording ? 'Stop recording' : 'Record again'}
              onClick={isRecording ? stop : record}
              disabled={status === 'asking'}
              recording={isRecording}
              level={level}
            />
            {!isBusy && (
              <TextButton onClick={finish}>{finishState === 'saving' ? 'Keeping…' : 'Done'}</TextButton>
            )}
          </div>
        </div>
      </Sheet>
    </main>
  )
}

export default Capture
