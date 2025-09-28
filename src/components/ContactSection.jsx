import AnimatedSection from './AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import '../styles/ContactSection.css'

function ContactSection() {
  const { contact, location } = profileContent

  return (
    <AnimatedSection id="contact" background="light" className="contact-section">
      <div className="contact-section__backdrop" aria-hidden="true">
        <span className="contact-section__gradient contact-section__gradient--primary" />
        <span className="contact-section__gradient contact-section__gradient--accent" />
        <span className="contact-section__grid contact-section__grid--horizontal" />
        <span className="contact-section__grid contact-section__grid--vertical" />
      </div>
      <div className="contact-section__content">
        <div className="contact-section__lead">
          <span className="contact-section__eyebrow">Let's collaborate</span>
          <h2 className="contact-section__title">Let's build something polished together</h2>
          <p className="contact-section__description">
            Send a note with project goals, timelines, and vision. I'll reply within two business days so we can
            align on scope, deliverables, and next steps.
          </p>
          <div className="contact-section__actions">
            <a className="contact-section__cta" href={`mailto:${contact.email}`}>
              Start the conversation
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="contact-section__cta-icon"
                focusable="false"
              >
                <path d="M5 10h8.5m0 0L11 7.5m2.5 2.5L11 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
            <div className="contact-section__availability" aria-live="polite">
              <span className="contact-section__pulse" aria-hidden="true" />
              <span>{contact.availability}</span>
            </div>
          </div>
          <ul className="contact-section__socials">
            {contact.socials.map((social, index) => (
              <li key={social.label} style={{ animationDelay: `${index * 120}ms` }}>
                <a href={social.href} target="_blank" rel="noreferrer" className="contact-section__social-chip">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="contact-section__panel">
          <div className="contact-section__panel-glow" aria-hidden="true" />
          <div className="contact-section__panel-content">
            <div className="contact-section__panel-heading">
              <p className="contact-section__panel-title">Project kickoff brief</p>
              <span className="contact-section__panel-caption">Replies within 48 hours</span>
            </div>
            <form className="contact-section__form" aria-label="Contact form concept">
              <div className="contact-section__field contact-section__field--split">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="How should I address you?" />
              </div>
              <div className="contact-section__field contact-section__field--split">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="Where can I reach you?" />
              </div>
              <div className="contact-section__field">
                <label htmlFor="message">Project details</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Share context, timelines, milestones, or key goals."
                />
              </div>
              <button className="contact-section__submit" type="submit">
                Send message
              </button>
            </form>
          </div>
          <span className="contact-section__badge contact-section__badge--top" aria-hidden="true">
            Based in {location}
          </span>
          <span className="contact-section__badge contact-section__badge--bottom" aria-hidden="true">
            Remote-friendly collaborations
          </span>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default ContactSection
