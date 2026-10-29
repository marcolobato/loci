import './TopBar.css'
import Label from './Label.jsx'
import CloseButton from './CloseButton.jsx'

// TopBar: the row pinned at the top of a screen. The screen's name on the
// left, a way out (the X) on the right. It stays put while the screen's
// content scrolls underneath, like the bar in a real app.
//
// The screen puts it above a scrolling area (.screen-with-bar in index.css).
// This component only draws the row.
//
// Props:
//   title     – the screen's name. It is the page's main heading (h1), so
//               screen readers announce which screen this is.
//   closeHref – where the X goes (default: Capture)
function TopBar({ title, closeHref }) {
  return (
    <header className="top-bar">
      <Label as="h1">{title}</Label>
      <CloseButton href={closeHref} />
    </header>
  )
}

export default TopBar
