import AnimatedSection from './AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import '../styles/HeroSection.css'

function HeroSection() {
  const { name, role, heroTagline, heroCta, stats, contact } = profileContent
  const [firstPart, ...rest] = name.split(' ')
  const lastPart = rest.join(' ')
  const availabilityNote = contact?.availability || ''

  return (
    <AnimatedSection id="home" background="light" className="hero">
      <div className="hero__layout">
        <header className="hero__header">
          <p className="hero__eyebrow">{role}</p>
          <h1 className="hero__title">
            <span className="hero__title-line">{firstPart}</span>
            {lastPart ? <span className="hero__title-line hero__title-line--offset">{lastPart}</span> : null}
          </h1>
        </header>

        <div className="hero__content">
          <p className="hero__lede">{heroTagline}</p>
          <div className="hero__actions">
            {heroCta.map((cta) => {
              const variantClass =
                cta.variant === 'secondary' ? 'hero__button--ghost' : 'hero__button--solid'

              return (
                <a key={cta.href} className={`hero__button ${variantClass}`} href={cta.href}>
                  {cta.label}
                </a>
              )
            })}
          </div>
        </div>

        <aside className="hero__visual" aria-hidden="true">
          <div className="hero__image-frame">
            <div className="hero__image-block" />
          </div>
          {availabilityNote ? (
            <div className="hero__availability">
              <span className="hero__availability-label">Available for collaborations</span>
              <span className="hero__availability-note">{availabilityNote}</span>
            </div>
          ) : null}
        </aside>
      </div>

      <ul className="hero__stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <span className="hero__stat-value">{stat.value}</span>
            <span className="hero__stat-label">{stat.label}</span>
            <span className="hero__stat-detail">{stat.detail}</span>
          </li>
        ))}
      </ul>
    </AnimatedSection>
  )
}

export default HeroSection
