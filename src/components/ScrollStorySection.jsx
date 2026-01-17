import { useEffect, useRef } from 'react'
import { profileContent } from '../data/portfolioContent'
import '../styles/ScrollStorySection.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function ScrollStorySection() {
  const { scrollStory } = profileContent
  const steps = scrollStory?.steps ?? []
  const sectionRef = useRef(null)
  const stepsRef = useRef([])
  const rafRef = useRef(0)

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) {
      return undefined
    }

    const stepElements = stepsRef.current.filter(Boolean)
    if (!stepElements.length) {
      return undefined
    }

    const totalSteps = stepElements.length

    const update = () => {
      const rect = sectionEl.getBoundingClientRect()
      const scrollSpan = Math.max(rect.height - window.innerHeight, 1)
      const progress = clamp(-rect.top / scrollSpan, 0, 1)

      sectionEl.style.setProperty('--story-progress', progress.toFixed(4))

      const stepPosition = progress * totalSteps
      const activeIndex = Math.min(totalSteps - 1, Math.floor(stepPosition))
      const stepProgress = stepPosition - activeIndex

      sectionEl.style.setProperty('--story-step', activeIndex)
      sectionEl.style.setProperty('--story-step-progress', stepProgress.toFixed(4))

      stepElements.forEach((stepEl, index) => {
        const isActive = index === activeIndex
        if (stepEl.dataset.active !== String(isActive)) {
          stepEl.dataset.active = isActive ? 'true' : 'false'
        }
        const normalized = index < activeIndex ? 1 : index > activeIndex ? 0 : stepProgress
        stepEl.style.setProperty('--step-progress', normalized.toFixed(4))
      })
    }

    const handleScroll = () => {
      if (rafRef.current) {
        return
      }
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0
        update()
      })
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [steps.length])

  if (!scrollStory) {
    return null
  }

  stepsRef.current = []
  const storyLength = Math.max(steps.length + 1, 3)

  return (
    <section
      id={scrollStory.id || 'story'}
      ref={sectionRef}
      className="scroll-story"
      style={{ '--story-length': storyLength }}
    >
      <div className="scroll-story__sticky">
        <div className="scroll-story__stage">
          <div className="scroll-story__copy">
            <p className="scroll-story__eyebrow eyebrow">{scrollStory.eyebrow}</p>
            <h2 className="scroll-story__title">{scrollStory.title}</h2>
            <p className="scroll-story__subtitle">{scrollStory.subtitle}</p>
            <div className="scroll-story__steps">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  ref={(node) => {
                    stepsRef.current[index] = node
                  }}
                  className="scroll-story__step"
                  data-active={index === 0 ? 'true' : 'false'}
                >
                  <p className="scroll-story__step-label">{step.label}</p>
                  <h3 className="scroll-story__step-title">{step.title}</h3>
                  <p className="scroll-story__step-description">{step.description}</p>
                </article>
              ))}
            </div>
            <div className="scroll-story__progress" aria-hidden="true">
              <span className="scroll-story__progress-track" />
              <span className="scroll-story__progress-bar" />
              <span className="scroll-story__progress-label">{scrollStory.progressLabel}</span>
            </div>
          </div>
          <div className="scroll-story__visual" aria-hidden="true">
            <div className="scroll-story__device">
              <div className="scroll-story__device-screen">
                <span className="scroll-story__device-gradient" />
                <span className="scroll-story__device-grid" />
                <span className="scroll-story__device-shine" />
              </div>
            </div>
            <div className="scroll-story__caption">
              <span className="scroll-story__caption-label">Full screen focus</span>
              <span className="scroll-story__caption-value">Scroll-driven layers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScrollStorySection
