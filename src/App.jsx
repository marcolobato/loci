// The screen Loci shows. Each screen lives in its own file;
// App picks which one to show from the address:
//   ?intro   – the nine ingredients, one per screen, flipped through
//   ?about   – what Loci is, and the nine ingredients
//   ?catalog – the component catalog
//   (nothing) – Capture: your moments, and capturing new ones, with the
//               splash on top until it has faded away
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
import Intro from './Intro.jsx'
import Splash from './components/Splash.jsx'
import UpdateBanner from './components/UpdateBanner.jsx'

const query = new URLSearchParams(window.location.search)

// Home: Capture, with the splash on top until the splash has faded away.
// (For now the splash shows every time Loci opens. A "first time only" rule
// comes in a later step.)
function Home() {
  const [splash, setSplash] = useState(true)
  return (
    <>
      {/* inert: while the splash covers Capture, the keyboard and screen
          readers skip it, so nobody lands on a screen they can't see. */}
      <div inert={splash}>
        <Capture />
      </div>
      {splash && <Splash onDone={() => setSplash(false)} />}
    </>
  )
}

function Screen() {
  if (query.has('intro')) return <Intro />
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
