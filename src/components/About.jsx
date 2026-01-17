import AnimatedSection from './AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import '../styles/AboutSection.css'

function About() {
  const { about } = profileContent

  return (
    <AnimatedSection id="about" background="light" className="about-section">
      <div className="about-section__depth">
        <div className="section__header">
          <p className="eyebrow">About</p>
          <h2>Designing thoughtful interfaces with measurable impact</h2>
        </div>
        <div className="about__layout">
          <div className="about__story">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <ul className="about__highlights">
            {about.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default About

