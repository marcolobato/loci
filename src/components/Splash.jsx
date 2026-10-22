import { useState } from 'react'
import './Splash.css'
import Backdrop from './Backdrop.jsx'
import Heading from './Heading.jsx'
import Note from './Note.jsx'
import Shutter from './Shutter.jsx'
import granite from '../assets/granite-dusk.webp'

// Splash: the opening screen, written like a dictionary entry: the word,
// how to say it and what it means in one line, and what Loci does.
// It sits on top of the Capture screen. The only way forward is the coral
// Shutter. On tap, the Shutter glides down to where Capture's own Shutter
// rests, the words fade, and the splash fades away to show Capture.
//
// Props:
//   onDone – called once the splash has fully faded away
function Splash({ onDone }) {
  // false while waiting; true from the tap until the splash has faded.
  const [landing, setLanding] = useState(false)

  function begin() {
    if (landing) return // a second tap mid-glide does nothing
    // For people who asked their phone for less motion: skip the glide.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return
    }
    setLanding(true)
  }

  // The last thing to happen is the whole splash fading out (see Splash.css).
  // Only that one counts. Transitions of the pieces inside bubble up here too,
  // so check that this really is the splash itself, fading.
  function handleTransitionEnd(event) {
    if (event.target === event.currentTarget && event.propertyName === 'opacity') onDone()
  }

  return (
    <main
      className={landing ? 'splash has-backdrop page is-landing' : 'splash has-backdrop page'}
      onTransitionEnd={handleTransitionEnd}
    >
      <Backdrop image={granite} cover="screen" />

      {/* The warm glow behind the Shutter. Decoration only. */}
      <div className="splash__glow" aria-hidden="true" />

      {/* The entry. Source order is reading order: word, meaning, purpose. */}
      <div className="splash__words stack-loose">
        <Heading size="display" as="h1">Loci</Heading>
        <div className="stack-normal">
          <Heading as="p">(LOH-sigh) Latin for “places,” as in genius loci, the spirit of a place.</Heading>
          <Note tone="soft">Keep how a place feels. Take photos, sound, and notes about how a place made you feel.</Note>
        </div>
      </div>

      {/* The dock: where the Shutter will rest on Capture, moved up for now. */}
      <div className="splash__dock">
        <div className="splash__shutter">
          <Shutter tone="warm" label="Begin" onClick={begin} />
          <div className="splash__hint">
            <Note tone="soft">Tap to begin</Note>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Splash
