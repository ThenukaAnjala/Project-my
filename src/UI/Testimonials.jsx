import AnimatedSection from '../components/AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import '../styles/Testimonials.css'

function Testimonials() {
  const { testimonials } = profileContent

  if (!testimonials?.length) return null

  return (
    <AnimatedSection id="testimonials" background="dark">
      <div className="section__header">
        <p className="eyebrow">Testimonials</p>
        <h2>Partners who trust the process</h2>
      </div>
      <div className="testimonials">
        {testimonials.map((testimonial) => (
          <blockquote key={testimonial.name} className="testimonial">
            <p className="testimonial__quote">{testimonial.quote}</p>
            <footer className="testimonial__meta">
              <span className="testimonial__name">{testimonial.name}</span>
              <span className="testimonial__title">{testimonial.title}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default Testimonials

