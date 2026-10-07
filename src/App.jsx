// The screen Loci shows. Each screen lives in its own file;
// App picks which one to show.
// TypeSample.jsx is kept for reference but not shown.
import Capture from './Capture.jsx'
import Catalog from './Catalog.jsx'

// "?catalog" in the address opens the component catalog instead of Capture.
// Typing it in the address bar reloads the page, so no router is needed.
const showCatalog = new URLSearchParams(window.location.search).has('catalog')

function App() {
  return showCatalog ? <Catalog /> : <Capture />
}

export default App
