import { useEffect, useRef } from 'react'
import './Sheet.css'

// Sheet: a panel that slides up from the bottom, over the screen.
// Built on the browser's own <dialog>, opened as "modal", which gives:
//   - focus moves into the sheet, and stays there while it's open
//   - the screen behind can't be tapped or read by screen readers
//   - Escape (on a keyboard) asks to close it
//
// Props:
//   open      – true to show it
//   onClose   – called when it asks to close (Escape, or after a close)
//   closable  – false while something must not be interrupted (recording):
//               Escape then does nothing
//   label     – what screen readers call it, e.g. "Capture a moment"
//   children  – what's inside
function Sheet({ open, onClose, closable = true, label, children }) {
  const ref = useRef(null)

  // Open or close the real <dialog> when the "open" prop changes.
  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-label={label}
      onCancel={(event) => {
        // A photo picker inside the sheet also sends "cancel" when it is closed
        // without choosing (e.g. backing out of the camera roll), and that
        // signal travels up to here. Only the sheet's own cancel (Escape)
        // should close it, so ignore any that started somewhere inside.
        if (event.target !== event.currentTarget) return
        // Escape: we decide, not the browser.
        event.preventDefault()
        if (closable) onClose()
      }}
    >
      {children}
    </dialog>
  )
}

export default Sheet
