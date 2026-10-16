// useRecorder: records up to 10 seconds of sound from the microphone.
// Pattern: record audio (10 s) with clear state.
//
// A screen calls it and gets back:
//   status      – "idle", "asking" (waiting for microphone permission),
//                 "recording", "done" or "error"
//   error       – when status is "error": "blocked" (permission denied),
//                 "no-mic" (no microphone found), "unsupported" (this browser
//                 can't record) or "failed" (anything else)
//   secondsLeft – countdown while recording, 10 → 0
//   audioUrl    – when done: a link to the recording, for a player
//   recordedSeconds – when done: how long it really was (less if stopped early)
//   start()     – ask for the microphone and start recording
//   stop()      – stop early; otherwise it stops by itself at 10 s
//
// The recording lives only in memory for now. A reload clears it.
// Saving it (IndexedDB) is the next pattern.
import { useEffect, useRef, useState } from 'react'

const RECORD_SECONDS = 10

// Phones save sound in different formats: iPhone uses mp4, Chrome uses webm.
// Pick the first one this browser can record. "" lets the browser choose.
function pickFormat() {
  const formats = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']
  return formats.find((format) => MediaRecorder.isTypeSupported(format)) ?? ''
}

// Turn the browser's error into one of our plain error names.
function errorName(err) {
  if (err?.name === 'NotAllowedError' || err?.name === 'SecurityError') return 'blocked'
  if (err?.name === 'NotFoundError' || err?.name === 'OverconstrainedError') return 'no-mic'
  return 'failed'
}

export function useRecorder() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(RECORD_SECONDS)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordedSeconds, setRecordedSeconds] = useState(0)

  // Things that must survive between renders but don't change what's drawn.
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const timersRef = useRef([])

  // Switch the microphone off, so the phone's mic indicator goes away.
  function releaseMic() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  // clearTimeout clears intervals too: browsers keep both in one list.
  function clearTimers() {
    timersRef.current.forEach((id) => clearTimeout(id))
    timersRef.current = []
  }

  async function start() {
    if (status === 'asking' || status === 'recording') return

    // Older browsers, or a page that isn't https://, can't record at all.
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('unsupported')
      setStatus('error')
      return
    }

    // Starting again: let go of the last recording (its memory is freed below).
    setAudioUrl(null)
    setError(null)
    setSecondsLeft(RECORD_SECONDS)
    setStatus('asking')

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (err) {
      setError(errorName(err))
      setStatus('error')
      return
    }
    streamRef.current = stream

    const format = pickFormat()
    const recorder = new MediaRecorder(stream, format ? { mimeType: format } : undefined)
    recorderRef.current = recorder
    const chunks = []

    // The recorder hands over sound in pieces; collect them.
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }

    // When it stops (by itself or early), join the pieces into one file.
    recorder.onstop = () => {
      clearTimers()
      releaseMic()
      const blob = new Blob(chunks, { type: recorder.mimeType || format })
      setAudioUrl(URL.createObjectURL(blob))
      setRecordedSeconds(Math.min(RECORD_SECONDS, Math.round((Date.now() - startedAt) / 1000)))
      setSecondsLeft(0)
      setStatus('done')
    }

    const startedAt = Date.now()
    recorder.start()
    setStatus('recording')

    // Countdown, checked 4 times a second so it never looks stuck.
    const tick = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000
      setSecondsLeft(Math.max(0, Math.ceil(RECORD_SECONDS - elapsed)))
    }, 250)
    // Stop by itself at 10 seconds.
    const limit = setTimeout(() => stop(), RECORD_SECONDS * 1000)
    timersRef.current = [tick, limit]
  }

  function stop() {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  // If the screen goes away mid-recording, switch everything off.
  useEffect(() => {
    return () => {
      clearTimers()
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      releaseMic()
    }
  }, [])

  // When a recording is replaced or the screen goes away, free its memory.
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  return { status, error, secondsLeft, audioUrl, recordedSeconds, start, stop }
}
