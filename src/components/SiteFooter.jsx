import { profileContent } from '../data/portfolioContent'
import '../styles/SiteFooter.css'

function SiteFooter() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} {profileContent.name}. Designed as a concept inspired by modern motion-forward portfolios.</p>
    </footer>
  )
}

export default SiteFooter

