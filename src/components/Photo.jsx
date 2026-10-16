import './Photo.css'

// Photo: a capture's photo, full width, in a calm 4:3 frame.
//
// Props:
//   src – the photo (e.g. from photoUrl)
//   alt – what screen readers say, e.g. "Photo of Pantheon, Rome"
function Photo({ src, alt }) {
  return <img className="photo" src={src} alt={alt} />
}

export default Photo
