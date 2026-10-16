// Afterglow: a capture's color tells how old it is.
// Warm when new, cooling to blue over a month.
//
// afterglow(minutesAgo) returns:
//   step  – which ramp step: "now", "hour", "day", "week" or "month"
//   color – the matching token, e.g. "var(--afterglow-day)". The colors live
//           only in tokens.css; this file never copies them.
//   label – how long ago, in words, e.g. "3 days ago"
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

// "how long ago" in words, rounded down to the largest whole unit.
// e.g. 90 minutes → "1 hr ago", 8 days → "1 week ago".
function labelFor(minutesAgo) {
  if (minutesAgo < 1) return 'just now'
  if (minutesAgo < HOUR) return `${Math.floor(minutesAgo)} min ago`
  if (minutesAgo < DAY) return `${Math.floor(minutesAgo / HOUR)} hr ago`

  // Bigger units: pick one, then say "1 day" or "2 days".
  const [count, unit] =
    minutesAgo < WEEK ? [Math.floor(minutesAgo / DAY), 'day']
    : minutesAgo < MONTH ? [Math.floor(minutesAgo / WEEK), 'week']
    : [Math.floor(minutesAgo / MONTH), 'month']
  return `${count} ${unit}${count === 1 ? '' : 's'} ago`
}

export function afterglow(minutesAgo) {
  const step = stepFor(minutesAgo)
  return {
    step,
    color: `var(--afterglow-${step})`,
    label: labelFor(minutesAgo),
  }
}
