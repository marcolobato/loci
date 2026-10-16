// Icon: a small SVG picture. Size comes from --size-icon; color comes from
// the text color around it (currentColor), so the parent decides the color.
//
// Props:
//   name – which icon to draw. Add new icons to the list below.
//
// aria-hidden: icons are pictures of something already named in text or in
// a button's label, so screen readers skip them.

// Each icon is the inside of a 24 x 24 drawing box.
const icons = {
  record: <circle cx="12" cy="12" r="10" fill="currentColor" />,
  // A circle with "!": something needs attention.
  warning: (
    <>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.25" fill="currentColor" />
    </>
  ),
}

function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

export default Icon
