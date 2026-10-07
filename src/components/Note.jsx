// Note: the body text style. Field notes, empty states, short explanations.
//
// Props:
//   children – the text
//   tone     – "default" (normal text color) or "soft" (quieter, for empty
//              states and long reading)
function Note({ children, tone = 'default' }) {
  // Add the soft color class only when tone is "soft".
  const className = tone === 'soft' ? 'type-note text-soft' : 'type-note'
  return <p className={className}>{children}</p>
}

export default Note
