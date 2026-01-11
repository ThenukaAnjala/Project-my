import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react'
import AnimatedSection from './AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import profilePhoto from '../assets/images/profile/My Photo.jpg'
import '../styles/HeroSection.css'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

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
  const githubUsername = profileContent.githubUsername || 'ThenukaAnjala'
  const trimmedName = (name || '').trim()
  const displayName = trimmedName || 'THENUKA GUNASEKARA'
  const [firstPart, ...rest] = displayName.split(' ')
  const lastPart = rest.join(' ')
  const availabilityNote = contact?.availability || ''

  const [age, setAge] = useState(() => calculateAge(new Date()))
  const [repoCount, setRepoCount] = useState(null)
  const [depthProgress, setDepthProgress] = useState(0)
  const [isHeroCompressed, setIsHeroCompressed] = useState(false)
  const depthProgressRef = useRef(0)
  const compressedStateRef = useRef(false)
  const heroDepthRef = useRef(null)

  const firstTitleLineRef = useRef(null)
  const secondTitleLineRef = useRef(null)
  const frameRef = useRef(null)
  const imageRef = useRef(null)
  const overlayRef = useRef(null)
  const infoRef = useRef(null)

  useIsomorphicLayoutEffect(() => {
    const lines = [firstTitleLineRef.current, secondTitleLineRef.current].filter(Boolean)
    if (!lines.length) {
      return undefined
    }

    const motionQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (motionQuery?.matches) {
      lines.forEach((line) => {
        line.style.removeProperty('opacity')
        line.style.removeProperty('transform')
      })
      return undefined
    }

    const easing = 'cubic-bezier(0.25, 1, 0.5, 1)'

    lines.forEach((line) => {
      line.style.opacity = '0'
      line.style.transform = 'translateY(32px)'
    })

    const animations = lines.map((line, index) =>
      line.animate(
        [
          { transform: 'translateY(32px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        {
          duration: 640,
          delay: index * 140,
          easing,
          fill: 'forwards',
        }
      )
    )

    return () => {
      animations.forEach((animation) => animation.cancel())
      lines.forEach((line) => {
        line.style.removeProperty('opacity')
        line.style.removeProperty('transform')
      })
    }
  }, [displayName])

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
    if (!githubUsername) {
      return undefined
    }

    const controller = new AbortController()
    let isMounted = true
    const privateReposOverride = Number(import.meta.env.VITE_GITHUB_PRIVATE_REPOS)
    const hasPrivateOverride = Number.isFinite(privateReposOverride)
    const headers = { Accept: 'application/vnd.github+json' }
    const fallbackUrl = `https://api.github.com/users/${githubUsername}`

    const fetchRepoCount = async () => {
      let total = null

      try {
        const response = await fetch('/api/github-repo-count', { signal: controller.signal })
        if (response.ok) {
          const data = await response.json()
          const apiTotal = Number(data?.totalCount)
          if (Number.isFinite(apiTotal)) {
            total = apiTotal
          }
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }
      }

      if (total === null) {
        try {
          const response = await fetch(fallbackUrl, { headers, signal: controller.signal })
          if (!response.ok) {
            throw new Error(`GitHub request failed with status ${response.status}`)
          }
          const data = await response.json()
          const publicRepos = Number(data.public_repos)

          if (Number.isFinite(publicRepos)) {
            const privateRepos = hasPrivateOverride ? privateReposOverride : 0
            total = publicRepos + (Number.isFinite(privateRepos) ? privateRepos : 0)
          }
        } catch (error) {
          if (controller.signal.aborted) {
            return
          }
        }
      }

      if (!isMounted || controller.signal.aborted) {
        return
      }

      setRepoCount(total)
    }

    fetchRepoCount()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [githubUsername])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const heroSection = document.getElementById('home')
    if (!heroSection) {
      document.documentElement.style.removeProperty('--hero-recede-progress')
      return undefined
    }

    const rootEl = document.documentElement
    const setGlobalProgress = (value) => {
      const clamped = Math.min(Math.max(value, 0), 1)
      rootEl.style.setProperty('--hero-recede-progress', clamped.toFixed(3))
    }

    const clearGlobalProgress = () => {
      rootEl.style.removeProperty('--hero-recede-progress')
    }

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let respectReducedMotion = motionQuery?.matches ?? false
    let frameId = 0
    let listenersAttached = false
    const legacyMotionQuery =
      motionQuery && !motionQuery.addEventListener && motionQuery.addListener ? motionQuery : null

    const syncDepth = () => {
      frameId = 0
      const rect = heroSection.getBoundingClientRect()
      const height = rect.height || 1
      const progress = Math.min(Math.max(-rect.top / height, 0), 1)

      if (Math.abs(progress - depthProgressRef.current) > 0.015) {
        depthProgressRef.current = progress
        setDepthProgress(progress)
      }

      setGlobalProgress(progress)

      const shouldCompress = progress > 0.12
      if (shouldCompress !== compressedStateRef.current) {
        compressedStateRef.current = shouldCompress
        setIsHeroCompressed(shouldCompress)
      }
    }

    const handleScroll = () => {
      if (respectReducedMotion || frameId) {
        return
      }
      frameId = window.requestAnimationFrame(syncDepth)
    }

    const attachListeners = () => {
      if (listenersAttached || respectReducedMotion) {
        return
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll)
      listenersAttached = true
    }

    const detachListeners = () => {
      if (!listenersAttached) {
        return
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      listenersAttached = false
    }

    const resetDepth = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
        frameId = 0
      }
      depthProgressRef.current = 0
      compressedStateRef.current = false
      setDepthProgress(0)
      setIsHeroCompressed(false)
      setGlobalProgress(0)
    }

    const handleMotionChange = (event) => {
      const prefersReduce =
        typeof event.matches === 'boolean' ? event.matches : motionQuery?.matches ?? false

      respectReducedMotion = prefersReduce

      if (prefersReduce) {
        detachListeners()
        resetDepth()
      } else {
        syncDepth()
        attachListeners()
      }
    }

    if (!respectReducedMotion) {
      syncDepth()
      attachListeners()
    } else {
      resetDepth()
    }

    motionQuery?.addEventListener?.('change', handleMotionChange)
    legacyMotionQuery?.addListener?.(handleMotionChange)

    return () => {
      detachListeners()
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      motionQuery?.removeEventListener?.('change', handleMotionChange)
      legacyMotionQuery?.removeListener?.(handleMotionChange)
      clearGlobalProgress()
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

  const statsWithRepoCount = useMemo(() => {
    if (!Array.isArray(stats)) {
      return []
    }

    return stats.map((stat) => {
      if (stat.id !== 'projects' || repoCount === null) {
        return stat
      }

      return { ...stat, value: `${repoCount}` }
    })
  }, [stats, repoCount])

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

  return (
    <AnimatedSection id="home" background="light" className="hero">
      <div
        ref={heroDepthRef}
        className={`hero__depth ${isHeroCompressed ? 'hero__depth--compressed' : ''}`}
        style={heroDepthStyle}
      >
        <div className="hero__layout">
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

          <div className="hero__content">
            <p className="hero__lede">{heroTagline}</p>
            <div className="hero__actions">
              {heroCta.map((cta) => {
                const variantClass = cta.variant === 'secondary' ? 'hero__button--ghost' : 'hero__button--solid'

                return (
                  <a key={cta.href} className={`hero__button ${variantClass}`} href={cta.href}>
                    <span className="hero__button-label">{cta.label}</span>
                  </a>
                )
              })}
            </div>
          </div>

          <aside className="hero__visual">
            <div ref={frameRef} className="hero__image-frame">
              <img
                ref={imageRef}
                className="hero__image"
                src={profilePhoto}
                alt={`Portrait of ${displayName}`}
                loading="lazy"
              />
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
          {statsWithRepoCount.map((stat) => (
            <li key={stat.id || stat.label}>
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
              <span className="hero__stat-detail">{stat.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  )
}

export default HeroSection

