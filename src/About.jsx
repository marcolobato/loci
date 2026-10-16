// Pattern: About. What Loci is, and the nine ingredients it's built on.
// Open it with ?about in the address, or the "About Loci" link on Capture.
// Everything here is in our own words; nothing is quoted from the book.
import Label from './components/Label.jsx'
import Heading from './components/Heading.jsx'
import Note from './components/Note.jsx'
import Caption from './components/Caption.jsx'
import TextLink from './components/TextLink.jsx'
import Backdrop from './components/Backdrop.jsx'
import granite from './assets/granite-dusk.webp'
import { ingredients } from './ingredients.js'

function About() {
  return (
    <main className="page stack-loose has-backdrop">
      <Backdrop image={granite} cover="screen" />

      <div className="stack-tight">
        <Label as="h1">About Loci</Label>
        <Heading size="title" as="p">Ambient field notes</Heading>
        <div>
          <TextLink href="?">Back to Loci</TextLink>
        </div>
      </div>

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
          The answer it borrows comes from Peter Zumthor’s short book Atmospheres, which grew out of a talk he gave
          about what he weighs when he makes a space. He names nine ingredients of atmosphere. When you write a
          note, Loci looks for words that touch each one and suggests it. You decide what to keep.
        </Note>
        <Note tone="soft">
          Everything stays on this phone. No account, no server, and it works offline.
        </Note>
      </section>

      {/* The nine ingredients. */}
      <section className="stack-normal">
        <Heading>The nine ingredients</Heading>
        <ol className="list stack-normal">
          {ingredients.map((ingredient, index) => (
            <li key={ingredient.id} className="stack-tight">
              <Caption>{String(index + 1).padStart(2, '0')}</Caption>
              <Note>{ingredient.name}</Note>
              <Caption>{ingredient.description}</Caption>
              <Note tone="soft">{ingredient.about}</Note>
            </li>
          ))}
        </ol>
        <Caption>The book adds three more thoughts after the nine. Loci keeps to the nine.</Caption>
      </section>

      {/* Credit, and what this is not. */}
      <section className="stack-tight">
        <Caption>
          Loci is an independent design study. It isn’t affiliated with Peter Zumthor or his publisher. The
          descriptions above are written in our own words.
        </Caption>
        <Caption>The granite texture is AI-generated. Sample captures are labelled Sample.</Caption>
      </section>
    </main>
  )
}

export default About
