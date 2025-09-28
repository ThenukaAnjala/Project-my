import { useState } from 'react'
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

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleNavClick = (event, id) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="navbar">
      <a className="navbar__brand" href="#home">
        <span className="navbar__logo" aria-hidden="true">
          AP
        </span>
        <span>{profileContent.name}</span>
      </a>
      <button className="navbar__toggle" onClick={toggleMenu} aria-expanded={isMenuOpen}>
        <span className="sr-only">Toggle navigation</span>
        <span className="navbar__toggle-line" />
        <span className="navbar__toggle-line" />
      </button>
      <nav className={`navbar__menu ${isMenuOpen ? 'navbar__menu--open' : ''}`}>
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
  )
}

export default NavBar

