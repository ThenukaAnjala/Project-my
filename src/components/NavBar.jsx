import { useEffect, useRef, useState } from 'react'
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

const MOBILE_BREAKPOINT = 960
const SCROLL_HIDE_OFFSET = 120
const SCROLL_ACTIVE_OFFSET = 12
const THEME_STORAGE_KEY = 'theme-preference'

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }
  } catch {
    // Ignore storage errors and fall back to system preference.
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const lastScrollY = useRef(0)

  const menuId = 'primary-navigation'
  const contactDetails = profileContent?.contact || {}
  const socials = contactDetails.socials || []
  const fallbackName = 'THENUKA GUNASEKARA'
  const brandName = (profileContent.name || fallbackName).trim() || fallbackName
  const [brandFirst, ...brandRest] = brandName.split(/\s+/)
  const brandLast = brandRest.join(' ')

  useEffect(() => {
    const syncCollapseState = () => {
      const isNarrowViewport = window.innerWidth <= MOBILE_BREAKPOINT
      setIsCollapsed(isNarrowViewport)
    }

    syncCollapseState()

    window.addEventListener('resize', syncCollapseState)

    return () => {
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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    let ticking = false

    const updateScrollState = () => {
      const currentY = window.scrollY || window.pageYOffset

      if (isMenuOpen) {
        setIsHidden(false)
        lastScrollY.current = currentY
        setIsScrolled(currentY > SCROLL_ACTIVE_OFFSET)
        return
      }

      const isBeyondHero = currentY > SCROLL_ACTIVE_OFFSET
      const isScrollingDown = currentY > lastScrollY.current && currentY > SCROLL_HIDE_OFFSET
      const shouldReveal = currentY <= SCROLL_HIDE_OFFSET

      setIsScrolled(isBeyondHero)
      setIsHidden(isScrollingDown && !shouldReveal)
      lastScrollY.current = currentY
    }

    const handleScroll = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(() => {
        updateScrollState()
        ticking = false
      })
    }

    updateScrollState()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isMenuOpen) {
      setIsHidden(false)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage errors (private mode, etc.).
    }
  }, [theme])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
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
  const isDarkTheme = theme === 'dark'
  const themeLabel = isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <>
      <header
        className={`navbar ${isCollapsed ? 'navbar--collapsed' : ''} ${isScrolled ? 'navbar--scrolled' : ''} ${
          isHidden ? 'navbar--hidden' : ''
        }`}
      >
        <a className="navbar__brand" href="#home" onClick={(event) => handleNavClick(event, 'home')}>
          <span className="navbar__logo" aria-hidden="true">
            TG
          </span>
          <span className="navbar__brand-text" role="text" aria-label={brandName}>
            <span className="navbar__brand-first" data-text={brandFirst}>
              {brandFirst}
            </span>
            {brandLast ? (
              <span className="navbar__brand-last" data-text={brandLast}>
                {brandLast}
              </span>
            ) : null}
          </span>
        </a>

        <div className="navbar__actions">
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

          <button
            type="button"
            className={`navbar__theme-toggle ${isDarkTheme ? 'navbar__theme-toggle--dark' : ''}`}
            onClick={toggleTheme}
            aria-pressed={isDarkTheme}
            aria-label={themeLabel}
          >
            <svg className="navbar__theme-icon navbar__theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="12" y1="2.5" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="21.5" />
                <line x1="2.5" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="21.5" y2="12" />
                <line x1="5.1" y1="5.1" x2="6.9" y2="6.9" />
                <line x1="17.1" y1="17.1" x2="18.9" y2="18.9" />
                <line x1="17.1" y1="6.9" x2="18.9" y2="5.1" />
                <line x1="5.1" y1="18.9" x2="6.9" y2="17.1" />
              </g>
            </svg>
            <svg className="navbar__theme-icon navbar__theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M15.6 12.2a6.4 6.4 0 0 1-7.8-7.8 7.5 7.5 0 1 0 7.8 7.8Z"
                fill="currentColor"
              />
            </svg>
            <span className="navbar__theme-knob" aria-hidden="true" />
          </button>

          <button
            className={`navbar__toggle ${isCollapsed ? 'navbar__toggle--visible' : ''} ${isMenuOpen ? 'navbar__toggle--active' : ''}`}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label="Toggle navigation"
            type="button"
          >
            <span className="navbar__toggle-line" />
            <span className="navbar__toggle-line" />
          </button>
        </div>
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
