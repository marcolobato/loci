// Pattern: The nine ingredients. Zumthor's nine qualities of atmosphere, one
// per screen, flipped through by swiping or tapping Next. (Drawings come next.)
// Open it with ?ingredients in the address, or the "The nine ingredients"
// link on Capture and About. The words are our own, not quotes.
import Backdrop from './components/Backdrop.jsx'
import Pager from './components/Pager.jsx'
import CloseButton from './components/CloseButton.jsx'
import Caption from './components/Caption.jsx'
import Heading from './components/Heading.jsx'
import Note from './components/Note.jsx'
import TextLink from './components/TextLink.jsx'
import granite from './assets/granite-dusk.webp'
import { ingredients } from './ingredients.js'

function Ingredients() {
  return (
    <main className="has-backdrop">
      <Backdrop image={granite} cover="screen" />

      {/* One page per ingredient. The words come from ingredients.js, the same as the suggestions on each moment. */}
      {/* top: the close button stays put while the pages swipe, so there's a way out on every page. */}
      <Pager top={<CloseButton />} last={<TextLink href="?">Back to Loci</TextLink>}>
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id} className="stack-normal">
            <Caption>{String(index + 1).padStart(2, '0')}</Caption>
            <Heading size="title">{ingredient.name}</Heading>
            <Caption>{ingredient.description}</Caption>
            <Note tone="soft">{ingredient.about}</Note>
            {/* Only on the ninth page: what the book does after the nine. */}
            {index === ingredients.length - 1 && (
              <Caption>The book adds three more thoughts after the nine. Loci keeps to the nine.</Caption>
            )}
          </div>
        ))}
      </Pager>
    </main>
  )
}

export default Ingredients
