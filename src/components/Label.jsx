// Label: small mono caps text. Screen names, section names, tags.
//
// Props:
//   children – the text
//   as       – which HTML tag to use (default "p"). Use "h1" for a screen's
//              name, so screen readers know what page they are on. The look
//              stays the same; only the meaning changes.
function Label({ children, as: Tag = 'p' }) {
  return <Tag className="type-label">{children}</Tag>
}

export default Label
