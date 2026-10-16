import './Backdrop.css'

// Backdrop: a texture image behind a container's content, under a dark scrim
// so text stays readable. Put it inside a container with class "has-backdrop".
//
// Props:
//   image – the image file, imported from src/assets (Vite turns the import
//           into the right URL).
//   cover – "container" (default): fills its container, e.g. a preview box.
//           "screen": fills the whole screen, edge to edge, for full screens.
//
// aria-hidden: the texture is decoration, so screen readers skip it.
function Backdrop({ image, cover = 'container' }) {
  const className = cover === 'screen' ? 'backdrop backdrop--screen' : 'backdrop'
  // Pass the image to the CSS as a variable; Backdrop.css layers the scrim on top.
  return (
    <div
      className={className}
      style={{ '--backdrop-image': `url(${image})` }}
      aria-hidden="true"
    />
  )
}

export default Backdrop
