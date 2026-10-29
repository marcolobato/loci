// Pattern: About. What Loci is. The nine ingredients it's built on have their
// own screens (see Ingredients.jsx), linked from the text here.
// Open it with ?about in the address, or the "About Loci" link on Capture.
// The top bar (title and X) stays put; only the text below it scrolls.
// Everything here is in our own words; nothing is quoted from the book.
import './About.css'
import TopBar from './components/TopBar.jsx'
import Heading from './components/Heading.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import TextLink from './components/TextLink.jsx'
import Backdrop from './components/Backdrop.jsx'
import granite from './assets/granite-dusk.webp'

function About() {
  return (
    <main className="about has-backdrop">
      <Backdrop image={granite} cover="screen" />

      {/* Pinned: the screen's name and the way out. */}
      <TopBar title="About Loci" />

      {/* Scrolls: everything else. */}
      <div className="about__body">
        <div className="stack-loose">
          <Heading size="title" as="p">Ambient field notes</Heading>

          {/* What Loci is. */}
          <section className="stack-normal">
            <Note>
              Loci (LOH-sigh) is Latin for “places,” as in genius loci, the spirit of a place. It’s a small app for
              keeping how a place feels: a photo, ten seconds of sound, and a short note.
            </Note>
            <Note>
              It’s a sample app: a design study in capturing and replaying moments, built around one question: what
              makes a place feel the way it does?
            </Note>
            <Note>
              {/* To check against the book: where the talk was given, and to whom. */}
              {/* The book's page at its publisher (De Gruyter Brill, who publish Birkhäuser). */}
              The answer it borrows comes from Peter Zumthor’s short book{' '}
              <TextLink inline external href="https://www.degruyterbrill.com/document/isbn/9783764374952/html">
                Atmospheres
              </TextLink>
              , which grew out of a talk he gave
              about what he weighs when he makes a space. He names nine ingredients of atmosphere. When you write a
              note, Loci looks for words that touch each one and suggests it. You decide what to keep.
            </Note>
            {/* The way into the nine ingredients: right after the text that mentions them. */}
            <div>
              <TextLink href="?ingredients">Read the nine ingredients</TextLink>
            </div>
            <Note tone="soft">
              Everything stays on this phone. No account, no server, and it works offline.
            </Note>
          </section>

          {/* Credit, and what this is not. */}
          <section className="stack-tight">
            <Caption>
              Loci is an independent design study. It isn’t affiliated with Peter Zumthor or his publisher. The
              descriptions of the nine ingredients are written in our own words.
            </Caption>
            <Caption>The granite texture is AI-generated. Sample captures are labelled Sample.</Caption>
          </section>
        </div>
      </div>
    </main>
  )
}

export default About
