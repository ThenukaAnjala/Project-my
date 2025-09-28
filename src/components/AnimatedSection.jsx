import { useEffect, useRef, useState } from 'react'
import './AnimatedSection.css'

function AnimatedSection({ id, background = 'light', className = '', children }) {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const classes = [
    'section',
    `section--${background}`,
    isVisible ? 'section--visible' : 'section--hidden',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id} ref={sectionRef} className={classes}>
      <div className="section__inner">{children}</div>
    </section>
  )
}

export default AnimatedSection
