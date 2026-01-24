import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import AnimatedSection from '../components/AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import profilePhoto from '../assets/images/profile/My Photo.jpg'
import { useAge } from '../hooks/useAge'
import { useGithubRepoCount } from '../hooks/useGithubRepoCount'
import { useHeroTitleAnimation } from '../hooks/useHeroTitleAnimation'
import { useImageHoverTimeline } from '../hooks/useImageHoverTimeline'
import '../styles/HeroSection.css'

const BIRTH_DATE_ISO = '1999-09-02'
const BIRTH_DATE = new Date(BIRTH_DATE_ISO)
const BIRTH_DATE_LABEL = BIRTH_DATE_ISO.split('-').join('/')

function HeroHeader({ role, firstPart, lastPart, firstTitleLineRef, secondTitleLineRef }) {
  return (
    <header className="hero__header">
      <p className="hero__eyebrow">{role}</p>
      <h1 className="hero__title">
        <span
          ref={firstTitleLineRef}
          className="hero__title-line hero__title-line--animated"
          data-title={firstPart}
        >
          {firstPart}
        </span>
        {lastPart ? (
          <span
            ref={secondTitleLineRef}
            className="hero__title-line hero__title-line--offset hero__title-line--animated"
            data-title={lastPart}
          >
            {lastPart}
          </span>
        ) : null}
      </h1>
    </header>
  )
}

function HeroActions({ ctas }) {
  return (
    <div className="hero__actions">
      {ctas.map((cta) => {
        const variantClass = cta.variant === 'secondary' ? 'hero__button--ghost' : 'hero__button--solid'

        return (
          <a key={cta.href} className={`hero__button ${variantClass}`} href={cta.href}>
            <span className="hero__button-label">{cta.label}</span>
          </a>
        )
      })}
    </div>
  )
}

function HeroContent({ heroTagline, heroCta }) {
  const ctas = Array.isArray(heroCta) ? heroCta : []

  return (
    <div className="hero__content">
      <p className="hero__lede">{heroTagline}</p>
      <HeroActions ctas={ctas} />
    </div>
  )
}

function HeroVisual({ displayName, age, availabilityNote, refs }) {
  return (
    <aside className="hero__visual">
      <div ref={refs.frame} className="hero__image-frame">
        <img
          ref={refs.image}
          className="hero__image"
          src={profilePhoto}
          alt={`Portrait of ${displayName}`}
          loading="lazy"
        />
        <div ref={refs.overlay} className="hero__image-overlay" />
        <div ref={refs.info} className="hero__image-info">
          <span className="hero__image-info-name">{displayName}</span>
          <span className="hero__image-info-age">
            <span className="hero__image-info-age-value">{age}</span>
            <span className="hero__image-info-age-label">years</span>
          </span>
          <span className="hero__image-info-birthday">Born {BIRTH_DATE_LABEL}</span>
        </div>
      </div>
      {availabilityNote ? (
        <div className="hero__availability">
          <span className="hero__availability-label">Available for collaborations</span>
          <span className="hero__availability-note">{availabilityNote}</span>
        </div>
      ) : null}
    </aside>
  )
}

function HeroStats({ stats, onSelect }) {
  return (
    <ul className="hero__stats">
      {stats.map((stat) => (
        <li key={stat.id || stat.label}>
          <button
            type="button"
            className="hero__stat-card"
            onClick={() => onSelect(stat)}
            aria-haspopup="dialog"
          >
            <span className="hero__stat-value">{stat.value}</span>
            <span className="hero__stat-label">{stat.label}</span>
            <span className="hero__stat-detail">{stat.detail}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function Home() {
  const { name, role, heroTagline, heroCta, stats, contact } = profileContent
  const githubUsername = profileContent.githubUsername || 'ThenukaAnjala'
  const trimmedName = (name || '').trim()
  const displayName = trimmedName || 'THENUKA GUNASEKARA'
  const [firstPart, ...rest] = displayName.split(' ')
  const lastPart = rest.join(' ')
  const availabilityNote = contact?.availability || ''
  const [activeStat, setActiveStat] = useState(null)

  const age = useAge(BIRTH_DATE)
  const repoCount = useGithubRepoCount(githubUsername)
  const depthProgress = 0
  const isHeroCompressed = false

  const firstTitleLineRef = useRef(null)
  const secondTitleLineRef = useRef(null)
  const frameRef = useRef(null)
  const imageRef = useRef(null)
  const overlayRef = useRef(null)
  const infoRef = useRef(null)
  useHeroTitleAnimation(firstTitleLineRef, secondTitleLineRef, displayName)
  useImageHoverTimeline({ frameRef, imageRef, overlayRef, infoRef })

  const statsList = Array.isArray(stats) ? stats : []
  const statsWithRepoCount = useMemo(() => {
    if (!statsList.length) {
      return []
    }

    return statsList.map((stat) => {
      if (stat.id !== 'projects' || repoCount === null) {
        return stat
      }

      return { ...stat, value: `${repoCount}` }
    })
  }, [statsList, repoCount])

  const heroDepthStyle = useMemo(() => {
    const progress = Math.min(Math.max(depthProgress, 0), 1)
    const depthShift = progress * 320
    const translateZ = -depthShift
    const translateY = progress * 24
    const scale = Math.max(1 - progress * 0.06, 0.82)
    const opacity = Math.max(1 - progress * 0.2, 0.6)
    // Interactive planes stay flattened via CSS so CTA hit targets remain accurate while we recede in 3D.

    return {
      '--hero-depth-progress': progress,
      transform: `translate3d(0, ${translateY.toFixed(2)}px, ${translateZ.toFixed(2)}px) scale(${scale.toFixed(3)})`,
      opacity,
    }
  }, [depthProgress])

  useEffect(() => {
    if (!activeStat) {
      document.body.style.removeProperty('overflow')
      return
    }

    document.body.style.setProperty('overflow', 'hidden')
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveStat(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.removeProperty('overflow')
    }
  }, [activeStat])

  const handleStatOpen = (stat) => {
    setActiveStat(stat)
  }

  const handleStatClose = () => {
    setActiveStat(null)
  }

  const modalTitleId = activeStat ? `stat-modal-title-${activeStat.id || 'stat'}` : undefined
  const modalDescId = activeStat ? `stat-modal-desc-${activeStat.id || 'stat'}` : undefined

  return (
    <AnimatedSection id="home" background="light" className="hero" revealOnScroll={false}>
      <div className={`hero__depth ${isHeroCompressed ? 'hero__depth--compressed' : ''}`} style={heroDepthStyle}>
        <div className="hero__layout">
          <HeroHeader
            role={role}
            firstPart={firstPart}
            lastPart={lastPart}
            firstTitleLineRef={firstTitleLineRef}
            secondTitleLineRef={secondTitleLineRef}
          />
          <HeroContent heroTagline={heroTagline} heroCta={heroCta} />
          <HeroVisual
            displayName={displayName}
            age={age}
            availabilityNote={availabilityNote}
            refs={{ frame: frameRef, image: imageRef, overlay: overlayRef, info: infoRef }}
          />
        </div>
        <HeroStats stats={statsWithRepoCount} onSelect={handleStatOpen} />
      </div>

      {activeStat && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="stat-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={modalTitleId}
              aria-describedby={modalDescId}
              onClick={handleStatClose}
            >
              <div className="stat-modal__backdrop" aria-hidden="true" />
              <div className="stat-modal__panel" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="stat-modal__close" onClick={handleStatClose} aria-label="Close details" />
                <div className="stat-modal__content">
                  <p className="stat-modal__label">{activeStat.label}</p>
                  <h3 id={modalTitleId} className="stat-modal__value">
                    {activeStat.value}
                  </h3>
                  <p id={modalDescId} className="stat-modal__detail">
                    {activeStat.detail}
                  </p>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </AnimatedSection>
  )
}

export default Home

