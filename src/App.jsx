// The screen Loci shows. Each screen lives in its own file;
// App picks which one to show from the address:
//   ?moment=<id> – one moment on its own page
//   ?ingredients – the nine ingredients, one per screen, flipped through
//   ?about   – what Loci is
//   ?catalog – the component catalog
//   (nothing) – Capture: your moments, and capturing new ones, with the
//               splash on top the first time only
//   ?splash   – Capture with the splash, even if it was seen before
// Typing or tapping a new address reloads the page, so no router is needed.
// TypeSample.jsx is kept for reference but not shown.
//
// App also watches for a new version of Loci (see vite.config.js): when one
// has downloaded, it shows the UpdateBanner on top of any screen.
import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import Capture from './Capture.jsx'
import Catalog from './Catalog.jsx'
import About from './About.jsx'
import Ingredients from './Ingredients.jsx'
import MomentPage from './MomentPage.jsx'
import Splash from './components/Splash.jsx'
import UpdateBanner from './components/UpdateBanner.jsx'

const query = new URLSearchParams(window.location.search)

// The splash shows once. After the first tap, Loci keeps a small note in the
// browser ("seen"), so coming back to Capture (e.g. from the X on The nine
// ingredients) goes straight to Capture. Add ?splash to the address to see
// the splash again.
// try/catch: some browsers (e.g. private windows) refuse to keep notes. Then
// the splash simply shows each time, and nothing breaks.
const SPLASH_KEY = 'loci-splash-seen'

function splashSeen() {
  try {
    return localStorage.getItem(SPLASH_KEY) === 'yes'
  } catch {
    return false
  }
}

function rememberSplash() {
  try {
    localStorage.setItem(SPLASH_KEY, 'yes')
  } catch {
    // Nothing to do: the splash will show again next time.
  }
}

// Home: Capture, with the splash on top (first time only) until the splash
// has faded away.
function Home() {
  const [splash, setSplash] = useState(query.has('splash') || !splashSeen())

  function splashDone() {
    rememberSplash()
    setSplash(false)
  }

  return (
    <>
      {/* inert: while the splash covers Capture, the keyboard and screen
          readers skip it, so nobody lands on a screen they can't see.
          home: full height, so Capture's pinned bar stays put (see index.css). */}
      <div className="home" inert={splash}>
        <Capture />
      </div>
      {splash && <Splash onDone={splashDone} />}
    </>
  )
}

function Screen() {
  if (query.has('moment')) return <MomentPage id={query.get('moment')} />
  if (query.has('ingredients')) return <Ingredients />
  if (query.has('about')) return <About />
  if (query.has('catalog')) return <Catalog />
  return <Home />
}

function App() {
  // needRefresh: true when a new version is waiting.
  // updateServiceWorker(): switch to it and reload.
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return (
    <>
      <Screen />
      {needRefresh && (
        <UpdateBanner
          onReload={() => updateServiceWorker()}
          onDismiss={() => setNeedRefresh(false)}
        />
      )}
    </>
  )
}

export default App
