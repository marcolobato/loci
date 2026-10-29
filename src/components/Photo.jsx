import './Photo.css'

// Photo: a capture's photo. Full width in a calm 4:3 frame, or a small
// square thumbnail for lists.
//
// Props:
//   src  – the photo (e.g. from photoUrl)
//   alt  – what screen readers say, e.g. "Photo of Pantheon, Rome"
//   size – "full" (default) or "thumb"
function Photo({ src, alt, size = 'full' }) {
  return <img className={size === 'thumb' ? 'photo photo--thumb' : 'photo'} src={src} alt={alt} />
}

export default Photo
