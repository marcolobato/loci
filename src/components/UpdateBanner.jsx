import Note from './Note.jsx'
import TextButton from './TextButton.jsx'
import './UpdateBanner.css'

// UpdateBanner: says a new version of Loci has downloaded and offers to
// switch to it. Nothing changes until the person taps Reload, so a
// recording is never interrupted.
//
// Props:
//   onReload  – switch to the new version now
//   onDismiss – "Later": hide the banner; the new version waits until the
//               app is fully closed and opened again
//
// role="status": screen readers announce it once when it appears,
// without stopping what the person is doing.
function UpdateBanner({ onReload, onDismiss }) {
  return (
    <div className="update-banner" role="status">
      <Note>A new version of Loci is ready.</Note>
      <div className="inline-group">
        <TextButton onClick={onReload}>Reload</TextButton>
        <TextButton onClick={onDismiss}>Later</TextButton>
      </div>
    </div>
  )
}

export default UpdateBanner
