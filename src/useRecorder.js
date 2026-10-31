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
//   level       – while recording: how loud the room is now, 0 (silent) to 1 (loud)
//   isQuiet     – while recording: true once it has stayed very quiet for 3 s
//   start()     – ask for the microphone and start recording
//   stop()      – stop early; otherwise it stops by itself at 10 s
//
// Option:
//   onRecorded(file, seconds, loudness) – called once when a recording
//                               finishes, with the sound file, so the screen
//                               can save it. loudness is how loud the room
//                               was on average, 0 to 1 (null if it couldn't
//                               be measured).
import { useEffect, useRef, useState } from 'react'

const RECORD_SECONDS = 10
const METER_EVERY_MS = 66        // check the loudness about 15 times a second
const QUIET_LEVEL = 0.15         // below this counts as "very quiet"
const QUIET_FOR_MS = 3000        // ...for this long before isQuiet turns on

// How loud a slice of sound is, as 0..1. "RMS" is the average strength of
// the sound wave. Its square root matches how loud things feel better than
// the raw number does, so a quiet room reads low and a clap reads high.
function loudness(samples) {
  let sum = 0
  for (const s of samples) sum += s * s
  const rms = Math.sqrt(sum / samples.length)
  return Math.min(1, Math.sqrt(rms) * 2)
}

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

export function useRecorder({ onRecorded } = {}) {
  // Keep the latest onRecorded in a ref, so a recording that started before
  // the screen re-drew still calls the current version.
  const onRecordedRef = useRef(onRecorded)
  onRecordedRef.current = onRecorded

  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(RECORD_SECONDS)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordedSeconds, setRecordedSeconds] = useState(0)
  const [level, setLevel] = useState(0)
  const [isQuiet, setIsQuiet] = useState(false)

  // Things that must survive between renders but don't change what's drawn.
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const timersRef = useRef([])
  const audioRef = useRef(null)   // the Web Audio context that measures loudness

  // Switch the microphone off, so the phone's mic indicator goes away,
  // and stop measuring loudness.
  function releaseMic() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    audioRef.current?.close().catch(() => {})
    audioRef.current = null
    setLevel(0)
    setIsQuiet(false)
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

    // iPhone only allows listening to sound if it starts during a tap, so
    // create the loudness meter now, before waiting for the permission.
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    audioRef.current = AudioCtx ? new AudioCtx() : null

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (err) {
      releaseMic()
      setError(errorName(err))
      setStatus('error')
      return
    }
    streamRef.current = stream

    const format = pickFormat()
    const recorder = new MediaRecorder(stream, format ? { mimeType: format } : undefined)
    recorderRef.current = recorder
    const chunks = []
    // A running total of every loudness reading, for the average at the end.
    let levelSum = 0
    let levelCount = 0

    // The recorder hands over sound in pieces; collect them.
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }

    // When it stops (by itself or early), join the pieces into one file.
    recorder.onstop = () => {
      clearTimers()
      releaseMic()
      const blob = new Blob(chunks, { type: recorder.mimeType || format })
      const seconds = Math.min(RECORD_SECONDS, Math.round((Date.now() - startedAt) / 1000))
      setAudioUrl(URL.createObjectURL(blob))
      setRecordedSeconds(seconds)
      setSecondsLeft(0)
      setStatus('done')
      const averageLoudness = levelCount > 0 ? levelSum / levelCount : null
      onRecordedRef.current?.(blob, seconds, averageLoudness)
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

    // Loudness: feed the microphone into an "analyser" that hands back the
    // latest slice of the sound wave whenever we ask.
    const ctx = audioRef.current
    if (ctx) {
      ctx.resume().catch(() => {})
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      ctx.createMediaStreamSource(stream).connect(analyser)
      const samples = new Float32Array(analyser.fftSize)
      let shown = 0
      let quietMs = 0
      const meter = setInterval(() => {
        analyser.getFloatTimeDomainData(samples)
        const now = loudness(samples)
        levelSum += now
        levelCount += 1
        // Only redraw when it changed enough to see.
        if (Math.abs(now - shown) > 0.02) {
          shown = now
          setLevel(now)
        }
        quietMs = now < QUIET_LEVEL ? quietMs + METER_EVERY_MS : 0
        setIsQuiet(quietMs >= QUIET_FOR_MS)
      }, METER_EVERY_MS)
      timersRef.current.push(meter)
    }
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

  return { status, error, secondsLeft, audioUrl, recordedSeconds, level, isQuiet, start, stop }
}
