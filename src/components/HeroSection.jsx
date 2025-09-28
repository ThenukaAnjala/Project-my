import AnimatedSection from './AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import './HeroSection.css'

function HeroSection() {
  const { name, role, heroTagline, heroCta, stats } = profileContent

  return (
    <AnimatedSection id="home" background="dark" className="hero">
      <div className="hero__content">
        <p className="eyebrow">Portfolio concept</p>
        <h1 className="hero__title">
          {name}
          <span className="hero__role">{role}</span>
        </h1>
        <p className="hero__tagline">{heroTagline}</p>
        <div className="hero__actions">
          {heroCta.map((cta) => {
            const variantClass =
              cta.variant === 'secondary' ? 'hero__button--secondary' : 'hero__button--primary'

            return (
              <a key={cta.href} className={`hero__button ${variantClass}`} href={cta.href}>
                {cta.label}
              </a>
            )
          })}
        </div>
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
