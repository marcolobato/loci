import './TextLink.css'

// TextLink: words you tap to go somewhere, e.g. "Your moments".
// Cold light and underlined, so it reads as a link without relying on color.
// At least 48px tall, so it's easy to tap.
//
// Props:
//   href     – where it goes, e.g. "?moments"
//   children – the words
function TextLink({ href, children }) {
  return (
    <a className="text-link" href={href}>
      {children}
    </a>
  )
}

export default TextLink
