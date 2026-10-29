import './TextLink.css'

// TextLink: words you tap to go somewhere, e.g. "Your moments".
// Cold light and underlined, so it reads as a link without relying on color.
// At least 48px tall, so it's easy to tap.
//
// Props:
//   href     – where it goes, e.g. "?moments"
//   children – the words
//   inline   – true for a link inside a sentence. It then sits in the line
//              like any other word, instead of standing in its own 48px box,
//              which would push the lines of the paragraph apart. (Links
//              inside a sentence are allowed a smaller tap area.)
//   external – true for a link to another website. It opens in a new tab,
//              so Loci stays where you left it. rel="noopener noreferrer"
//              stops the other site from reaching back into Loci's tab.
function TextLink({ href, children, inline = false, external = false }) {
  const className = inline ? 'text-link text-link--inline' : 'text-link'
  return (
    <a
      className={className}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

export default TextLink
