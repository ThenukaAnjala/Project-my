import AnimatedSection from '../components/AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import '../styles/StackShowcase.css'

function Stack() {
  const { stack } = profileContent

  return (
    <AnimatedSection id="stack" background="dark" className="stack-showcase">
      <div className="section__header">
        <p className="eyebrow">Stack</p>
        <h2>Stacked for motion-rich, production-ready products</h2>
        <p className="section__description">
          Break complex journeys into component systems with reliable tooling, rapid iteration, and graceful transitions.
        </p>
      </div>
      <div className="stack">
        {stack.map((group) => (
          <article key={group.id} className="stack__card">
            <div className="stack__card-header">
              <span className="stack__badge">{group.title}</span>
              <p>{group.description}</p>
            </div>
            <ul className="stack__list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default Stack

