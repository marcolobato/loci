// Afterglow: a capture's color tells how old it is.
// Warm when new, cooling to blue over a month.
//
// afterglow(minutesAgo, now) returns:
//   step  – which ramp step: "now", "hour", "day", "week" or "month"
//   color – the matching token, e.g. "var(--afterglow-day)". The colors live
//           only in tokens.css; this file never copies them.
//   label – when it was captured, in words: "5 min ago" for the last day,
//           then "Yesterday · 6:42 PM", "Tue · 6:42 PM", "Oct 4 · 6:42 PM"
//   iso   – the exact capture time, for <time dateTime="…">
//
// "now" is optional (it defaults to the current time); passing a fixed time
// makes the result easy to test.
//
// The color follows the age steps; the label follows date conventions.
// They are worked out separately, so either can change without the other.
//
// Later, "age" could mean "last opened" instead of "captured" (see SHELF.md).
// Only the number passed in would change; this file would stay the same.

// Time spans, in minutes.
const HOUR = 60
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY

// Which ramp step a capture is on. Each step starts where the last one ends:
// under 1 hour = now, under 1 day = hour, under 1 week = day,
// under 1 month = week, 1 month or more = month.
function stepFor(minutesAgo) {
  if (minutesAgo < HOUR) return 'now'
  if (minutesAgo < DAY) return 'hour'
  if (minutesAgo < WEEK) return 'day'
  if (minutesAgo < MONTH) return 'week'
  return 'month'
}

// Date and time formats. "undefined" means "use the phone's language and
// region", so a UK phone shows "4 Oct" and 18:42, a US phone "Oct 4" and 6:42 PM.
const timeOfDay = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const monthDay = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const monthDayYear = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

// How many calendar days apart two moments are (midnight to midnight),
// e.g. 11 PM Monday and 8 AM Wednesday are 2 days apart, not 1.
// Math.round absorbs the hour lost or gained when clocks change.
function calendarDaysBetween(earlier, later) {
  const midnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((midnight(later) - midnight(earlier)) / msPerDay)
}

// When it was captured, in words.
// Under a day: relative ("12 min ago"), because that is what afterglow is about.
// A day or more: the day and the time of day, because people remember places
// by when they were there, and for Loci the hour is part of the mood.
function labelFor(minutesAgo, capturedAt, now) {
  if (minutesAgo < 1) return 'Just now'
  if (minutesAgo < HOUR) return `${Math.floor(minutesAgo)} min ago`
  if (minutesAgo < DAY) return `${Math.floor(minutesAgo / HOUR)} hr ago`

  const days = calendarDaysBetween(capturedAt, now)
  let day
  if (days === 1) day = 'Yesterday'
  else if (days <= 6) day = weekday.format(capturedAt)   // stops at 6, so "Tue" never means last week's Tue
  else if (capturedAt.getFullYear() === now.getFullYear()) day = monthDay.format(capturedAt)
  else day = monthDayYear.format(capturedAt)              // year only when it isn't this year

  return `${day} · ${timeOfDay.format(capturedAt)}`
}

export function afterglow(minutesAgo, now = new Date()) {
  const step = stepFor(minutesAgo)
  // The capture time, worked out from its age. Sample captures only store
  // "minutes ago"; real captures will later pass their own time in.
  const capturedAt = new Date(now.getTime() - minutesAgo * 60 * 1000)
  return {
    step,
    color: `var(--afterglow-${step})`,
    label: labelFor(minutesAgo, capturedAt, now),
    iso: capturedAt.toISOString(),
  }
}
