// Heading: words that title a screen or a section, in the serif.
//
// Props:
//   children – the words
//   size     – "title" (25px) or "heading" (20px, default)
//   as       – which HTML tag: "h2" (default), "h3", "p"…
//              Pick it for meaning (the outline screen readers use);
//              size sets the look.
function Heading({ children, size = 'heading', as: Tag = 'h2' }) {
  return <Tag className={`type-${size}`}>{children}</Tag>
}

export default Heading
