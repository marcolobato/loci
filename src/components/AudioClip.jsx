import './AudioClip.css'

// AudioClip: plays back a recorded sound.
// For now it uses the phone's own audio controls (play, pause, scrub),
// which are already accessible and familiar. A custom player with a
// scrubber is its own pattern later ("Playback with scrubber").
//
// Props:
//   src   – the sound to play (e.g. the link from useRecorder)
//   label – what screen readers call the player, e.g. "Your recording"
function AudioClip({ src, label }) {
  return <audio className="audio-clip" src={src} controls aria-label={label} />
}

export default AudioClip
