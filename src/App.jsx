// The screen Loci shows. Each screen lives in its own file;
// App picks which one to show from the address:
//   ?moments – your kept captures
//   ?catalog – the component catalog
//   (nothing) – Capture
// Typing or tapping a new address reloads the page, so no router is needed.
// TypeSample.jsx is kept for reference but not shown.
import Capture from './Capture.jsx'
import Catalog from './Catalog.jsx'
import Moments from './Moments.jsx'

const query = new URLSearchParams(window.location.search)

function App() {
  if (query.has('moments')) return <Moments />
  if (query.has('catalog')) return <Catalog />
  return <Capture />
}

export default App
