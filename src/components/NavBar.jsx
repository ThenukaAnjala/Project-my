import { useEffect, useState } from 'react'
import { profileContent } from '../data/portfolioContent'
import '../styles/NavBar.css'

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
]

const COLLAPSE_OFFSET = 140
const MOBILE_BREAKPOINT = 960

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuId = 'primary-navigation'
  const contactDetails = profileContent?.contact || {}
  const socials = contactDetails.socials || []

  useEffect(() => {
    const resolveCollapseThreshold = () => {
      const hero = document.getElementById('home')
      if (!hero) {
        return COLLAPSE_OFFSET
      }
      return Math.max(0, hero.offsetTop + hero.offsetHeight - COLLAPSE_OFFSET)
    }

    const syncCollapseState = () => {
      const threshold = resolveCollapseThreshold()
      const hasScrolledPastHero = window.scrollY >= threshold
      const isNarrowViewport = window.innerWidth <= MOBILE_BREAKPOINT
      setIsCollapsed(hasScrolledPastHero || isNarrowViewport)
    }

    syncCollapseState()

    window.addEventListener('scroll', syncCollapseState, { passive: true })
    window.addEventListener('resize', syncCollapseState)

    return () => {
      window.removeEventListener('scroll', syncCollapseState)
      window.removeEventListener('resize', syncCollapseState)
    }
  }, [])

  useEffect(() => {
    if (!isCollapsed && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isCollapsed, isMenuOpen])

  useEffect(() => {
    if (isCollapsed && isMenuOpen) {
      document.body.style.setProperty('overflow', 'hidden')
    } else {
      document.body.style.removeProperty('overflow')
    }

    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [isCollapsed, isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => setIsMenuOpen(false)

  const handleNavClick = (event, id) => {
    event.preventDefault()

    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }

    closeMenu()
  }

  const showInlineMenu = !isCollapsed
  const overlayIsVisible = isCollapsed && isMenuOpen

  return (
    <>
      <header className={`navbar ${isCollapsed ? 'navbar--collapsed' : ''}`}>
        <a className="navbar__brand" href="#home" onClick={(event) => handleNavClick(event, 'home')}>
          <span className="navbar__logo" aria-hidden="true">
            TG
          </span>
          <span className="navbar__brand-text">{profileContent.name}</span>
        </a>

        <button
          className={`navbar__toggle ${isCollapsed ? 'navbar__toggle--visible' : ''} ${isMenuOpen ? 'navbar__toggle--active' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label="Toggle navigation"
        >
          <span className="navbar__toggle-line" />
          <span className="navbar__toggle-line" />
        </button>

        <nav id={menuId} className={`navbar__menu ${showInlineMenu ? 'navbar__menu--visible' : ''}`} aria-hidden={!showInlineMenu}>
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => handleNavClick(event, section.id)}
              className="navbar__link"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      {overlayIsVisible ? (
        <div className="navbar__overlay" role="dialog" aria-modal="true" aria-labelledby="navbar-overlay-menu" onClick={closeMenu}>
          <div className="navbar__overlay-glow" aria-hidden="true" />
          <div className="navbar__overlay-content" onClick={(event) => event.stopPropagation()}>
            <button className="navbar__overlay-close" onClick={closeMenu} aria-label="Close navigation" />
            <nav className="navbar__overlay-menu" id="navbar-overlay-menu">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(event) => handleNavClick(event, section.id)}
                  className="navbar__overlay-link"
                >
                  {section.label}
                </a>
              ))}
            </nav>
            {(contactDetails.email || socials.length > 0) && (
              <div className="navbar__overlay-meta">
                {contactDetails.email ? (
                  <a className="navbar__overlay-email" href={`mailto:${contactDetails.email}`}>
                    <span className="navbar__overlay-label">Email</span>
                    <span className="navbar__overlay-email-address">{contactDetails.email}</span>
                  </a>
                ) : null}
                {socials.length > 0 ? (
                  <div className="navbar__overlay-socials">
                    {socials.map((social) => (
                      <a key={social.href} href={social.href} target="_blank" rel="noreferrer">
                        {social.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default NavBar
