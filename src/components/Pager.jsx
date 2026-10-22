import { useRef, useState } from 'react'
import './Pager.css'
import Caption from './Caption.jsx'
import TextButton from './TextButton.jsx'

// Pager: a row of full-screen pages you flip through, by swiping or by
// tapping Back / Next. Shows "1 of 9" and a dot for each page.
//
// How the swiping works: the pages sit side by side in a row that scrolls
// sideways. CSS "scroll-snap" makes the row stop exactly on a page, so the
// browser does the swipe feel for us. We only watch where it stopped.
//
// Props:
//   children – one element per page
//   last     – what to show in place of "Next" on the final page,
//              e.g. a TextLink back to the app
function Pager({ children, last }) {
  const track = useRef(null)           // the scrolling row, so we can read and move it
  const [index, setIndex] = useState(0) // which page is showing (0 = first)
  const pages = Array.isArray(children) ? children : [children]
  const count = pages.length

  // The browser tells us when the row scrolls. Page number = how far we
  // scrolled, divided by one page width, rounded to the nearest whole page.
  function handleScroll() {
    const el = track.current
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  // Move to a page. Smooth scrolling is skipped for people who asked their
  // phone for less motion.
  function goTo(page) {
    const el = track.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: page * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="pager">
      <div className="pager__track" ref={track} onScroll={handleScroll}>
        {pages.map((page, i) => (
          <section
            key={i}
            className="pager__page"
            aria-label={`${i + 1} of ${count}`}
          >
            {page}
          </section>
        ))}
      </div>

      <div className="pager__bar">
        {/* Back is hidden on the first page, but keeps its room so nothing jumps. */}
        <div className={index === 0 ? 'pager__back pager__back--hidden' : 'pager__back'}>
          <TextButton onClick={() => goTo(index - 1)}>Back</TextButton>
        </div>

        <div className="pager__where">
          <Caption>{index + 1} of {count}</Caption>
          {/* The dots repeat the same info for the eye; screen readers skip them. */}
          <div className="pager__dots" aria-hidden="true">
            {pages.map((_, i) => (
              <span key={i} className={i === index ? 'pager__dot pager__dot--on' : 'pager__dot'} />
            ))}
          </div>
        </div>

        <div className="pager__next">
          {index === count - 1 ? last : <TextButton onClick={() => goTo(index + 1)}>Next</TextButton>}
        </div>
      </div>
    </div>
  )
}

export default Pager
