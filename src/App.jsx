// Pattern: type scale in use.
// Shows every type style with its name and one line of Loci text.
// The lines are sample text, not real captures, so the page says "Sample".

// One entry per style. "className" matches a class in index.css.
const styles = [
  { name: 'Display', className: 'type-display', text: 'Granite at dusk' },
  { name: 'Title', className: 'type-title', text: 'Granite wall, east side' },
  { name: 'Heading', className: 'type-heading', text: 'Low sun, cold wind, a train far off' },
  { name: 'Note', className: 'type-note', text: 'The wall has been here for a century. The light on it, four minutes. A train somewhere below.' },
  { name: 'Moment', className: 'type-moment', text: 'last light, still warm' },
  { name: 'Caption', className: 'type-caption', text: '6:42 PM · 41.38° N · wind 14 km/h' },
  { name: 'Label', className: 'type-label', text: 'Loci · ambient field notes' },
]

function App() {
  return (
    <main>
      <p className="type-label">Type scale · Sample</p>

      {/* For each style: its name (as a caption), then the sample line in that style. */}
      {styles.map((style) => (
        <section key={style.name}>
          <p className="type-caption">{style.name}</p>
          <p className={style.className}>{style.text}</p>
        </section>
      ))}
    </main>
  )
}

export default App
