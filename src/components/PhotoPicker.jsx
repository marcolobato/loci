import './TextLink.css'
import './TextButton.css'
import './PhotoPicker.css'

// PhotoPicker: "Add a photo". On iPhone it opens the usual menu:
// Take Photo, or choose from the Photo Library.
// It looks like a TextButton. Underneath it's the browser's own file
// picker (hidden), wrapped in a label, so tapping the words opens it.
//
// Props:
//   label    – the words, e.g. "Add a photo" or "Change the photo"
//   onPick   – called with the chosen photo file
function PhotoPicker({ label, onPick }) {
  return (
    <label className="text-link text-button photo-picker">
      {label}
      <input
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onPick(file)
          event.target.value = '' // so choosing the same photo again still works
        }}
      />
    </label>
  )
}

export default PhotoPicker
