// The screen Loci shows. Each screen lives in its own file;
// App picks which one to show from the address:
//   ?moments – your kept captures
//   ?catalog – the component catalog
//   (nothing) – Capture
// Typing or tapping a new address reloads the page, so no router is needed.
// TypeSample.jsx is kept for reference but not shown.
//
// App also watches for a new version of Loci (see vite.config.js): when one
// has downloaded, it shows the UpdateBanner on top of any screen.
import { useRegisterSW } from 'virtual:pwa-register/react'
import Capture from './Capture.jsx'
import Catalog from './Catalog.jsx'
import Moments from './Moments.jsx'
import UpdateBanner from './components/UpdateBanner.jsx'

const query = new URLSearchParams(window.location.search)

function Screen() {
  if (query.has('moments')) return <Moments />
  if (query.has('catalog')) return <Catalog />
  return <Capture />
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
