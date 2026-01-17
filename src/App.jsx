import './App.css'
import NavBar from './components/NavBar'
import Home from './UI/Home'
import About from './UI/About'
import Stack from './UI/Stack'
import Projects from './UI/Projects'
import Testimonials from './UI/Testimonials'
import Contact from './UI/Contact'
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
