import './App.css'
import NavBar from './components/NavBar'
import Home from './components/Home'
import About from './components/About'
import Stack from './components/Stack'
import Projects from './components/Projects'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import SiteFooter from './components/SiteFooter'

function App() {
  return (
    <div className="page">
      <NavBar />
      <main className="page__content">
        <Home />
        <About />
        <Stack />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
