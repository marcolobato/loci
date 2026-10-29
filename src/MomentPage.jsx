// Pattern: Moment detail. One moment on its own page: its photo, where and
// when, how it felt, and its sound. Opened by tapping a moment in the list
// on Capture; the address is ?moment=<id>.
// The top bar (title and X) stays put; the moment scrolls under it.
// Coming next: add or change the photo here, then its ingredients and Delete.
import TopBar from './components/TopBar.jsx'
import Heading from './components/Heading.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import Moment from './components/Moment.jsx'
import Photo from './components/Photo.jsx'
import AudioClip from './components/AudioClip.jsx'
import Notice from './components/Notice.jsx'
import TextLink from './components/TextLink.jsx'
import Backdrop from './components/Backdrop.jsx'
import granite from './assets/granite-dusk.webp'
import { useMoments } from './useMoments.js'
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
            </div>

            <AudioClip src={item.url} label={`Play ${item.seconds} seconds of sound`} />
          </div>
        )}
      </div>
    </main>
  )
}

export default MomentPage
