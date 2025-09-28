import AnimatedSection from './AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import '../styles/ContactSection.css'

function ContactSection() {
  const { contact } = profileContent

  return (
    <AnimatedSection id="contact" background="light">
      <div className="section__header">
        <p className="eyebrow">Contact</p>
        <h2>Let\'s build something polished together</h2>
        <p className="section__description">Send a note with project goals, timelines, and vision. I\'ll reply within two business days.</p>
      </div>
      <div className="contact">
        <div className="contact__details">
          <p className="contact__availability">{contact.availability}</p>
          <a className="contact__email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <ul className="contact__socials">
            {contact.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <form className="contact__form" aria-label="Contact form concept">
          <div className="field-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" placeholder="How should I address you?" />
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Where can I reach you?" />
          </div>
          <div className="field-group">
            <label htmlFor="message">Project details</label>
            <textarea id="message" name="message" rows="4" placeholder="Timeline, goals, budget..." />
          </div>
          <button className="contact__button" type="submit">
            Send message
          </button>
        </form>
      </div>
    </AnimatedSection>
  )
}

export default ContactSection

