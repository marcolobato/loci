// Pattern: Intro. The nine ingredients, one per screen, flipped through
// by swiping or tapping Next. (Drawings come next.)
// Open it with ?intro in the address. (The splash is not here: it sits on
// top of Capture, see Splash.jsx and App.jsx.)
import Backdrop from './components/Backdrop.jsx'
import Pager from './components/Pager.jsx'
import Caption from './components/Caption.jsx'
import Heading from './components/Heading.jsx'
import Note from './components/Note.jsx'
import TextLink from './components/TextLink.jsx'
import granite from './assets/granite-dusk.webp'
import { ingredients } from './ingredients.js'

function Intro() {
  return (
    <main className="has-backdrop">
      <Backdrop image={granite} cover="screen" />

      {/* One page per ingredient. The words come from ingredients.js, the same as About. */}
      <Pager last={<TextLink href="?">Back to Loci</TextLink>}>
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id} className="stack-normal">
            <Caption>{String(index + 1).padStart(2, '0')}</Caption>
            <Heading size="title">{ingredient.name}</Heading>
            <Caption>{ingredient.description}</Caption>
            <Note tone="soft">{ingredient.about}</Note>
          </div>
        ))}
      </Pager>
    </main>
  )
}

export default Intro
