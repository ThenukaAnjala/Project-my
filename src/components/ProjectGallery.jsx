import AnimatedSection from './AnimatedSection'
import { profileContent } from '../data/portfolioContent'
import '../styles/ProjectGallery.css'

function ProjectGallery() {
  const { projects } = profileContent

  return (
    <AnimatedSection id="projects" background="light">
      <div className="section__header">
        <p className="eyebrow">Selected Work</p>
        <h2>Signature collaborations stitched with story-driven motion</h2>
        <p className="section__description">
          Each project balances narrative, usability, and engineering constraints to deliver experiences that feel crafted and performant.
        </p>
      </div>
      <div className="projects">
        {projects.map((project) => (
          <article key={project.name} className="projects__card">
            <div className="projects__card-meta">
              <span className="projects__badge">{project.badge}</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
            <div className="projects__footer">
              <ul className="pill-list">
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="projects__link" href={project.link} target="_blank" rel="noreferrer">
                {project.linkLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default ProjectGallery

