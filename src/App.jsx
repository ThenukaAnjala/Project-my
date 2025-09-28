import './App.css'
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import StackShowcase from './components/StackShowcase'
import ProjectGallery from './components/ProjectGallery'
import Testimonials from './components/Testimonials'
import ContactSection from './components/ContactSection'
import SiteFooter from './components/SiteFooter'

function App() {
  return (
    <div className="page">
      <NavBar />
      <main className="page__content">
        <HeroSection />
        <AboutSection />
        <StackShowcase />
        <ProjectGallery />
        <Testimonials />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
