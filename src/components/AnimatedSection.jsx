import { useEffect, useRef, useState } from 'react'
import '../styles/AnimatedSection.css'

function AnimatedSection({ id, background = 'light', className = '', children, revealOnScroll = true }) {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(() => {
    if (!revealOnScroll) {
      return true
    }

    if (typeof window === 'undefined' || !window.matchMedia) {
      return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (!revealOnScroll) {
      setIsVisible(true)
      return undefined
    }

    const sectionElement = sectionRef.current
    if (!sectionElement) {
      return undefined
    }

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return undefined
    }

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
    if (prefersReducedMotion) {
      setIsVisible(true)
      return undefined
    }

    let isCancelled = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          if (!isCancelled) {
            setIsVisible(true)
          }

          observer.unobserve(entry.target)
        })
      },
      {
        root: null,
        rootMargin: '-12% 0px -12% 0px',
        threshold: 0.2,
      },
    )

    observer.observe(sectionElement)

    return () => {
      isCancelled = true
      observer.disconnect()
    }
  }, [revealOnScroll])

  const classes = ['section', `section--${background}`, isVisible ? 'section--visible' : 'section--hidden', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id} ref={sectionRef} className={classes}>
      <div className="section__inner">{children}</div>
    </section>
  )
}

export default AnimatedSection

