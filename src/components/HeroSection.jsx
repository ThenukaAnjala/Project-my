import { useEffect, useRef, useState } from 'react'
import AnimatedSection from './AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import profilePhoto from '../assets/images/profile/My Photo.jpg'
import '../styles/HeroSection.css'

const BIRTH_DATE_ISO = '1999-09-02'
const BIRTH_DATE = new Date(BIRTH_DATE_ISO)

const calculateAge = (referenceDate) => {
  const now = referenceDate
  let age = now.getFullYear() - BIRTH_DATE.getFullYear()

  const hasHadBirthdayThisYear =
    now.getMonth() > BIRTH_DATE.getMonth() ||
    (now.getMonth() === BIRTH_DATE.getMonth() && now.getDate() >= BIRTH_DATE.getDate())

  if (!hasHadBirthdayThisYear) {
    age -= 1
  }

  return age
}

function HeroSection() {
  const { name, role, heroTagline, heroCta, stats, contact } = profileContent
  const trimmedName = (name || '').trim()
  const [firstPart, ...rest] = trimmedName.split(' ')
  const lastPart = rest.join(' ')
  const availabilityNote = contact?.availability || ''
  const displayName = trimmedName || 'THENUKA GUNASEKARA'

  const [age, setAge] = useState(() => calculateAge(new Date()))

  const frameRef = useRef(null)
  const imageRef = useRef(null)
  const overlayRef = useRef(null)
  const infoRef = useRef(null)

  useEffect(() => {
    const updateAge = () => setAge(calculateAge(new Date()))

    updateAge()

    const dailyIntervalMs = 1000 * 60 * 60 * 24
    const intervalId = window.setInterval(updateAge, dailyIntervalMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const frameEl = frameRef.current
    const imageEl = imageRef.current
    const overlayEl = overlayRef.current
    const infoEl = infoRef.current

    if (!frameEl || !imageEl || !overlayEl || !infoEl) {
      return undefined
    }

    const ensureTimeline = () => {
      if (frameEl._hoverTimeline) {
        return frameEl._hoverTimeline
      }

      const easingIn = 'cubic-bezier(0.33, 1, 0.68, 1)'
      const easingInfo = 'cubic-bezier(0.16, 1, 0.3, 1)'

      const imageAnimation = imageEl.animate(
        [
          { transform: 'scale(1)', filter: 'saturate(0.82) contrast(1)' },
          { transform: 'scale(1.06)', filter: 'saturate(1.15) contrast(1.08)' },
        ],
        { duration: 620, fill: 'forwards', easing: easingIn }
      )

      const overlayAnimation = overlayEl.animate(
        [
          { opacity: 0.72, transform: 'translateY(0%)' },
          { opacity: 0.25, transform: 'translateY(8%)' },
        ],
        { duration: 520, fill: 'forwards', easing: easingIn }
      )

      const infoAnimation = infoEl.animate(
        [
          { transform: 'translateY(18%)', opacity: 0 },
          { transform: 'translateY(0%)', opacity: 1 },
        ],
        { duration: 480, delay: 120, fill: 'forwards', easing: easingInfo }
      )

      const animations = [imageAnimation, overlayAnimation, infoAnimation]

      animations.forEach((animation) => {
        animation.pause()
        animation.currentTime = 0
      })

      const timeline = {
        animations,
        play() {
          animations.forEach((animation) => {
            animation.playbackRate = 1
            animation.play()
          })
        },
        reverse() {
          animations.forEach((animation) => {
            const timing = animation.effect?.getTiming?.()
            if (animation.playState === 'idle' && timing && typeof timing.duration === 'number') {
              animation.currentTime = timing.duration
            }
            animation.playbackRate = 1.75
            animation.reverse()
          })
        },
        cancel() {
          animations.forEach((animation) => {
            animation.cancel()
          })
        },
      }

      frameEl._hoverTimeline = timeline
      return timeline
    }

    const handlePointerEnter = () => {
      const timeline = ensureTimeline()
      timeline.play()
    }

    const handlePointerLeave = () => {
      const timeline = frameEl._hoverTimeline
      if (!timeline) {
        return
      }
      timeline.reverse()
    }

    frameEl.addEventListener('pointerenter', handlePointerEnter)
    frameEl.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      frameEl.removeEventListener('pointerenter', handlePointerEnter)
      frameEl.removeEventListener('pointerleave', handlePointerLeave)
      if (frameEl._hoverTimeline) {
        frameEl._hoverTimeline.cancel()
        delete frameEl._hoverTimeline
      }
    }
  }, [])

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

        <aside className="hero__visual">
          <div ref={frameRef} className="hero__image-frame">
            <img ref={imageRef} className="hero__image" src={profilePhoto} alt="Portrait of Thenuka Gunasekara" loading="lazy" />
            <div ref={overlayRef} className="hero__image-overlay" />
            <div ref={infoRef} className="hero__image-info">
              <span className="hero__image-info-name">{displayName}</span>
              <span className="hero__image-info-age">
                <span className="hero__image-info-age-value">{age}</span>
                <span className="hero__image-info-age-label">years</span>
              </span>
              <span className="hero__image-info-birthday">Born {BIRTH_DATE_ISO.split('-').join('/')}</span>
            </div>
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
